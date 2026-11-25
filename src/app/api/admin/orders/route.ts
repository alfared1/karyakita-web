import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentGateStatus } from "@/types/payment-gate";

export async function GET(req: NextRequest) {
  try {
    const providedPin =
      req.headers.get("x-cfo-pin") || req.nextUrl.searchParams.get("pin");
    const expectedPin = process.env.ADMIN_CFO_SECRET_PIN || "192837";
    if (!providedPin || providedPin !== expectedPin) {
      return NextResponse.json(
        { error: !providedPin ? "Otorisasi PIN CFO diperlukan." : "PIN Otorisasi CFO tidak valid." },
        { status: 401 }
      );
    }

    const statusFilter = req.nextUrl.searchParams.get("status") as PaymentGateStatus | null;

    const where = statusFilter ? { paymentGateStatus: statusFilter } : {};

    const [orders, totalCash] = await Promise.all([
      db.publicOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          auditLogs: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      }),
      db.graduationCashCounter.findUnique({
        where: { id: "karyakita_cash" },
      }),
    ]);

    // Format BigInt to number for JSON response
    const formattedOrders = orders.map((o) => ({
      id: o.id,
      orderCode: o.orderCode,
      portalToken: o.portalToken,
      scheme: o.scheme,
      unitCode: o.unitCode,
      customerName: o.customerName,
      customerWhatsapp: o.customerWhatsapp,
      customerEmail: o.customerEmail,
      organization: o.organization,
      notes: o.notes,
      contractValueIdr: Number(o.contractValueIdr),
      requiredAmountIdr: Number(o.requiredAmountIdr),
      paymentGateStatus: o.paymentGateStatus,
      proofUrl: o.proofUrl,
      proofAmountIdr: o.proofAmountIdr ? Number(o.proofAmountIdr) : null,
      proofSubmittedAt: o.proofSubmittedAt?.toISOString() || null,
      rejectionReason: o.rejectionReason,
      verifiedById: o.verifiedById,
      verifiedAt: o.verifiedAt?.toISOString() || null,
      fulfillmentJson: o.fulfillmentJson,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      auditLogs: o.auditLogs.map((a) => ({
        id: a.id,
        actorName: a.actorName,
        action: a.action,
        afterStatus: a.afterStatus,
        note: a.note,
        createdAt: a.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({
      orders: formattedOrders,
      currentCashIdr: totalCash ? Number(totalCash.currentCashIdr) : 0,
      targetCashIdr: totalCash ? Number(totalCash.targetCashIdr) : 3500000,
      counts: {
        all: formattedOrders.length,
        verifying: formattedOrders.filter((o) => o.paymentGateStatus === "VERIFYING_PROOF").length,
        waiting: formattedOrders.filter(
          (o) =>
            o.paymentGateStatus === "LOCKED_WAITING_DP" ||
            o.paymentGateStatus === "WAITING_FULL_100" ||
            o.paymentGateStatus === "WAITING_FINAL_50"
        ).length,
        verified: formattedOrders.filter(
          (o) =>
            o.paymentGateStatus === "DP_50_VERIFIED" ||
            o.paymentGateStatus === "PAID_100_VERIFIED"
        ).length,
        rejected: formattedOrders.filter((o) => o.paymentGateStatus === "REJECTED_PROOF").length,
      },
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    console.error("[Admin Get Orders Error]:", err);
    return NextResponse.json({ error: "Gagal memuat daftar pesanan" }, { status: 500 });
  }
}
