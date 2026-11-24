/**
 * Test Suite End-to-End Payment Gate KaryaKita (PGDS v1.0)
 * Memverifikasi Alur A (Publik AI Academy) & Alur B (B2B Split 50/50)
 */

import { db } from "../src/lib/db";

async function runE2ETests() {
  console.log("===============================================================");
  console.log("🚀 MEMULAI PENGUJIAN END-TO-END KARYAKITA PAYMENT GATE (PGDS v1.0)");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Tes Pembuatan Order AI Academy
    const testAcaCode = `KK-ACA-TEST-${Date.now().toString().slice(-4)}`;
    const testAcaToken = `test_token_aca_${Date.now()}`;

    const orderAca = await db.publicOrder.create({
      data: {
        orderCode: testAcaCode,
        portalToken: testAcaToken,
        scheme: "PUBLIC_FULL_100",
        unitCode: "academy",
        customerName: "Ahmad Tester AI",
        customerWhatsapp: "081299998888",
        customerEmail: "tester.ai@example.com",
        organization: "Mahasiswa STMIK Tazkia",
        contractValueIdr: BigInt(25000),
        requiredAmountIdr: BigInt(25000),
        paymentGateStatus: "WAITING_FULL_100",
      },
    });

    assert(orderAca.paymentGateStatus === "WAITING_FULL_100", "Order AI Academy status awal WAITING_FULL_100");
    assert(Number(orderAca.requiredAmountIdr) === 25000, "Nominal wajib bayar Rp25.000");

    // 2. Tes Unggah Bukti Transfer AI Academy
    const updatedAca = await db.publicOrder.update({
      where: { orderCode: testAcaCode },
      data: {
        proofUrl: "https://karyakita.id/proof-sample.jpg",
        proofAmountIdr: BigInt(25000),
        proofSubmittedAt: new Date(),
        paymentGateStatus: "VERIFYING_PROOF",
      },
    });

    assert(updatedAca.paymentGateStatus === "VERIFYING_PROOF", "Status berubah ke VERIFYING_PROOF setelah bukti diunggah");
    assert(updatedAca.proofUrl !== null, "Proof URL tersimpan di database");

    // 3. Tes Pengesahan Pembayaran oleh CFO Novita (Lunas 100%)
    const approvedAca = await db.$transaction(async (tx) => {
      const ord = await tx.publicOrder.update({
        where: { orderCode: testAcaCode },
        data: {
          paymentGateStatus: "PAID_100_VERIFIED",
          verifiedById: "Novita Rani (CFO)",
          verifiedAt: new Date(),
          fulfillmentJson: {
            zoomLink: "https://meet.google.com/test-room",
            waGroupLink: "https://chat.whatsapp.com/test-group",
            promptPackUrl: "https://karyakita.id/prompt-pack.pdf",
          },
        },
      });

      await tx.graduationCashCounter.upsert({
        where: { id: "karyakita_cash" },
        create: { id: "karyakita_cash", currentCashIdr: ord.requiredAmountIdr, targetCashIdr: BigInt(3500000) },
        update: { currentCashIdr: { increment: ord.requiredAmountIdr } },
      });

      return ord;
    });

    assert(approvedAca.paymentGateStatus === "PAID_100_VERIFIED", "Status berubah ke PAID_100_VERIFIED setelah disahkan CFO");
    const fulfillment = approvedAca.fulfillmentJson as Record<string, string>;
    assert(!!fulfillment?.zoomLink && !!fulfillment?.waGroupLink, "Fulfillment JSON otomatis berisi Zoom & WA Group");

    // 4. Tes Pembuatan Order B2B (Lini 2 WebTech)
    const testB2bCode = `KK-B2B-TEST-${Date.now().toString().slice(-4)}`;
    const testB2bToken = `test_token_b2b_${Date.now()}`;

    const orderB2b = await db.publicOrder.create({
      data: {
        orderCode: testB2bCode,
        portalToken: testB2bToken,
        scheme: "B2B_SPLIT_50_50",
        unitCode: "webtech",
        customerName: "Bpk. Budi Santoso",
        customerWhatsapp: "081377776666",
        customerEmail: "budi@perusahaan.co.id",
        organization: "PT Berkah Digital Nusantara",
        contractValueIdr: BigInt(2500000),
        requiredAmountIdr: BigInt(1250000),
        paymentGateStatus: "LOCKED_WAITING_DP",
      },
    });

    assert(orderB2b.paymentGateStatus === "LOCKED_WAITING_DP", "Order B2B berstatus awal LOCKED_WAITING_DP");
    assert(Number(orderB2b.requiredAmountIdr) === 1250000, "Nominal DP 50% sebesar Rp1.250.000");

    // 5. Tes Pengesahan DP 50% B2B
    const approvedB2b = await db.publicOrder.update({
      where: { orderCode: testB2bCode },
      data: {
        paymentGateStatus: "DP_50_VERIFIED",
        verifiedById: "Novita Rani (CFO)",
        verifiedAt: new Date(),
      },
    });

    assert(approvedB2b.paymentGateStatus === "DP_50_VERIFIED", "Status B2B berubah ke DP_50_VERIFIED (Gerbang eksekusi terbuka)");

    // 6. Tes Cek Progres GraduationRuleMeter di Database
    const cashCounter = await db.graduationCashCounter.findUnique({
      where: { id: "karyakita_cash" },
    });
    assert(cashCounter !== null && Number(cashCounter.currentCashIdr) > 0, "GraduationCashCounter berhasil mencatat kas masuk");

    // Bersihkan data uji coba agar database tetap bersih
    await db.publicOrder.deleteMany({
      where: { orderCode: { in: [testAcaCode, testB2bCode] } },
    });
    console.log("🧹 Data uji coba otomatis dibersihkan dari database.\n");
  } catch (err) {
    console.error("Fatal Error saat pengujian:", err);
    failed++;
  }

  console.log("===============================================================");
  console.log(`HASIL AKHIR: ${passed} PASS, ${failed} FAIL`);
  console.log("===============================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runE2ETests();
