import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendWhatsAppTextMessage } from "@/lib/whatsapp/client";

const verifySchema = z.object({
  action: z.enum(["APPROVE", "REJECT", "REQUEST_FINAL_50"]),
  rejectionReason: z.string().optional(),
  pin: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();

    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { action, rejectionReason, pin } = parsed.data;

    // Validasi PIN Keamanan CFO (wajib cocok)
    const expectedPin = process.env.ADMIN_CFO_SECRET_PIN || "192837";
    if (!pin || pin !== expectedPin) {
      return NextResponse.json({ error: "PIN Otorisasi CFO tidak valid." }, { status: 403 });
    }

    const existingOrder = await db.publicOrder.findUnique({
      where: { orderCode: code },
      include: {
        auditLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const beforeStatus = existingOrder.paymentGateStatus;
    let afterStatus = beforeStatus;
    let fulfillmentPayload: Record<string, string> | null = null;
    const hasPriorDpVerified = existingOrder.auditLogs.some(
      (log) => log.afterStatus === "DP_50_VERIFIED"
    );

    if (action === "REQUEST_FINAL_50") {
      afterStatus = "WAITING_FINAL_50";
    } else if (action === "APPROVE") {
      if (existingOrder.scheme === "PUBLIC_FULL_100") {
        afterStatus = "PAID_100_VERIFIED";
        fulfillmentPayload = {
          zoomLink: "https://meet.google.com/karyakita-ai-academy-batch1",
          waGroupLink: "https://chat.whatsapp.com/KaryaKitaAIAcademyB1",
          promptPackUrl: "https://karyakita-ai.vercel.app/resources/karyakita-prompt-pack-v1.pdf",
          message:
            "Selamat! Pembayaran Anda telah disahkan oleh Novita (CFO). Silakan gabung ke WhatsApp Group dan akses materi di atas.",
        };
      } else {
        // B2B flow: bedakan verifikasi DP 50% awal vs Pelunasan 50% akhir
        if (beforeStatus === "WAITING_FINAL_50" || hasPriorDpVerified) {
          afterStatus = "PAID_100_VERIFIED";
          fulfillmentPayload = {
            projectFilesUrl: "https://drive.google.com/drive/folders/karyakita-master-handoff",
            message:
              "Seluruh kewajiban lunas. Berkas master final dan hak cipta telah diserahkan.",
          };
        } else {
          afterStatus = "DP_50_VERIFIED";
        }
      }
    } else {
      afterStatus = "REJECTED_PROOF";
    }

    const auditAction =
      action === "APPROVE"
        ? "APPROVE_PAYMENT"
        : action === "REQUEST_FINAL_50"
        ? "REQUEST_FINAL_50"
        : "REJECT_PAYMENT";

    const auditNote =
      action === "APPROVE"
        ? `Pembayaran (${afterStatus}) disahkan sebesar Rp${Number(existingOrder.requiredAmountIdr).toLocaleString("id-ID")}`
        : action === "REQUEST_FINAL_50"
        ? "Tahap pengerjaan selesai; gerbang tagihan pelunasan 50% dibuka untuk klien."
        : `Bukti ditolak: ${rejectionReason}`;

    // Eksekusi Transaction di Prisma
    const updatedOrder = await db.$transaction(async (tx) => {
      const order = await tx.publicOrder.update({
        where: { orderCode: code },
        data: {
          paymentGateStatus: afterStatus,
          rejectionReason: action === "REJECT" ? rejectionReason || "Bukti transfer tidak valid" : null,
          verifiedById: action === "REQUEST_FINAL_50" ? existingOrder.verifiedById : "Novita Rani (CFO)",
          verifiedAt: action === "REQUEST_FINAL_50" ? existingOrder.verifiedAt : new Date(),
          fulfillmentJson: fulfillmentPayload || existingOrder.fulfillmentJson || undefined,
          auditLogs: {
            create: {
              actorName: "Novita Rani (CFO)",
              action: auditAction,
              beforeStatus,
              afterStatus,
              note: auditNote,
            },
          },
        },
      });

      // Jika disetujui, update kas di GraduationCashCounter
      if (action === "APPROVE") {
        await tx.graduationCashCounter.upsert({
          where: { id: "karyakita_cash" },
          create: {
            id: "karyakita_cash",
            currentCashIdr: existingOrder.requiredAmountIdr,
            targetCashIdr: BigInt(3500000),
          },
          update: {
            currentCashIdr: {
              increment: existingOrder.requiredAmountIdr,
            },
          },
        });
      }

      return order;
    });

    // Notifikasi Otomatis via WhatsApp (Graceful Skip bila belum terpasang)
    try {
      if (process.env.WHATSAPP_ACCESS_TOKEN && existingOrder.customerWhatsapp) {
        const cleanPhone = existingOrder.customerWhatsapp.replace(/\D/g, "");
        const msgText =
          action === "APPROVE"
            ? `*Halo ${existingOrder.customerName}!*\n\nPembayaran Anda untuk pesanan *${existingOrder.orderCode}* telah *DISETUJUI & DISAHKAN* oleh Novita (CFO KaryaKita).\n\nCek status dan akses layanan Anda di:\n${process.env.NEXT_PUBLIC_APP_URL || "https://karyakita-ai.vercel.app"}/status/${existingOrder.orderCode}\n\nTerima kasih telah berkolaborasi bersama KaryaKita!`
            : `*Halo ${existingOrder.customerName}*,\n\nMohon maaf, bukti transfer untuk pesanan *${existingOrder.orderCode}* belum dapat kami sahkan dengan alasan:\n"${rejectionReason}"\n\nSilakan unggah ulang bukti yang benar di tautan berikut:\n${process.env.NEXT_PUBLIC_APP_URL || "https://karyakita-ai.vercel.app"}/status/${existingOrder.orderCode}`;

        await sendWhatsAppTextMessage(cleanPhone, msgText);
      }
    } catch (waErr) {
      console.warn("[Auto-Notification WhatsApp Warning]:", waErr);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        orderCode: updatedOrder.orderCode,
        portalToken: updatedOrder.portalToken,
        scheme: updatedOrder.scheme,
        unitCode: updatedOrder.unitCode,
        customerName: updatedOrder.customerName,
        customerWhatsapp: updatedOrder.customerWhatsapp,
        customerEmail: updatedOrder.customerEmail,
        contractValueIdr: Number(updatedOrder.contractValueIdr),
        requiredAmountIdr: Number(updatedOrder.requiredAmountIdr),
        paymentGateStatus: updatedOrder.paymentGateStatus,
        rejectionReason: updatedOrder.rejectionReason,
        verifiedById: updatedOrder.verifiedById,
        verifiedAt: updatedOrder.verifiedAt?.toISOString(),
        fulfillmentJson: updatedOrder.fulfillmentJson,
      },
    });
  } catch (err: unknown) {
    console.error("[CFO Verification Error]:", err);
    return NextResponse.json({ error: "Gagal memproses verifikasi order." }, { status: 500 });
  }
}
