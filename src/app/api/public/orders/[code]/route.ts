import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maskWhatsapp, maskEmail } from "@/lib/payment/order-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const token = req.nextUrl.searchParams.get("token");

    // Cari berdasarkan orderCode atau portalToken
    const order = await db.publicOrder.findFirst({
      where: {
        OR: [{ orderCode: code }, ...(token ? [{ portalToken: token }] : [])],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    // Masking data sensitif untuk keamanan publik
    return NextResponse.json({
      id: order.id,
      orderCode: order.orderCode,
      portalToken: order.portalToken,
      scheme: order.scheme,
      unitCode: order.unitCode,
      customerName: order.customerName,
      customerWhatsapp: maskWhatsapp(order.customerWhatsapp),
      customerEmail: maskEmail(order.customerEmail),
      organization: order.organization,
      notes: order.notes,
      contractValueIdr: Number(order.contractValueIdr),
      requiredAmountIdr: Number(order.requiredAmountIdr),
      paymentGateStatus: order.paymentGateStatus,
      proofUrl: order.proofUrl,
      proofAmountIdr: order.proofAmountIdr ? Number(order.proofAmountIdr) : null,
      proofSubmittedAt: order.proofSubmittedAt?.toISOString() || null,
      rejectionReason: order.rejectionReason,
      verifiedById: order.verifiedById,
      verifiedAt: order.verifiedAt?.toISOString() || null,
      fulfillmentJson: order.fulfillmentJson,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    console.error("[Get Order API Error]:", err);
    return NextResponse.json(
      { error: "Gagal memuat detail pesanan" },
      { status: 500 }
    );
  }
}
