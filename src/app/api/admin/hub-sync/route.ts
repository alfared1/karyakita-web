import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncAllOrdersToHub, syncOrderToHub } from "@/lib/hub/sync-service";

export async function GET() {
  try {
    const row = await db.studioState.findUnique({
      where: { key: "main_state" },
    });

    const webOrdersCount = await db.publicOrder.count();

    const state = (row?.state as Record<string, unknown>) || {};
    const hubProjects = Array.isArray(state.projects) ? state.projects : [];
    const hubCashflow = Array.isArray(state.cashflow) ? state.cashflow : [];
    const hubLeads = Array.isArray(state.crmLeads) ? state.crmLeads : [];

    return NextResponse.json({
      success: true,
      webOrdersCount,
      hubProjectsCount: hubProjects.length,
      hubCashflowCount: hubCashflow.length,
      hubLeadsCount: hubLeads.length,
      hubUpdatedAt: row?.updatedAt,
      sampleProjects: hubProjects.slice(0, 5),
    });
  } catch (err: unknown) {
    console.error("[Hub Sync Status Error]:", err);
    return NextResponse.json(
      { error: "Gagal membaca status sinkronisasi Hub" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderCode, pin } = body;

    const expectedPin = process.env.ADMIN_CFO_SECRET_PIN || "192837";
    if (pin && pin !== expectedPin) {
      return NextResponse.json(
        { error: "PIN Otorisasi CFO tidak valid" },
        { status: 403 }
      );
    }

    if (orderCode) {
      const res = await syncOrderToHub(orderCode);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: `Pesanan ${orderCode} berhasil disinkronkan ke KaryaKita Hub`,
      });
    }

    // Sync all
    const result = await syncAllOrdersToHub();
    return NextResponse.json({
      success: true,
      message: `Berhasil mensinkronkan ${result.synced} dari ${result.total} pesanan ke KaryaKita Hub.`,
      result,
    });
  } catch (err: unknown) {
    console.error("[Hub Sync Trigger Error]:", err);
    return NextResponse.json(
      { error: "Gagal memproses sinkronisasi ke Hub" },
      { status: 500 }
    );
  }
}
