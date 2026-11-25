import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Stub Webhook Endpoint untuk Integrasi Payment Gateway Otomatis (QRIS / VA)
 * Saat PAYMENT_MODE="AUTO_GATEWAY" diaktifkan di kemudian hari.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    console.log("[Payment Webhook Received]:", rawBody);

    const orderCode = rawBody.order_id || rawBody.orderCode || rawBody.external_id;
    const transactionStatus = rawBody.transaction_status || rawBody.status;

    if (!orderCode) {
      return NextResponse.json({ error: "Missing order identifier" }, { status: 400 });
    }

    const order = await db.publicOrder.findUnique({
      where: { orderCode },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (transactionStatus === "settlement" || transactionStatus === "paid" || transactionStatus === "SUCCESS") {
      const targetStatus =
        order.scheme === "PUBLIC_FULL_100" ? "PAID_100_VERIFIED" : "DP_50_VERIFIED";

      await db.$transaction(async (tx) => {
        await tx.publicOrder.update({
          where: { orderCode },
          data: {
            paymentGateStatus: targetStatus,
            verifiedById: "AUTO_GATEWAY_WEBHOOK",
            verifiedAt: new Date(),
            auditLogs: {
              create: {
                actorName: "AUTO_GATEWAY_WEBHOOK",
                action: "GATEWAY_SETTLEMENT",
                beforeStatus: order.paymentGateStatus,
                afterStatus: targetStatus,
                note: `Pembayaran otomatis terkonfirmasi oleh sistem gateway`,
              },
            },
          },
        });

        // Update graduation cash counter
        await tx.graduationCashCounter.upsert({
          where: { id: "karyakita_cash" },
          create: {
            id: "karyakita_cash",
            currentCashIdr: order.requiredAmountIdr,
            targetCashIdr: BigInt(3500000),
          },
          update: {
            currentCashIdr: {
              increment: order.requiredAmountIdr,
            },
          },
        });
      });

      return NextResponse.json({ success: true, message: "Payment processed" });
    }

    return NextResponse.json({ received: true, status: transactionStatus });
  } catch (err: unknown) {
    console.error("[Payment Webhook Error]:", err);
    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
}
