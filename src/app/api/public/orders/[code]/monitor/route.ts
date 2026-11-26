import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maskWhatsapp, maskEmail } from "@/lib/payment/order-utils";

interface DefaultPhase {
  title: string;
  desc: string;
  defaultStatus: "TODO" | "IN_PROGRESS" | "DONE" | "REVIEW";
  hoursEstimate: number;
}

const DEFAULT_UNIT_WORKFLOWS: Record<string, DefaultPhase[]> = {
  LINI_1_DESIGN: [
    { title: "Briefing Teknis & Penyelarasan Konsep Visual", desc: "Membedah preferensi estetika, referensi gaya, dan target audiens.", defaultStatus: "DONE", hoursEstimate: 2 },
    { title: "Eksplorasi Moodboard, Warna & Tipografi", desc: "Penyusunan palet warna syariah berkarakter dan kurasi tipografi utama.", defaultStatus: "IN_PROGRESS", hoursEstimate: 3 },
    { title: "Desain Layout Utama & Komponen Prototipe", desc: "Produksi aset desain resolusi tinggi dan mockup aplikasi visual.", defaultStatus: "TODO", hoursEstimate: 4 },
    { title: "Review Kualitas Studio & Jendela Revisi Klien", desc: "Pemeriksaan konsistensi brand dan penampungan masukan dari klien.", defaultStatus: "TODO", hoursEstimate: 2 },
    { title: "Penyerahan Berkas Master (SVG, AI, PDF) & Handoff", desc: "Ekspor seluruh aset final, lisensi hak cipta, dan panduan penggunaan.", defaultStatus: "TODO", hoursEstimate: 1.5 },
  ],
  LINI_2_WEBTECH: [
    { title: "Analisis Kebutuhan Sistem & Wireframing UI/UX", desc: "Perancangan alur interaksi pengguna, arsitektur data, dan tata letak.", defaultStatus: "DONE", hoursEstimate: 2.5 },
    { title: "Setup Infrastruktur Cloud & Komponen Antarmuka", desc: "Konfigurasi repository, database serverless Neon, dan modul front-end.", defaultStatus: "IN_PROGRESS", hoursEstimate: 3.5 },
    { title: "Pengembangan Fitur Inti & Integrasi Logika Bisnis", desc: "Implementasi logika aplikasi, keamanan API, dan performa tinggi.", defaultStatus: "TODO", hoursEstimate: 5 },
    { title: "Pengujian Kualitas (QA), Aksesibilitas & Responsivitas", desc: "Audit performa mobile, uji kompatibilitas browser, dan verifikasi alur.", defaultStatus: "TODO", hoursEstimate: 2 },
    { title: "Deployment Produksi & Serah Terima Akses Sistem", desc: "Live domain setup, konfigurasi SSL HTTPS, dan transfer kepemilikan kode.", defaultStatus: "TODO", hoursEstimate: 2 },
  ],
  LINI_3_ASSIST_DATA: [
    { title: "Inventarisasi Sumber Data & Validasi Format", desc: "Pemeriksaan integritas data mentah dan standardisasi parameter.", defaultStatus: "DONE", hoursEstimate: 2 },
    { title: "Pembersihan Data & Pemodelan Analitik", desc: "Transformasi data, eliminasi anomali, dan kalkulasi indikator utama.", defaultStatus: "IN_PROGRESS", hoursEstimate: 3.5 },
    { title: "Penyusunan Visualisasi & Dashboard Interaktif", desc: "Pembuatan grafik tren, kartu ringkasan eksekutif, dan filter dinamis.", defaultStatus: "TODO", hoursEstimate: 4 },
    { title: "Verifikasi Temuan & Validasi Metodologi", desc: "Cross-check hasil komputasi bersama tim pakar dan tinjauan kualitas.", defaultStatus: "TODO", hoursEstimate: 2 },
    { title: "Penyerahan Laporan Lengkap & Master Spreadsheet", desc: "Dokumentasi metodologi dan serah terima file olahan siap pakai.", defaultStatus: "TODO", hoursEstimate: 1.5 },
  ],
  LINI_4_MEDIA_AFFILIATE: [
    { title: "Riset Tren, Konsep Narasi & Storyboarding", desc: "Perumusan hook pembuka, pesan kunci, dan alur visual video promosi.", defaultStatus: "DONE", hoursEstimate: 2 },
    { title: "Produksi Aset Visual, Footage & Motion Design", desc: "Animasi kinetik, rendering elemen gerak, dan penyusunan sequence.", defaultStatus: "IN_PROGRESS", hoursEstimate: 4 },
    { title: "Penyelarasan Audio, Sound Effects & Color Grading", desc: "Mastering audio profesional, timing transisi, dan koreksi warna.", defaultStatus: "TODO", hoursEstimate: 3 },
    { title: "Pratinjau Klien & Penyelarasan Catatan Revisi", desc: "Sesi review draf video bersama klien sebelum finalisasi ekspor.", defaultStatus: "TODO", hoursEstimate: 2 },
    { title: "Pengiriman Master Video 4K/FHD & Aset Distribusi", desc: "Ekspor format optimal untuk Instagram Reels, TikTok, dan YouTube.", defaultStatus: "TODO", hoursEstimate: 1.5 },
  ],
  LINI_5_AI_ACADEMY: [
    { title: "Verifikasi Registrasi & Penerbitan Tiket Workshop", desc: "Validasi data peserta dan pengiriman akses ke kanal koordinasi.", defaultStatus: "DONE", hoursEstimate: 1 },
    { title: "Akses Materi Eksklusif & KaryaKita Prompt Pack", desc: "Akses ke kurikulum pembelajaran, panduan AI prompts, dan studi kasus.", defaultStatus: "IN_PROGRESS", hoursEstimate: 2 },
    { title: "Sesi Live Mentoring & Hands-on Implementation", desc: "Praktik langsung penerapan AI tools didampingi co-founder instruktur.", defaultStatus: "TODO", hoursEstimate: 3 },
    { title: "Konsultasi Proyek & Sesi Tanya Jawab Terbimbing", desc: "Evaluasi hasil penerapan AI peserta dan solusi kendala teknis.", defaultStatus: "TODO", hoursEstimate: 2 },
    { title: "Penerbitan E-Sertifikat Kelulusan Resmi KaryaKita", desc: "Penerbitan sertifikat kompetensi digital yang dapat diverifikasi.", defaultStatus: "TODO", hoursEstimate: 1 },
  ],
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const token = req.nextUrl.searchParams.get("token");

    // 1. Cari PublicOrder di database
    const order = await db.publicOrder.findFirst({
      where: {
        OR: [{ orderCode: code }, ...(token ? [{ portalToken: token }] : [])],
      },
      include: {
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan. Mohon periksa kembali kode pesanan Anda." },
        { status: 404 }
      );
    }

    // 2. Ambil main_state dari studio_state di database
    const studioRow = await db.studioState.findUnique({
      where: { key: "main_state" },
    });

    const state = (studioRow?.state as Record<string, unknown>) || {};
    const projects = Array.isArray(state.projects) ? (state.projects as Array<Record<string, unknown>>) : [];
    const allTasks = Array.isArray(state.tasks) ? (state.tasks as Array<Record<string, unknown>>) : [];
    const allRevisions = Array.isArray(state.revisionTriage) ? (state.revisionTriage as Array<Record<string, unknown>>) : [];
    const usersMap = (state.users as Record<string, Record<string, unknown>>) || {};
    const unitsMap = (state.units as Record<string, Record<string, unknown>>) || {};

    const projectId = `proj-${order.orderCode}`;
    const hubProject = projects.find(
      (p) => p.id === projectId || p.orderCode === order.orderCode
    );

    const hubUnitId = (hubProject?.unitId as string) || "LINI_2_WEBTECH";
    const unitObj = unitsMap[hubUnitId] || {};
    const unitName = (unitObj.name as string) || `KaryaKita ${order.unitCode.toUpperCase()}`;

    // PIC Co-Founder
    const picId = (hubProject?.picId as string) || "alfatih";
    const picUser = usersMap[picId] || {};
    const pic = {
      id: picId,
      name: (picUser.name as string) || "Syauqi Muhammad Al Fatih",
      roleLabel: (picUser.roleLabel as string) || "CEO & CTO",
      email: (picUser.email as string) || "tim@karyakita.id",
      avatar: (picUser.avatar as string) || "/images/team/alfatih.webp",
      capacityStatus: (picUser.capacityStatus as string) || "AVAILABLE",
    };

    // Revisions
    const revisionQuota = typeof hubProject?.revisionQuota === "number" ? hubProject.revisionQuota : 3;
    const revisionUsed = typeof hubProject?.revisionUsed === "number" ? hubProject.revisionUsed : 0;
    const projectRevisions = allRevisions.filter(
      (r) => r.projectId === projectId || r.orderCode === order.orderCode
    );

    // Tasks dari Hub OS
    const rawHubTasks = allTasks.filter(
      (t) => t.projectId === projectId && t.isClientVisible !== false
    );

    let tasks: Array<{
      id: string;
      title: string;
      description?: string;
      status: "TODO" | "IN_PROGRESS" | "DONE" | "REVIEW";
      hoursEstimate?: number;
      dueDate?: string | null;
      dodChecklist?: Array<{ label: string; checked: boolean }>;
      workProofUrl?: string | null;
      assigneeName?: string;
    }> = [];

    const isVerified =
      order.paymentGateStatus === "DP_50_VERIFIED" ||
      order.paymentGateStatus === "PAID_100_VERIFIED";

    if (rawHubTasks.length > 0) {
      tasks = rawHubTasks.map((t) => ({
        id: (t.id as string) || `t-${Math.random()}`,
        title: (t.title as string) || "Tugas Pengerjaan",
        description: (t.description as string) || "",
        status: (t.status as "TODO" | "IN_PROGRESS" | "DONE" | "REVIEW") || "TODO",
        hoursEstimate: typeof t.hoursEstimate === "number" ? t.hoursEstimate : 2,
        dueDate: (t.dueDate as string) || null,
        dodChecklist: Array.isArray(t.dodChecklist) ? (t.dodChecklist as Array<{ label: string; checked: boolean }>) : [],
        workProofUrl: (t.workProofUrl as string) || null,
        assigneeName: usersMap[t.assigneeId as string]?.name as string || pic.name,
      }));
    } else {
      // Fallback Milestone Stages yang terpetakan ke unit bisnis
      const fallbackWorkflows = DEFAULT_UNIT_WORKFLOWS[hubUnitId] || DEFAULT_UNIT_WORKFLOWS.LINI_2_WEBTECH;
      tasks = fallbackWorkflows.map((step, idx) => {
        let taskStatus: "TODO" | "IN_PROGRESS" | "DONE" | "REVIEW" = step.defaultStatus;
        if (!isVerified) {
          taskStatus = idx === 0 ? "IN_PROGRESS" : "TODO";
        } else if (order.paymentGateStatus === "PAID_100_VERIFIED") {
          taskStatus = "DONE";
        }
        return {
          id: `step-${idx + 1}`,
          title: step.title,
          description: step.desc,
          status: taskStatus,
          hoursEstimate: step.hoursEstimate,
          dueDate: null,
          dodChecklist: [
            { label: "Penyelarasan standar mutu syariah", checked: taskStatus === "DONE" },
            { label: "Verifikasi hasil pengerjaan tim", checked: taskStatus === "DONE" },
          ],
          workProofUrl: null,
          assigneeName: pic.name,
        };
      });
    }

    // Hitung persentase progres
    const doneTasksCount = tasks.filter((t) => t.status === "DONE").length;
    const inProgressTasksCount = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "REVIEW").length;
    let progressPercentage = 0;

    if (tasks.length > 0) {
      progressPercentage = Math.round(
        ((doneTasksCount + inProgressTasksCount * 0.5) / tasks.length) * 100
      );
    }
    if (order.paymentGateStatus === "PAID_100_VERIFIED") {
      progressPercentage = 100;
    } else if (!isVerified && progressPercentage > 20) {
      progressPercentage = 15; // Menunggu DP
    }

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      portalToken: order.portalToken,
      scheme: order.scheme,
      unitCode: order.unitCode,
      unitName,
      customerName: order.customerName,
      customerWhatsapp: maskWhatsapp(order.customerWhatsapp),
      customerEmail: maskEmail(order.customerEmail),
      organization: order.organization,
      contractValueIdr: Number(order.contractValueIdr),
      requiredAmountIdr: Number(order.requiredAmountIdr),
      paymentGateStatus: order.paymentGateStatus,
      proofUrl: order.proofUrl,
      verifiedById: order.verifiedById,
      verifiedAt: order.verifiedAt?.toISOString() || null,
      slaDeadline: (hubProject?.slaDeadline as string) || null,
      fulfillmentJson: order.fulfillmentJson,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      progressPercentage,
      pic,
      tasks,
      revisions: {
        quota: revisionQuota,
        used: revisionUsed,
        remaining: Math.max(0, revisionQuota - revisionUsed),
        items: projectRevisions.map((r) => ({
          id: (r.id as string) || "",
          note: (r.note as string) || "",
          submittedAt: typeof r.submittedAt === "number" ? r.submittedAt : Date.now(),
          triageStatus: (r.triageStatus as string) || "PENDING_TRIAGE",
        })),
      },
      auditTrail: order.auditLogs.map((l) => ({
        id: l.id,
        actorName: l.actorName,
        action: l.action,
        note: l.note,
        createdAt: l.createdAt.toISOString(),
      })),
    });
  } catch (err: unknown) {
    console.error("[Get Monitor API Error]:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data monitoring pengerjaan proyek" },
      { status: 500 }
    );
  }
}
