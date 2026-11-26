import { db } from "@/lib/db";
import { PublicOrder } from "@prisma/client";

export interface HubUnitInfo {
  hubUnitId: string;
  name: string;
  defaultPicId: string;
}

/**
 * Pemetaan unit bisnis karyakita-web ke struktur KaryaKita Hub OS
 */
export function mapUnitCodeToHub(unitCode: string): HubUnitInfo {
  const normalized = (unitCode || "").toLowerCase().trim();

  switch (normalized) {
    case "design":
      return {
        hubUnitId: "LINI_1_DESIGN",
        name: "KaryaKita Design (Lini 1)",
        defaultPicId: "ahmad", // Ahmad Maulana
      };
    case "webtech":
      return {
        hubUnitId: "LINI_2_WEBTECH",
        name: "KaryaKita WebTech (Lini 2)",
        defaultPicId: "alfatih", // Syauqi Muhammad Al Fatih
      };
    case "assist":
      return {
        hubUnitId: "LINI_3_ASSIST_DATA",
        name: "KaryaKita Assist & Data (Lini 3)",
        defaultPicId: "hilwa", // Hilwa Mufida
      };
    case "media":
      return {
        hubUnitId: "LINI_4_MEDIA_AFFILIATE",
        name: "KaryaKita Media & Affiliate (Lini 4)",
        defaultPicId: "syarah", // Syarah Fauziah
      };
    case "academy":
      return {
        hubUnitId: "LINI_5_AI_ACADEMY",
        name: "KaryaKita AI Academy (Lini 5)",
        defaultPicId: "nazwa", // Nazwa Azahra
      };
    case "bundle":
    default:
      return {
        hubUnitId: "LINI_2_WEBTECH",
        name: "KaryaKita WebTech (Lini 2)",
        defaultPicId: "alfatih",
      };
  }
}

/**
 * Sinkronisasi satu pesanan karyakita-web ke studio_state KaryaKita Hub
 */
export async function syncOrderToHub(
  orderOrCode: PublicOrder | string,
  overrideStatus?: string
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  try {
    let order: PublicOrder | null = null;

    if (typeof orderOrCode === "string") {
      order = await db.publicOrder.findUnique({
        where: { orderCode: orderOrCode },
      });
    } else {
      order = orderOrCode;
    }

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan di database" };
    }

    const currentStatus = overrideStatus || order.paymentGateStatus;
    const unitInfo = mapUnitCodeToHub(order.unitCode);
    const projectId = `proj-${order.orderCode}`;
    const leadId = `lead-${order.orderCode}`;
    const contractValue = Number(order.contractValueIdr);
    const requiredAmount = Number(order.requiredAmountIdr);
    const now = Date.now();
    const todayStr = new Date().toISOString().split("T")[0];
    const isVerified =
      currentStatus === "DP_50_VERIFIED" || currentStatus === "PAID_100_VERIFIED";

    // Muat main_state dari database studio_state
    const row = await db.studioState.findUnique({
      where: { key: "main_state" },
    });

    if (!row || !row.state || typeof row.state !== "object") {
      console.warn("[Hub Sync] main_state belum ada di studio_state table");
      return { success: false, error: "main_state tidak ditemukan di studio_state" };
    }

    // Clone state
    const state = JSON.parse(JSON.stringify(row.state));

    if (!Array.isArray(state.projects)) state.projects = [];
    if (!Array.isArray(state.cashflow)) state.cashflow = [];
    if (!Array.isArray(state.crmLeads)) state.crmLeads = [];
    if (!Array.isArray(state.auditLogs)) state.auditLogs = [];

    // 1. Sinkronisasi Data Proyek (Projects)
    const existingProjectIndex = state.projects.findIndex(
      (p: { id?: string; orderCode?: string }) =>
        p.id === projectId || p.orderCode === order!.orderCode
    );

    const projectData = {
      id: projectId,
      title: `Proyek ${unitInfo.name.split(" ")[1] || order.unitCode.toUpperCase()} - ${order.customerName}${
        order.organization ? ` (${order.organization})` : ""
      }`,
      clientName: order.customerName,
      customerWhatsapp: order.customerWhatsapp,
      customerEmail: order.customerEmail,
      organization: order.organization || "",
      notes: order.notes || "",
      orderCode: order.orderCode,
      unitId: unitInfo.hubUnitId,
      contractValueIdr: contractValue,
      picId: unitInfo.defaultPicId,
      createdById: "alfatih",
      paymentGateStatus: currentStatus,
      dpVerifiedById: isVerified ? order.verifiedById || "novita" : null,
      dpVerifiedAt: isVerified
        ? order.verifiedAt
          ? new Date(order.verifiedAt).toISOString().split("T")[0]
          : todayStr
        : null,
      dpProofUrl: order.proofUrl || null,
      slaDeadline: null,
      clientPortalToken: order.portalToken,
      revisionQuota: 3,
      revisionUsed:
        existingProjectIndex !== -1
          ? state.projects[existingProjectIndex].revisionUsed || 0
          : 0,
      _updatedAt: now,
    };

    if (existingProjectIndex !== -1) {
      // Pertahankan field custom jika sudah ada progress di Hub
      state.projects[existingProjectIndex] = {
        ...state.projects[existingProjectIndex],
        ...projectData,
      };
    } else {
      state.projects.unshift(projectData);
    }

    // 2. Sinkronisasi Lead CRM (crmLeads)
    const existingLeadIndex = state.crmLeads.findIndex(
      (l: { id?: string; convertedProjectId?: string }) =>
        l.id === leadId || l.convertedProjectId === projectId
    );

    const leadData = {
      id: leadId,
      businessName: order.organization || order.customerName,
      targetUnitId: unitInfo.hubUnitId,
      estimatedValueIdr: contractValue,
      picId: unitInfo.defaultPicId,
      stage: isVerified ? "CONVERTED" : "NEGOTIATION",
      contactName: order.customerName,
      contactEmail: order.customerEmail,
      contactPhone: order.customerWhatsapp,
      notes: `Order masuk dari Landing Page: ${order.orderCode}. ${order.notes || ""}`,
      convertedProjectId: projectId,
      lastFollowUpDaysAgo: 0,
      _updatedAt: now,
    };

    if (existingLeadIndex !== -1) {
      state.crmLeads[existingLeadIndex] = {
        ...state.crmLeads[existingLeadIndex],
        ...leadData,
      };
    } else {
      state.crmLeads.unshift(leadData);
    }

    // 3. Sinkronisasi Arus Kas Keuangan (Cashflow) jika pembayaran sah
    if (isVerified) {
      const isDp50 = currentStatus === "DP_50_VERIFIED";
      const cashflowId = `cf-${order.orderCode}-${isDp50 ? "dp50" : "paid100"}`;
      const existingCashIndex = state.cashflow.findIndex(
        (cf: { id?: string }) => cf.id === cashflowId
      );

      const cashEntry = {
        id: cashflowId,
        date: order.verifiedAt
          ? new Date(order.verifiedAt).toISOString().split("T")[0]
          : todayStr,
        type: "INCOME",
        unitId: unitInfo.hubUnitId,
        projectId: projectId,
        category: unitInfo.name,
        amountIdr: requiredAmount,
        description: `${isDp50 ? "DP 50%" : "Pelunasan 100%"} Kontrak (${order.customerName} - ${
          order.orderCode
        })`,
        proofUrl: order.proofUrl || "",
        createdById: "novita",
        _updatedAt: now,
      };

      if (existingCashIndex !== -1) {
        state.cashflow[existingCashIndex] = {
          ...state.cashflow[existingCashIndex],
          ...cashEntry,
        };
      } else {
        state.cashflow.unshift(cashEntry);
      }
    }

    // 4. Catat Audit Log di Hub OS
    state.auditLogs.unshift({
      id: `aud-sync-${now}-${Math.random().toString(36).slice(2, 6)}`,
      actorName: isVerified ? "Novita Rani (CFO)" : "Sistem Integrasi Web",
      action: isVerified ? "PAYMENT_GATE_VERIFIED" : "PROJECT_SYNCED",
      entity: `Project: ${projectData.title}`,
      details: `Sinkronisasi otomatis portal web: status ${currentStatus}, nilai Rp${contractValue.toLocaleString(
        "id-ID"
      )}.`,
      timestamp:
        new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB",
    });

    // Batasi log audit agar tidak membengkak di JSON
    if (state.auditLogs.length > 300) {
      state.auditLogs = state.auditLogs.slice(0, 300);
    }

    // Simpan kembali ke studio_state
    await db.studioState.update({
      where: { key: "main_state" },
      data: {
        state: state,
        updatedAt: new Date(),
      },
    });

    console.log(
      `[Hub Sync] Berhasil mensinkronkan ${order.orderCode} (status: ${currentStatus}) ke KaryaKita Hub.`
    );
    return { success: true, projectId };
  } catch (err: unknown) {
    console.error("[Hub Sync Error]:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gagal sinkronisasi ke Hub",
    };
  }
}

/**
 * Sinkronisasi massal seluruh pesanan yang ada di database ke Hub OS
 */
export async function syncAllOrdersToHub(): Promise<{
  total: number;
  synced: number;
  errors: string[];
}> {
  const orders = await db.publicOrder.findMany({
    orderBy: { createdAt: "asc" },
  });

  let synced = 0;
  const errors: string[] = [];

  for (const order of orders) {
    const res = await syncOrderToHub(order);
    if (res.success) {
      synced++;
    } else {
      errors.push(`${order.orderCode}: ${res.error || "Gagal sinkron"}`);
    }
  }

  return {
    total: orders.length,
    synced,
    errors,
  };
}
