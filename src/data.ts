import { Division } from './types';

export const DIVISIONS: Division[] = [
  {
    id: 'comercial',
    name: 'Comercial',
    fullName: 'Comercial & Business Development',
    shortDescription: 'Manajemen Penawaran, Bidding Logistik, & Kontrak Bisnis',
    description: 'Fokus pada analisis tarif logistik darat & laut, pembuatan simulasi bidding proyek tambang/kargo, estimasi profitabilitas rute armada, serta pemeliharaan kontrak klien strategis Pancaran Group.',
    iconName: 'TrendingUp',
    accentColor: 'border-emerald-500 text-emerald-600',
    bgGradient: 'from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-100',
    samplePrompts: [
      "Buat simulasi rekap komparasi tarif logistik darat rute Jakarta-Surabaya menggunakan tipe armada CDD vs Fuso.",
      "Tulis draf Executive Summary proposal tender pengangkutan batu bara jalur laut Pancaran Group wilayah Kalimantan Barat.",
      "Hitung proyeksi pendapatan tahunan jika target shipment batubara adalah 1.500.000 ton dengan tarif Rp 85.000 per ton.",
      "Buat template perhitungan BEP (Break Even Point) penyewaan armada Tug & Barge ukuran 300 kaki."
    ]
  },
  {
    id: 'hca',
    name: 'HCA',
    fullName: 'Human Capital & Affairs',
    shortDescription: 'SDM, HRD, Rekrutmen, & Manajemen Kinerja Karyawan',
    description: 'Fokus pada desain matriks kompetensi awak kapal dan pengemudi truk, perumusan Key Performance Indicators (KPI) supir logistik, sistem shift kerja, draf form Penilaian Kinerja Tahunan (Appraisal Form), serta regulasi lingkungan kerja (HRD).',
    iconName: 'Users',
    accentColor: 'border-sky-500 text-sky-600',
    bgGradient: 'from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border-sky-100',
    samplePrompts: [
      "Buat matriks penilaian kompetensi (HCA Mastery Matrix) untuk Pengemudi Truk Trailer B-Double.",
      "Tulis rumusan Key Performance Indicators (KPI) dan indikator keberhasilan bagi Head of Maintenance Armada Darat.",
      "Desain tabel lembar penilaian kinerja tahunan (Appraisal Template) komprehensif bagi Staff Administrasi Logistik.",
      "Buat draf kebijakan program Kesejahteraan Driver (Driver Welfare Program) untuk menekan angka turnover driver logistik."
    ]
  },
  {
    id: 'fina',
    name: 'FINA',
    fullName: 'Finance, Administration & Accounting',
    shortDescription: 'Anggaran, Cash Flow, Estimasi P&L, & Manajemen Pajak',
    description: 'Fokus pada perencanaan anggaran operasional dwi-mingguan, perhitungan depresiasi armada truk trailer & tongkang, rancangan simulasi Rugi Laba (P&L) unit logistik, optimalisasi biaya bahan bakar (BBM), serta rekonsiliasi faktur.',
    iconName: 'DollarSign',
    accentColor: 'border-amber-500 text-amber-600',
    bgGradient: 'from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-100',
    samplePrompts: [
      "Susun simulasi anggaran operational expense (OPEX) bulanan untuk 50 unit truk trailer Hino500.",
      "Hitung depresiasi aset kapal tongkang seharga Rp 22 Miliar dengan metode garis lurus selama masa manfaat 10 tahun.",
      "Buat visualisasi rancangan Profit & Loss (Rugi Laba) sederhana untuk proyek logistik pengangkutan kelapa sawit (CPO).",
      "Buat draf cash flow forecast mingguan dengan input penerimaan piutang Rp 4 Miliar dan pengeluaran bahan bakar Rp 2,1 Miliar."
    ]
  },
  {
    id: 'lga',
    name: 'LGA',
    fullName: 'Legal & Governance Affairs',
    shortDescription: 'Kepatuhan Hukum, GCG, Tinjauan Kontrak, & Perizinan',
    description: 'Membantu draf klausul alternatif untuk Memorandum of Understanding (MoU), pemenuhan lisensi operasional transportasi laut/darat Republik Indonesia, tinjauan resiko hukum (ODOL compliance), hingga pilar pengelolaan Good Corporate Governance.',
    iconName: 'ShieldAlert',
    accentColor: 'border-violet-500 text-violet-600',
    bgGradient: 'from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 border-violet-100',
    samplePrompts: [
      "Tuliskan draf klausul Pembatasan Tanggung Jawab (Limitation of Liability) yang tangguh dalam kontrak pengiriman laut Pancaran Group.",
      "Buat daftar periksa kepatuhan hukum (Regulatory Compliance Checklist) bagi pendirian kantor cabang logistik baru di luar pulau Jawa.",
      "Tulis draf MoU (Nota Kesepahaman) kerja sama subkontraktor angkutan logistik rute Sumatera-Jawa.",
      "Susun matriks tata kelola manajemen risiko (Risk Registry Matrix) untuk mengantisipasi keterlambatan rute laut akibat cuaca ekstrem."
    ]
  },
  {
    id: 'spia',
    name: 'SPIA',
    fullName: 'Satuan Pengawasan Intern / Internal Audit',
    shortDescription: 'Audit Internal, Pengendalian Risiko, & Deteksi Fraud',
    description: 'Mengatasi audit kepatuhan pengeluaran bahan bakar solar (mencegah fraud solar), penyusunan Kertas Kerja Audit (Working Paper) rute truk, evaluasi keandalan SOP gudang sparepart, serta pelacakan Corrective Action Plan (CAP).',
    iconName: 'ClipboardCheck',
    accentColor: 'border-rose-500 text-rose-600',
    bgGradient: 'from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border-rose-100',
    samplePrompts: [
      "Desain formulir Kertas Kerja Audit (Audit Working Paper Template) untuk mengaudit pemakaian BBM solar kapal Tugboat.",
      "Buat daftar periksa audit (Internal Audit Checklist) untuk memverifikasi kepatuhan sistem penggajian upah driver logistik.",
      "Susun template Rencana Aksi Korektif (Corrective Action Plan Form) pasca temuan selisih stok ban cadangan gudang.",
      "Bagaimana cara mengidentifikasi anomali/fraud BBM pada sistem operasional logistik darat logis? Berikan indikator audit pertamanya."
    ]
  }
];

export const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: 'SOP Hubungan Pengemudi & Kebijakan Kepatuhan Muatan ODOL 2026',
    content: `DOKUMEN REGULASI INTERNAL PANCARAN GROUP - 2026
Bagian I: Kebijakan Batas Muatan Armada Darat (Over Dimension Over Loading - ODOL)
1. Setiap unit armada truk trailer Hino500 yang beroperasi di wilayah Jawa dan Sumatera wajib mengikuti ketentuan berat muatan maksimum (JBI) yang diterbitkan oleh Dinas Perhubungan RI.
2. Pelanggaran batas tonase > 10% tidak akan ditolerir dan biaya denda jembatan timbang sepenuhnya dibebankan pada pengemudi jika terbukti mengabaikan manifes atau surat jalan resmi Pancaran Group.
3. Struktur sanksi pelanggaran ODOL:
- Teguran lisan pertama
- Surat Peringatan SP1 dengan penangguhan bonus ritase selama 2 minggu
- SP3 / Pemutusan hubungan kerja kemitraan driver jika melanggar berulang kali.

Bagian II: Keselamatan & Kesehatan Kerja Driver
- Kecepatan maksimum di jalan tol: 70 km/jam.
- Kecepatan maksimum di jalur arteri non-tol: 40 km/jam.
- Setiap pengemudi wajib beristirahat minimal 30 menit setelah berkendara selama 4 jam berturut-turut.`,
    sourceType: 'PDF Document',
    fileSize: '24.5 KB',
    uploadedAt: '2026-05-15T08:00:00Z',
    tags: ['LGA', 'Driver Policy', 'Safety'],
    excerpt: 'Surat Keputusan (SK) Direksi No. SK-089-2026 tentang tata cara penegakan regulasi Over Dimension & Over Loading (ODOL) serta K3 Driver logistik darat.'
  },
  {
    id: 'art-2',
    title: 'Pedoman Penawaran Tarif Logistik & Formulasi Margin Tender Korporasi',
    content: `PANCARAN KOALISI LOGISTIK - PEDOMAN DEPARTEMEN KOMERSIAL
Formulasi Harga Satuan Penawaran Proyek Logistik Batubara & CPO:
1. Penentuan BEP Armada Laut (Tugboat & Barge 300 kaki):
   BEP per Ritase = (Biaya Sewa Kapal harian * Hari Siklus Rute) + Estimasi BBM Solar Rute + Biaya Keagenan Pelabuhan + Pajak PPN 11%.
2. Formula Target Profit Margin:
   - Kontrak kerja jangka pendek (< 6 bulan): Target Gross profit margin minimum 22%.
   - Kontrak kerja jangka panjang (> 1 tahun): Target Gross profit margin minimum 14% dengan jaminan volume minimum shipment bulanan (MGM).
3. Parameter Bidding Kompetitor:
   Selalu lakukan investigasi harga pasar kompetitor per ton/mile sebelum submit draf proposal melalui portal e-procurement klien.`,
    sourceType: 'Excel Sheets',
    fileSize: '15.2 KB',
    uploadedAt: '2026-05-20T10:30:00Z',
    tags: ['Comercial', 'Pricing', 'BEP Formula'],
    excerpt: 'Matriks acuan negosiasi margin kargo bagi seluruh staf akuntansi komersial dan manager business development.'
  },
  {
    id: 'art-3',
    title: 'SOP Kalibrasi Digital Flow-Meter Depo Pengisian BBM Solar Pancaran',
    content: `SPIA & COMPLIANCE STANDARD - DEPO INTERNAL MERAK
Prosedur Audit dan Kalibrasi Alat Ukur Aliran Bahan Bakar (Digital Flow-Meter):
- Kalibrasi wajib dilakukan minimal satu kali dalam 12 bulan oleh Balai Metrologi resmi bersertifikat.
- Selisih toleransi pengukuran (meter factor) antara pencatatan flow-meter digital dengan volume sounding manual tangki pendam tidak boleh melebihi batas 0.15%.
- Jika ditemukan variansi pengisian solar armada darat > 1.5% secara berulang selama 3 kali pengisian, maka alat ukur wajib disegel sementara dan tim SPIA berhak melakukan investigasi audit forensik pengisian bahan bakar.`,
    sourceType: 'Word DOC',
    fileSize: '31.1 KB',
    uploadedAt: '2026-05-25T14:15:00Z',
    tags: ['SPIA', 'Depot Audit', 'Fuel Control'],
    excerpt: 'Tata cara operasional audit berkala terhadap instrumen digital pemakaian solar guna menegasikan potensi fraud solar.'
  }
];

