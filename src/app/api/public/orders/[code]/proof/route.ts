import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { syncOrderToHub } from "@/lib/hub/sync-service";

const proofSchema = z.object({
  proofUrl: z.string().min(10, "Bukti transfer tidak valid"),
  proofAmountIdr: z.number().int().positive("Nominal transfer wajib diisi"),
  senderNotes: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();

    const parsed = proofSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { proofUrl, proofAmountIdr, senderNotes } = parsed.data;

    const existingOrder = await db.publicOrder.findUnique({
      where: { orderCode: code },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const beforeStatus = existingOrder.paymentGateStatus;
    const afterStatus = "VERIFYING_PROOF";

    const updated = await db.publicOrder.update({
      where: { orderCode: code },
      data: {
        proofUrl,
        proofAmountIdr: BigInt(proofAmountIdr),
        proofSubmittedAt: new Date(),
        paymentGateStatus: afterStatus,
        rejectionReason: null, // Reset alasan penolakan jika sebelumnya ditolak
        notes: senderNotes
          ? `${existingOrder.notes ? existingOrder.notes + " | " : ""}Catatan Transfer: ${senderNotes}`
          : existingOrder.notes,
        auditLogs: {
          create: {
            actorName: existingOrder.customerName,
            action: "SUBMIT_PAYMENT_PROOF",
            beforeStatus,
            afterStatus,
            note: `Bukti transfer diunggah sebesar Rp${proofAmountIdr.toLocaleString(
              "id-ID"
            )}`,
          },
        },
      },
    });

    // Sinkronisasi status bukti transfer ke KaryaKita Hub OS
    try {
      await syncOrderToHub(updated);
    } catch (syncErr) {
      console.warn("[Hub Auto-Sync Warning on Proof Upload]:", syncErr);
    }

    return NextResponse.json({
      success: true,
      orderCode: updated.orderCode,
      paymentGateStatus: updated.paymentGateStatus,
    });
  } catch (err: unknown) {
    console.error("[Upload Proof API Error]:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan bukti transfer." },
      { status: 500 }
    );
  }
}
