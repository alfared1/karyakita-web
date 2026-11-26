import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  generateOrderCode,
  generatePortalToken,
  checkRateLimit,
} from "@/lib/payment/order-utils";
import { syncOrderToHub } from "@/lib/hub/sync-service";

const createOrderSchema = z.object({
  customerName: z.string().min(2, "Nama minimal 2 karakter"),
  customerWhatsapp: z
    .string()
    .min(9, "Nomor WhatsApp tidak valid")
    .regex(/^(\+62|62|08)[0-9]{8,13}$/, "Gunakan format nomor WhatsApp Indonesia (08xx / 628xx)"),
  customerEmail: z.string().email("Format email tidak valid"),
  unitCode: z.string().default("academy"),
  scheme: z.enum(["PUBLIC_FULL_100", "B2B_SPLIT_50_50"]).default("PUBLIC_FULL_100"),
  contractValueIdr: z.number().int().positive("Nilai kontrak harus lebih dari 0"),
  requiredAmountIdr: z.number().int().positive("Nominal tagihan harus lebih dari 0"),
  organization: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan pemesanan. Mohon tunggu beberapa menit." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = parsed.data;
    const orderCode = generateOrderCode(data.unitCode);
    const portalToken = generatePortalToken();

    // Default status: WAITING_FULL_100 untuk publik, LOCKED_WAITING_DP untuk B2B
    const initialStatus =
      data.scheme === "PUBLIC_FULL_100" ? "WAITING_FULL_100" : "LOCKED_WAITING_DP";

    const order = await db.publicOrder.create({
      data: {
        orderCode,
        portalToken,
        scheme: data.scheme,
        unitCode: data.unitCode,
        customerName: data.customerName,
        customerWhatsapp: data.customerWhatsapp,
        customerEmail: data.customerEmail,
        organization: data.organization || null,
        notes: data.notes || null,
        contractValueIdr: BigInt(data.contractValueIdr),
        requiredAmountIdr: BigInt(data.requiredAmountIdr),
        paymentGateStatus: initialStatus,
        auditLogs: {
          create: {
            actorName: data.customerName,
            action: "CREATE_ORDER",
            beforeStatus: null,
            afterStatus: initialStatus,
            note: `Pesanan dibuat oleh klien (${data.scheme})`,
          },
        },
      },
    });

    // Sinkronisasi otomatis pesanan baru ke KaryaKita Hub OS (Lead & Project Waiting DP)
    try {
      await syncOrderToHub(order);
    } catch (syncErr) {
      console.warn("[Hub Auto-Sync Warning on Order Creation]:", syncErr);
    }

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      portalToken: order.portalToken,
      paymentGateStatus: order.paymentGateStatus,
      requiredAmountIdr: Number(order.requiredAmountIdr),
    });
  } catch (err: unknown) {
    console.error("[Create Order API Error]:", err);
    return NextResponse.json(
      { error: "Gagal membuat pesanan di database. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
