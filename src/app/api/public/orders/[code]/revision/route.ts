import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const revisionSchema = z.object({
  note: z.string().min(5, "Catatan revisi minimal 5 karakter"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json().catch(() => ({}));

    const parsed = revisionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { note } = parsed.data;

    const order = await db.publicOrder.findUnique({
      where: { orderCode: code },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    const projectId = `proj-${order.orderCode}`;

    // Ambil studio_state
    const row = await db.studioState.findUnique({
      where: { key: "main_state" },
    });

    if (!row || !row.state || typeof row.state !== "object") {
      return NextResponse.json(
        { error: "Sistem studio sedang tidak dapat diakses." },
        { status: 500 }
      );
    }

    const state = JSON.parse(JSON.stringify(row.state));
    if (!Array.isArray(state.revisionTriage)) state.revisionTriage = [];
    if (!Array.isArray(state.auditLogs)) state.auditLogs = [];

    const projects = Array.isArray(state.projects) ? state.projects : [];
    const proj = projects.find(
      (p: { id?: string; orderCode?: string }) =>
        p.id === projectId || p.orderCode === order.orderCode
    );

    const revisionUsed = typeof proj?.revisionUsed === "number" ? proj.revisionUsed : 0;
    const revisionQuota = typeof proj?.revisionQuota === "number" ? proj.revisionQuota : 3;
    const isOutOfQuota = revisionUsed >= revisionQuota;

    const revisionItem = {
      id: "rev-" + Date.now(),
      projectId,
      orderCode: order.orderCode,
      note: note.trim(),
      clientName: order.customerName,
      submittedAt: Date.now(),
      triageStatus: "PENDING_TRIAGE",
      isOutOfQuota,
      _updatedAt: Date.now(),
    };

    state.revisionTriage.unshift(revisionItem);

    state.auditLogs.unshift({
      id: `aud-rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actorName: `${order.customerName} (Klien)`,
      action: "CLIENT_REVISION_SUBMITTED",
      entity: `Project: ${proj ? proj.title : order.orderCode}`,
      details: `Klien mengajukan masukan/revisi baru: "${note.slice(0, 100)}..." (${
        isOutOfQuota ? "Melebihi Kuota Resmi" : "Dalam Kuota"
      }).`,
      timestamp: new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB",
    });

    // Simpan kembali ke database
    await db.studioState.update({
      where: { key: "main_state" },
      data: {
        state: state,
        updatedAt: new Date(),
      },
    });

    // Catat juga ke audit order Prisma
    await db.orderAuditLog.create({
      data: {
        orderId: order.id,
        actorName: `${order.customerName} (Klien)`,
        action: "SUBMIT_REVISION_REQUEST",
        beforeStatus: order.paymentGateStatus,
        afterStatus: order.paymentGateStatus,
        note: `Masukan revisi dikirim: "${note.slice(0, 150)}"`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Catatan revisi Anda berhasil dikirim ke tim studio KaryaKita Hub.",
      revision: revisionItem,
    });
  } catch (err: unknown) {
    console.error("[Submit Revision API Error]:", err);
    return NextResponse.json(
      { error: "Gagal mengirimkan catatan revisi." },
      { status: 500 }
    );
  }
}
