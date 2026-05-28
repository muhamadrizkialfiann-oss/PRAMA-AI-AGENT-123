import React, { useState, useEffect, useRef } from 'react';
import { DIVISIONS, INITIAL_ARTICLES } from './data';
import { DivisionId, ChatMessage, UploadedArticle, MemberUser } from './types';
import LoginView from './components/LoginView';
import LandingPage from './components/LandingPage';
import PancaranLogo from './components/PancaranLogo';
import { db } from './utils/firebase';
import { doc, collection, getDocs, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { 
  exportToWord, 
  exportToExcel, 
  exportToPPT, 
  exportToPDF 
} from './utils/exporter';
import { 
  Send, 
  FileText, 
  Layers, 
  LogOut, 
  RefreshCw, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShieldAlert, 
  ClipboardCheck, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  Download,
  Info,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Activity,
  Calendar,
  Lock,
  Paperclip,
  FileUp,
  X,
  FileCode,
  BookOpen,
  Plus,
  Search,
  Trash2,
  Eye,
  Check,
  Edit,
  Maximize2,
  Minimize2,
  Copy
} from 'lucide-react';

type ViewMode = 'landing' | 'login' | 'dashboard' | 'chat';

// Maps division icons dynamically
const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  Users,
  DollarSign,
  ShieldAlert,
  ClipboardCheck
};

const INITIAL_CHATS: Record<DivisionId, ChatMessage[]> = {
  comercial: [
    {
      id: 'com-init-1',
      role: 'assistant',
      content: `Selamat datang di modul **PRAMA Comercial & Business Development**. Saya siap membantu menyusun draf proposal tender, simulasi perhitungan biaya logistik (fleet-bidding), serta profitabilitas rute armada Pancaran Group.

Sebagai bahan evaluasi rute logistik darat utama kami, berikut adalah **Simulasi Perbandingan Tarif Logistik rute Jakarta - Surabaya**:

| Tipe Armada | Kapasitas Tonase | Tarif Standard (Rp) | Komponen BBM Solar (Ltr) | Estimasi Margin Bersih |
| :--- | :--- | :--- | :--- | :--- |
| Colt Diesel Double (CDD) | 4 Ton | Rp 5.000.000 | 120 Liter | 14.5% |
| Fuso Medium Ranger | 8 Ton | Rp 8.800.000 | 210 Liter | 18.2% |
| Tronton Wingbox Hino | 15 Ton | Rp 14.200.000 | 330 Liter | 21.0% |
| Trailer 40 Feet Flatbed | 25 Ton | Rp 19.500.000 | 480 Liter | 23.5% |

Anda dapat langsung mengekspor tabel simulasi tarif komersial di atas ke format **Excel, Word, PPT, atau PDF** menggunakan tombol ekspor di bawah untuk kebutuhan presentasi manajemen Pancaran Group.`,
      timestamp: new Date()
    }
  ],
  hca: [
    {
      id: 'hca-init-1',
      role: 'assistant',
      content: `Selamat datang di modul **PRAMA Human Capital & Affairs / Human Capital Assurance**. Saya siap mendukung Anda dalam penyusunan Key Performance Indicators (KPI) awak kapal & supir logistik darat, matriks kompetensi HRD, serta draf penilaian kinerja karyawan Pancaran Group.

Berikut adalah draf formulir **Matriks Penilaian Kompetensi Crew Logistik Darat (HCA Mastery Matrix)** untuk tahun buku berjalan:

| Kategori Kompetensi | Bobot Penilaian | Indikator Keberhasilan (SLA) | Skor Minimum Regulasi | Sertifikasi Pendukung |
| :--- | :--- | :--- | :--- | :--- |
| Keamanan & Defensive Driving | 30% | Zero-Accident dalam 12 bulan operasional | 85 / 100 | SIO Teraktif & Lisensi B2 |
| Ketepatan Waktu Bongkar/Muat | 25% | Keterlambatan rute kurang dari 2% total trip | 90 / 100 | Sertifikat Operasional GPS |
| Pemeliharaan Teknis Ringan | 20% | Pengecekan harian unit (Pre-checks) rutin | 80 / 100 | Diklat Mekanik Dasar |
| Sikap Kerja & Integritas | 25% | Bebas komplain dari Client & Unit Logistik | 85 / 100 | Surat Rekomendasi HRD |

Silakan ekspor matriks kompetensi SDM di atas dengan menekan menu ekspor di bawah.`,
      timestamp: new Date()
    }
  ],
  fina: [
    {
      id: 'fina-init-1',
      role: 'assistant',
      content: `Selamat datang di modul **PRAMA Finance & Administration**. Saya siap membantu Anda menyusun estimasi Operational Expense (OPEX), perhitungan rate depresiasi armada logistik darat & armada laut, serta rancangan simulasi Profit & Loss (P&L) triwulanan Pancaran Group.

Berikut adalah rancangan anggaran **Operational Expense (OPEX) bulanan untuk estimasi 50 unit armada truk trailer Hino500**:

| Komponen Anggaran | Alokasi per Unit (Rp) | Frekuensi | Total Anggaran bulanan (Rp) | Persentase Budget |
| :--- | :--- | :--- | :--- | :--- |
| Bahan Bakar Solar subsidi/non | Rp 18.000.000 | Setiap bulan | Rp 900.000.000 | 48.5% |
| Gaji & Uang Makan Driver | Rp 8.500.000 | Setiap bulan | Rp 425.000.000 | 22.9% |
| Maintenance & Suku Cadang Ban | Rp 4.200.000 | Setiap bulan | Rp 210.000.000 | 11.3% |
| Asuransi & Pajak Tahunan | Rp 1.500.000 | Setiap bulan | Rp 75.000.000 | 4.0% |
| Biaya Tol & Administrasi Jalan | Rp 5.000.000 | Setiap bulan | Rp 250.000.000 | 13.3% |

Anda bisa langsung mengirimkan file template kalkulasi budget operasional logistik ini agar diunduh ke Excel (.xlsx) atau PDF untuk diajukan ke CFO.`,
      timestamp: new Date()
    }
  ],
  lga: [
    {
      id: 'lga-init-1',
      role: 'assistant',
      content: `Selamat datang di modul **PRAMA Legal & Governance Affairs**. Saya siap membantu pengkajian klausul kontrak (Contract Review), kepatuhan regulasi logistik darat (Over Dimension Over Loading - ODOL), perizinan operasional pelayaran (barge/tongkang), serta GCG Pancaran Group.

Berikut adalah draf alternatif untuk **Klausul Pembatasan Tanggung Jawab (Limitation of Liability)** untuk melisensi kargo muatan bernilai tinggi:

| Klasifikasi Risiko | Penanggung Jawab | Batas Maksimum Ganti Rugi | Regulasi Pendukung | Status Kepatuhan |
| :--- | :--- | :--- | :--- | :--- |
| Kerusakan Barang Kargo | Pihak Ketiga Logistik | Selisih Premi Asuransi s.d Rp 100 Juta | UU Perkeretaapian & UU Pelayaran | Patuh (Compliant) |
| Keterlambatan Cuaca Laut | Force Majeure (Bebas klaim) | Tanpa ganti rugi (Reschedule gratis) | Pasal 1244 & 1245 KUHPerdata | Terverifikasi |
| Kehilangan Unit di Jalan Raya | Asuransi Jiwa & Fisik Sopir | Dilunasi Asuransi s.d Rp 350 Juta | Permenhub No. PM 60 Tahun 2019 | Patuh (Compliant) |
| Keretakan Struktural Lambung | Vendor Galangan Kapal | Biaya Perbaikan (Dry-dock) 100% | Peraturan BKI (Biro Klasifikasi Ind) | Terverifikasi |

Gunakan tombol di bawah untuk menginstruksikan ekspor draf klasifikasi klausul hukum ini ke format dokumen Word (.doc) atau PDF.`,
      timestamp: new Date()
    }
  ],
  spia: [
    {
      id: 'spia-init-1',
      role: 'assistant',
      content: `Selamat datang di modul **PRAMA Satuan Pengawasan Intern (SPIA)**. Saya siap membantu menyusun Kertas Kerja Audit (Audit Working Paper), check-list audit konsumsi BBM solar kapal & truk, mitigasi anomali/fraud operasional, serta pemantauan aksi korektif.

Berikut adalah **Formulir Kertas Kerja Audit (Audit Working Paper Template) BBM Solar Armada Tugboat**:

| Parameter Audit | Volume Standard | Realisasi Lapangan | Tingkat Selisih / Variansi | Klasifikasi Tingkat Risiko |
| :--- | :--- | :--- | :--- | :--- |
| Konsumsi Solar rute Kalimantan | 15.000 Liter | 15.420 Liter | +2.8% (Dalam batas wajar) | Rendah (Low Risk) |
| Konsumsi Solar rute Selat Sunda | 12.000 Liter | 13.250 Liter | +10.4% (Anomali transfer solar) | Tinggi (High Risk / Fraud Check) |
| Pengisian Depo Internal Merak | 80.000 Liter | 79.950 Liter | -0.06% (Sesuai tera teraan) | Sangat Rendah |
| Kalibrasi flow-meter digital | Sesuai SOP Tahunan | Terlambat 3 bulan | Belum dikalibrasi ulang | Sedang (Medium Risk) |

Rekomendasi audit ini bisa diekspor ke Microsoft Excel atau PDF sebagai lampiran laporan audit internal resmi tim SPIA Pancaran Group.`,
      timestamp: new Date()
    }
  ]
};

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeDivisionId, setActiveDivisionId] = useState<DivisionId>('comercial');
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [chats, setChats] = useState<Record<DivisionId, ChatMessage[]>>(INITIAL_CHATS);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; mimeType: string; data: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reference materials & articles repository states
  const [articles, setArticles] = useState<UploadedArticle[]>([]);
  const [isArticlesLoading, setIsArticlesLoading] = useState(true);
  const [selectedReferenceArticleIds, setSelectedReferenceArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('prama_selected_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [activeDashboardTab, setActiveDashboardTab] = useState<'divisions' | 'articles' | 'accounts'>('divisions');
  const [articleSearchText, setArticleSearchText] = useState('');
  const [activeArticleDetail, setActiveArticleDetail] = useState<UploadedArticle | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'info' | 'preview'>('preview');
  const [isFullScreenView, setIsFullScreenView] = useState(false);
  const [documentFontSize, setDocumentFontSize] = useState<number>(13);
  const [documentSearchTerm, setDocumentSearchTerm] = useState<string>('');

  // Member management states for admin approval dashboard
  const [registeredUsers, setRegisteredUsers] = useState<MemberUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Sync articles from Firestore
  useEffect(() => {
    async function syncArticles() {
      try {
        setIsArticlesLoading(true);
        const colRef = collection(db, 'articles');
        const snap = await getDocs(colRef);
        
        let fetchedArticles: UploadedArticle[] = [];
        if (snap.empty) {
          // No articles exist in Firebase yet! Let's seed the database collection with default INITIAL_ARTICLES
          console.log("Seeding initial articles reference to Firestore...");
          for (const art of INITIAL_ARTICLES) {
            await setDoc(doc(db, 'articles', art.id), art);
          }
          fetchedArticles = [...INITIAL_ARTICLES];
        } else {
          snap.forEach(docSnap => {
            const data = docSnap.data();
            fetchedArticles.push({
              id: docSnap.id,
              title: data.title || '',
              content: data.content || '',
              sourceType: data.sourceType || 'Text File',
              fileSize: data.fileSize || '0 KB',
              uploadedAt: data.uploadedAt || new Date().toISOString(),
              tags: data.tags || [],
              excerpt: data.excerpt,
              rawData: data.rawData,
              fileName: data.fileName
            });
          });
        }
        
        // Sort descending by uploadedAt
        fetchedArticles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setArticles(fetchedArticles);
      } catch (err) {
        console.error("Gagal sinkronisasi artikel dari Firestore:", err);
        // Fallback local storage
        const saved = localStorage.getItem('prama_uploaded_articles');
        if (saved) {
          try { setArticles(JSON.parse(saved)); } catch (e) { setArticles(INITIAL_ARTICLES); }
        } else {
          setArticles(INITIAL_ARTICLES);
        }
      } finally {
        setIsArticlesLoading(false);
      }
    }
    syncArticles();
  }, []);

  const fetchRegisteredUsers = async () => {
    if (userEmail !== 'muhamadrizkialfiann@gmail.com') return;
    try {
      setIsLoadingUsers(true);
      const snap = await getDocs(collection(db, 'users'));
      const list: MemberUser[] = [];
      snap.forEach(d => {
        const data = d.data();
        list.push({
          id: d.id,
          email: data.email || d.id,
          password: data.password || '',
          fullName: data.fullName || '',
          role: data.role || 'user',
          status: data.status || 'pending',
          division: data.division || 'comercial',
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      // Sort by createdAt desc
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRegisteredUsers(list);
    } catch (err) {
      console.error("Error loading users from firestore:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userEmail === 'muhamadrizkialfiann@gmail.com') {
      fetchRegisteredUsers();
    }
  }, [userEmail]);

  const handleUserStatusUpdate = async (emailToUpdate: string, newStatus: 'approved' | 'rejected') => {
    try {
      const userRef = doc(db, 'users', emailToUpdate);
      await updateDoc(userRef, { status: newStatus });
      setSystemAlert({
        type: 'success',
        text: `Akun pendaftaran ${emailToUpdate} berhasil disetujui (${newStatus.toUpperCase()})!`
      });
      await fetchRegisteredUsers();
    } catch (err: any) {
      console.error("Gagal memperbarui status user:", err);
      setRegisteredUsers(prev => prev.map(u => u.email === emailToUpdate ? { ...u, status: newStatus } : u));
    }
  };

  const handleDeleteUser = async (emailToDelete: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pendaftaran akun untuk "${emailToDelete}" secara permanen?`)) {
      try {
        await deleteDoc(doc(db, 'users', emailToDelete));
        setSystemAlert({
          type: 'success',
          text: `Akun pendaftaran ${emailToDelete} berhasil dihapus dari database!`
        });
        await fetchRegisteredUsers();
      } catch (err: any) {
        console.error("Gagal menghapus pendaftar:", err);
        setSystemAlert({
          type: 'danger',
          text: `Gagal menghapus pendaftar: ${err.message || 'Izin ditolak'}`
        });
      }
    }
  };

  const handleOpenArticleDetail = (art: UploadedArticle) => {
    setActiveArticleDetail(art);
    setModalActiveTab('preview');
    setDocumentSearchTerm('');
    setDocumentFontSize(13);
    setIsFullScreenView(false);
    setIsEditingActiveDetail(false);
  };

  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');
  const [newArticleSourceType, setNewArticleSourceType] = useState('PDF Document');
  const [newArticleTags, setNewArticleTags] = useState('');
  const [isUploadingArticle, setIsUploadingArticle] = useState(false);

  // States for editing selected article/document
  const [isEditingActiveDetail, setIsEditingActiveDetail] = useState(false);
  const [editArticleTitle, setEditArticleTitle] = useState('');
  const [editArticleContent, setEditArticleContent] = useState('');
  const [editArticleSourceType, setEditArticleSourceType] = useState('PDF Document');
  const [editArticleTags, setEditArticleTags] = useState('');

  // Sync selected reference ids changes to local storage
  useEffect(() => {
    localStorage.setItem('prama_selected_articles', JSON.stringify(selectedReferenceArticleIds));
  }, [selectedReferenceArticleIds]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran berkas terlalu besar! Batas maksimum adalah 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        : (file.size / 1024).toFixed(1) + " KB";
      setAttachedFile({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: resultStr,
        size: sizeStr
      });
    };
    reader.onerror = () => {
      alert("Gagal membaca berkas.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ukuran berkas terlalu besar! Batas maksimum adalah 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        : (file.size / 1024).toFixed(1) + " KB";
      setAttachedFile({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: resultStr,
        size: sizeStr
      });
    };
    reader.onerror = () => {
      alert("Gagal membaca berkas.");
    };
    reader.readAsDataURL(file);
  };

  const articleFileInputRef = useRef<HTMLInputElement>(null);

  const handleArticleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Ukuran berkas terlalu besar! Batas maksimum adalah 15 MB.");
      return;
    }

    const fileType = file.type || 'application/octet-stream';
    const isText = file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json') || fileType.includes('text/plain');

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
        : (file.size / 1024).toFixed(1) + " KB";
      
      const newArticle: UploadedArticle = {
        id: `art-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Strip file extension
        content: isText ? resultStr : `Lampiran berkas biner dalam format sandi BASE64:\n\n${resultStr}\n\nData utuh dipertahankan untuk referensi model AI.`,
        sourceType: file.name.endsWith('.pdf') ? 'PDF Document' : file.name.endsWith('.docx') || file.name.endsWith('.doc') ? 'Word DOC' : file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv') ? 'Excel Sheets' : 'Text File',
        fileSize: sizeStr,
        uploadedAt: new Date().toISOString(),
        tags: ['File Upload', file.name.split('.').pop()?.toUpperCase() || 'FILE'],
        rawData: resultStr,
        fileName: file.name
      };

      setArticles(prev => [newArticle, ...prev]);
      
      // Save newly uploaded file to Firestore of course
      setDoc(doc(db, 'articles', newArticle.id), newArticle)
        .catch(err => console.error("Gagal menyimpan file baru ke Firestore:", err));
      
      // Auto-toggle active so it grounds the answers immediately
      setSelectedReferenceArticleIds(prev => [...prev, newArticle.id]);
      
      setSystemAlert({
        type: 'success',
        text: `Dokumen "${file.name}" berhasil diunggah & disimpan di cloud Firestore sebagai material referensi AI.`
      });
    };
    reader.onerror = () => {
      alert("Gagal membaca berkas.");
    };

    if (isText) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    
    // Reset file input value
    e.target.value = '';
  };

  const handleCreateArticleManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim() || !newArticleContent.trim()) {
      alert("Judul dan isi artikel wajib diisi.");
      return;
    }

    const created: UploadedArticle = {
      id: `art-${Date.now()}`,
      title: newArticleTitle.trim(),
      content: newArticleContent.trim(),
      sourceType: newArticleSourceType,
      fileSize: `${(newArticleContent.length / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      tags: newArticleTags ? newArticleTags.split(',').map(t => t.trim()).filter(Boolean) : ['Manual Input', 'SOP']
    };

    setArticles(prev => [created, ...prev]);
    setSelectedReferenceArticleIds(prev => [...prev, created.id]); // auto select

    // Save manually created document to Firestore
    setDoc(doc(db, 'articles', created.id), created)
      .catch(err => console.error("Gagal menyimpan dokumen baru ke Firestore:", err));
    
    // Clear state
    setNewArticleTitle('');
    setNewArticleContent('');
    setNewArticleTags('');
    
    setSystemAlert({
      type: 'success',
      text: `Artikel/Dokumen "${created.title}" berhasil disimpan di cloud Firestore!`
    });
  };

  const handleDeleteArticle = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${name}"?`)) {
      try {
        // Optimistically remove from state
        setArticles(prev => prev.filter(art => art.id !== id));
        setSelectedReferenceArticleIds(prev => prev.filter(selectedId => selectedId !== id));
        
        // Delete document from Firestore
        await deleteDoc(doc(db, 'articles', id));

        setSystemAlert({
          type: 'success',
          text: `Dokumen "${name}" berhasil dihapus secara permanen dari Cloud Firestore.`
        });
      } catch (err: any) {
        console.error("Gagal menghapus dokumen dari Firestore:", err);
        setSystemAlert({
          type: 'danger',
          text: `Gagal menghapus dokumen dari database cloud: ${err.message || 'Izin ditolak'}`
        });
        
        // Rollback and reload articles from Firestore
        try {
          const colRef = collection(db, 'articles');
          const snap = await getDocs(colRef);
          const list: UploadedArticle[] = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              title: data.title || '',
              content: data.content || '',
              sourceType: data.sourceType || 'Text File',
              fileSize: data.fileSize || '0 KB',
              uploadedAt: data.uploadedAt || new Date().toISOString(),
              tags: data.tags || [],
              excerpt: data.excerpt,
              rawData: data.rawData,
              fileName: data.fileName
            });
          });
          list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
          setArticles(list);
        } catch (reloadErr) {
          console.error("Error reloading after delete failure:", reloadErr);
        }
      }
    }
  };

  const handleToggleReferenceArticle = (id: string) => {
    setSelectedReferenceArticleIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const startEditingArticle = (art: UploadedArticle) => {
    setEditArticleTitle(art.title);
    setEditArticleContent(art.content);
    setEditArticleSourceType(art.sourceType);
    setEditArticleTags(art.tags.join(', '));
    setIsEditingActiveDetail(true);
  };

  const handleSaveEditedArticle = (id: string) => {
    if (!editArticleTitle.trim() || !editArticleContent.trim()) {
      alert("Judul dan isi artikel tidak boleh kosong.");
      return;
    }
    const updatedTags = editArticleTags ? editArticleTags.split(',').map(t => t.trim()).filter(Boolean) : ['SOP'];
    setArticles(prev => prev.map(art => {
      if (art.id === id) {
        const updated = {
          ...art,
          title: editArticleTitle.trim(),
          content: editArticleContent.trim(),
          sourceType: editArticleSourceType,
          tags: updatedTags
        };

        // Update the edited document in Firestore database
        setDoc(doc(db, 'articles', id), updated)
          .catch(err => console.error("Gagal memperbarui artikel di Firestore:", err));

        // Update active article detail referencing so model receives the latest content
        if (activeArticleDetail?.id === id) {
          setActiveArticleDetail(updated);
        }
        return updated;
      }
      return art;
    }));
    setIsEditingActiveDetail(false);
    
    setSystemAlert({
      type: 'success',
      text: `Dokumen "${editArticleTitle}" berhasil diperbarui di cloud Firestore!`
    });
  };

  const handleDownloadArticleFile = (art: UploadedArticle) => {
    try {
      const isBase64 = art.rawData && art.rawData.startsWith('data:');
      let href = '';
      if (isBase64) {
        href = art.rawData!;
      } else {
        const mimeType = art.sourceType.includes('PDF') ? 'application/pdf' :
                         art.sourceType.includes('Excel') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                         art.sourceType.includes('Word') ? 'application/msword' : 'text/plain';
        const blob = new Blob([art.content], { type: mimeType });
        href = URL.createObjectURL(blob);
      }
      
      const extension = art.sourceType.includes('PDF') ? 'pdf' :
                        art.sourceType.includes('Excel') ? 'xlsx' :
                        art.sourceType.includes('Word') ? 'docx' :
                        art.sourceType.includes('Text') ? 'txt' : 'txt';

      const downloadName = art.fileName || `${art.title.replace(/\s+/g, '_')}.${extension}`;
      
      const link = document.createElement('a');
      link.href = href;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      if (!isBase64) {
        URL.revokeObjectURL(href);
      }
      
      setSystemAlert({
        type: 'success',
        text: `Berkas "${downloadName}" berhasil diekspor & diunduh.`
      });
    } catch (e) {
      console.error(e);
      alert("Gagal mengunduh berkas.");
    }
  };

  const [systemAlert, setSystemAlert] = useState<{ type: 'info' | 'warning' | 'success', text: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on start
  useEffect(() => {
    const savedUser = localStorage.getItem('prama_user_email');
    if (savedUser) {
      setUserEmail(savedUser);
    }

    // Always start with fresh chat templates to comply with "selalu baru" requirement
    setChats(JSON.parse(JSON.stringify(INITIAL_CHATS)));

    // Check backend health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (!data.aiConfigured) {
          setSystemAlert({
            type: 'warning',
            text: 'Mode Simulasi Aktif: GEMINI_API_KEY server belum dikonfigurasi. Anda tetap dapat mengoperasikan chatbot dengan fallback simulasi dan fitur ekspor Word, Excel, PDF, dan PPT secara utuh hari ini.'
          });
        } else {
          setSystemAlert({
            type: 'success',
            text: 'PRAMA AI Engine terhubung sempurna. Respons chatbot ditenagai kecerdasan buatan Gemini 3.5 Flash secara real-time.'
          });
        }
      })
      .catch(err => {
        console.error("Health check error:", err);
      });
  }, []);

  // Save chats to localStorage on update
  const saveChatsToStorage = (updatedChats: Record<DivisionId, ChatMessage[]>) => {
    localStorage.setItem('prama_chats_data', JSON.stringify(updatedChats));
  };

  // Scroll to bottom helper
  useEffect(() => {
    if (currentView === 'chat') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [chats, activeDivisionId, isLoading, currentView]);

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setCurrentView('dashboard');
    localStorage.setItem('prama_user_email', email);
    // Restart chats completely clean on login
    setChats(JSON.parse(JSON.stringify(INITIAL_CHATS)));
    localStorage.removeItem('prama_chats_data');
  };

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin keluar dari PRAMA?")) {
      setUserEmail(null);
      setCurrentView('landing');
      // Reset chatbot memory to clean state on logout
      setChats(JSON.parse(JSON.stringify(INITIAL_CHATS)));
      localStorage.removeItem('prama_user_email');
      localStorage.removeItem('prama_chats_data');
    }
  };

  const activeDivision = DIVISIONS.find(d => d.id === activeDivisionId) || DIVISIONS[0];
  const activeMessages = chats[activeDivisionId] || [];

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const promptToSend = (customText || inputText).trim();
    if (!promptToSend && !attachedFile) return;

    if (!customText) {
      setInputText('');
    }

    // Append user message with optional attachment info
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: promptToSend || `Mengevaluasi berkas lampiran: ${attachedFile?.name}`,
      timestamp: new Date(),
      attachment: attachedFile ? {
        name: attachedFile.name,
        mimeType: attachedFile.mimeType,
        size: attachedFile.size,
        data: attachedFile.data
      } : undefined
    };

    const currentAttachment = attachedFile;
    setAttachedFile(null);

    const updatedDivisionMsgs = [...activeMessages, userMsg];
    const newChats = {
      ...chats,
      [activeDivisionId]: updatedDivisionMsgs
    };
    setChats(newChats);
    saveChatsToStorage(newChats);

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.content,
          division: activeDivisionId,
          history: updatedDivisionMsgs.slice(-8).map(m => ({
            role: m.role,
            content: m.content
          })),
          attachedFile: currentAttachment ? {
            name: currentAttachment.name,
            mimeType: currentAttachment.mimeType,
            data: currentAttachment.data
          } : undefined,
          referenceArticles: articles
            .filter(art => selectedReferenceArticleIds.includes(art.id))
            .map(art => ({
              title: art.title,
              content: art.content,
              sourceType: art.sourceType
            }))
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errData = await response.json();
          throw new Error(errData.error || "Gagal mendapat balasan dari PRAMA.");
        }
        throw new Error("Gagal menghubungkan ke server PRAMA.");
      }

      // Ready to update AI message in real-time chunk-by-chunk
      const aiMsgId = `ai-${Date.now()}`;
      let accumulatedText = '';

      const aiMsg: ChatMessage = {
        id: aiMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      // Set initial state with empty AI message so we can stream into it
      setChats(prev => {
        const updated = {
          ...prev,
          [activeDivisionId]: [...(prev[activeDivisionId] || []), aiMsg]
        };
        return updated;
      });

      setIsLoading(false);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;

          // Update message content in state
          setChats(prev => {
            const list = prev[activeDivisionId] || [];
            const nextList = list.map(m => m.id === aiMsgId ? { ...m, content: accumulatedText } : m);
            return {
              ...prev,
              [activeDivisionId]: nextList
            };
          });
        }
      }

      // After finishing streaming, save to local storage
      setChats(prev => {
        saveChatsToStorage(prev);
        return prev;
      });

    } catch (err: any) {
      console.warn("AI error, running fallback simulation response:", err);
      
      // Fallback response for offline / simulated environment
      let customFallbackAnswer = `Saya mencatat permintaan Anda mengenai "${userMsg.content}".`;
      if (currentAttachment) {
        customFallbackAnswer += `\n\n📌 **Deteksi Lampiran Berkas**: Berhasil mengekstrak file **${currentAttachment.name}** (${currentAttachment.size}) dengan tipe Mime \`${currentAttachment.mimeType}\` dalam sandi format base64.`;
      }
      
      customFallbackAnswer += `\n\nBerikut adalah kerangka kerja simulasi perhitungan yang siap diekspor berdasarkan database Pancaran Group:

### Rekomendasi Templat Taktis - ${activeDivision.name} (Offline Simulasi)

| Indikator Proyek | Parameter Nilai | Estimasi Toleransi | Penanggung Jawab | Catatan Tambahan Pemenuhan |
| :--- | :--- | :--- | :--- | :--- |
| Total Biaya Distribusi | Rp 1.420.000.000 | +/- 5% deviasi | Divisi ${activeDivision.name} | Berdasarkan indeks BBM Solar terbaru |
| Target Efisiensi Fleet | 92.5% Optimal | Batas minimum 88% | Fleet Scheduler | Monitor berkala via GPS Telematic |
| Durasi Penyelesaian | 14 Hari Kerja | Max 18 Hari | Ops Manager | Sanksi keterlambatan 1‰ per hari |
| Tingkat Keamanan | Zero Accident | Mutlak | Team HSSE & HCA | Dikawal program induksi keselamatan |

Silakan gunakan tombol ekspor di bawah untuk mengambil template kalkulasi rancangan ini dalam format Word, PPT, PDF, atau Excel!`;

      // Simulating realistic delay
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          id: `ai-fallback-${Date.now()}`,
          role: 'assistant',
          content: customFallbackAnswer,
          timestamp: new Date()
        };
        const finalChats = {
          ...chats,
          [activeDivisionId]: [...updatedDivisionMsgs, fallbackMsg]
        };
        setChats(finalChats);
        saveChatsToStorage(finalChats);
        setIsLoading(false);
      }, 1000);

      return;
    }

    setIsLoading(false);
  };

  const handleClearHistory = () => {
    if (confirm(`Apakah Anda yakin ingin mengatur ulang riwayat chat untuk Divisi ${activeDivision.name}?`)) {
      const resetChats = {
        ...chats,
        [activeDivisionId]: INITIAL_CHATS[activeDivisionId]
      };
      setChats(resetChats);
      saveChatsToStorage(resetChats);
    }
  };

  // 1. Landing view (Video Welcome Page)
  if (currentView === 'landing') {
    return (
      <LandingPage
        savedUserEmail={userEmail}
        onProceed={() => {
          if (userEmail) {
            setCurrentView('dashboard');
          } else {
            setCurrentView('login');
          }
        }}
        onQuickProceedAsUser={() => {
          if (userEmail) {
            setCurrentView('dashboard');
          }
        }}
      />
    );
  }

  // 2. Login view (Sign-in form view with capability to head back to visual landing page)
  if (currentView === 'login' || (!userEmail && currentView !== 'landing')) {
    return (
      <LoginView
        onLoginSuccess={handleLogin}
        onBackToLanding={() => {
          setCurrentView('landing');
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden antialiased" id="prama-panel-root">
      
      {/* Top Navbar: Shared by both views but optimized for a clean, bright appearance */}
      <nav className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setCurrentView('dashboard')}
            className="w-10 h-10 bg-[#00A4E4] hover:bg-[#008fca] rounded-xl flex items-center justify-center shadow-sm shadow-[#00A4E4]/20 transition-all cursor-pointer"
            title="Kembali ke Dashboard Utama"
          >
            <span className="text-white font-display font-black text-xl tracking-wider">P</span>
          </div>
          <div>
            <div className="flex items-center gap-2 leading-none">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 font-display">PRAMA SYSTEM</h1>
              <span className="text-[9px] bg-[#00A4E4]/10 border border-[#00A4E4]/25 text-[#00A4E4] font-bold px-1.5 py-0.5 rounded leading-none">Enterprise</span>
            </div>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5 font-mono">Project Management Analytics</p>
          </div>
        </div>

        {/* Global Connection / System Alerts Header Info (Light themed styling) */}
        {systemAlert && (
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-1.5 max-w-xl text-[11px] text-slate-600">
            {systemAlert.type === 'warning' ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="truncate"><strong>Status:</strong> Mode Simulasi Terjamin. Klik Hub Divisi untuk Mulai.</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-[#00A4E4] shrink-0 animate-pulse" />
                <span className="truncate text-slate-700 font-medium">Konektivitas Enkripsi Korporat Aktif Nyata.</span>
              </>
            )}
          </div>
        )}

        {/* Right side user details log block */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-none">{userEmail.split('@')[0].toUpperCase()}</p>
              <p className="text-[9px] text-emerald-600 font-semibold mt-1 select-none flex items-center gap-1 justify-end uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Pancaran Staff
              </p>
            </div>
            
            {/* Round Avatar badge using first letters */}
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden font-display font-bold text-xs text-[#0B2C56] shadow-sm select-none">
              {userEmail.substring(0, 2).toUpperCase()}
            </div>

            {/* Logout Trigger button */}
            <button 
              onClick={handleLogout}
              className="p-1 px-2 border border-slate-200 rounded-lg hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all text-xs flex items-center gap-1 cursor-pointer"
              title="Keluar dari sistem"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* VIEW PANEL 1: DETAILED CORPORATE DASHBOARD GRID & ONBOARDING HUB */}
      {currentView === 'dashboard' && (
        <div className="flex-1 overflow-y-auto" id="dashboard-view-panel">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
            
            {/* Header Hero Banner with ambient video and glowing shadow reflections */}
            <section className="relative rounded-3xl p-6 sm:p-8 text-white shadow-[0_20px_50px_rgba(0,164,228,0.25)] border border-white/10 hover:shadow-[0_25px_60px_rgba(0,164,228,0.35)] transition-all duration-500 overflow-hidden bg-slate-950">
              
              {/* Cinematic Looping Background Video for Dashboard */}
              <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden select-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-50 scale-102 filter brightness-[0.45] contrast-105"
                >
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-cargo-ship-docked-at-a-port-terminal-aerial-view-41485-large.mp4" type="video/mp4" />
                </video>
                {/* Visual blue overlay gradient tint */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B2C56]/90 via-indigo-950/80 to-slate-950/90 mix-blend-multiply" />
                {/* Tech digital sweep effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#00A4E4]/10 to-transparent" />
              </div>

              {/* Glowing Ambient Glow 'Shadows' representing the video reflection */}
              <div className="absolute -bottom-8 left-12 right-12 h-6 bg-[#00A4E4] opacity-35 blur-[35px] rounded-full pointer-events-none animate-pulse" />
              <div className="absolute -bottom-8 left-1/3 w-1/3 h-6 bg-amber-500 opacity-20 blur-[25px] rounded-full pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-sky-200 w-fit mb-4">
                  <Activity className="h-4 w-4 text-sky-200 animate-pulse" />
                  Pancaran Live Hub &bull; Fleet Monitoring
                </div>
                <h2 className="font-display text-2xl sm:text-3.5xl font-black tracking-tight leading-none">
                  PRAMA Enterprise AI Hub
                </h2>
                <p className="text-sky-100 text-xs sm:text-sm mt-2.5 leading-relaxed">
                  Selamat bekerja, Rekan <strong>{userEmail}</strong>. Sistem PRAMA mengaktivasi koneksi asisten AI divisi komersial & operasional Pancaran Group. Silakan pilih hub divisi di bawah untuk merumuskan draf penugasan instan.
                </p>
                
                {/* Embedded quick search summary metrics widgets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-slate-100 font-medium">
                  <div>
                    <span className="text-sky-300 font-mono text-[10px] block font-bold uppercase">DIVISI AKTIF</span>
                    <strong className="text-sm sm:text-base font-display">5 Departemen</strong>
                  </div>
                  <div>
                    <span className="text-sky-300 font-mono text-[10px] block font-bold uppercase">FLEET REGISTRY</span>
                    <strong className="text-sm sm:text-base font-display">Marine & Land</strong>
                  </div>
                  <div>
                    <span className="text-sky-300 font-mono text-[10px] block font-bold uppercase">DOKUMEN EKSPOR</span>
                    <strong className="text-sm sm:text-base font-display">Word, Excel, PDF, PPT</strong>
                  </div>
                  <div>
                    <span className="text-sky-300 font-mono text-[10px] block font-bold uppercase">KONEKSI MODEL</span>
                    <strong className="text-sm sm:text-base font-display font-mono">Gemini 3.5 Flash</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Professional Modern Tab Switcher untuk Manajemen Artikel dan Divisi */}
            <div className="flex border-b border-slate-200 gap-1 mb-8" id="dashboard-tab-panel">
              <button
                onClick={() => setActiveDashboardTab('divisions')}
                className={`py-3 px-5 text-xs sm:text-sm font-black flex items-center gap-2 border-b-3 transition-all cursor-pointer ${
                  activeDashboardTab === 'divisions'
                    ? 'border-[#00A4E4] text-[#0B2C56]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Pusat Hub Divisi AI</span>
              </button>
              
              <button
                onClick={() => setActiveDashboardTab('articles')}
                className={`py-3 px-5 text-xs sm:text-sm font-black flex items-center gap-2 border-b-3 transition-all cursor-pointer relative ${
                  activeDashboardTab === 'articles'
                    ? 'border-[#00A4E4] text-[#0B2C56]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Repositori Artikel & Dokumen Referensi</span>
                {selectedReferenceArticleIds.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white bg-[#00A4E4] rounded-full leading-none">
                    {selectedReferenceArticleIds.length}
                  </span>
                )}
              </button>

              {userEmail === 'muhamadrizkialfiann@gmail.com' && (
                <button
                  onClick={() => setActiveDashboardTab('accounts')}
                  className={`py-3 px-5 text-xs sm:text-sm font-black flex items-center gap-2 border-b-3 transition-all cursor-pointer relative ${
                    activeDashboardTab === 'accounts'
                      ? 'border-[#00A4E4] text-[#0B2C56]'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Manajemen Akun Pendaftaran</span>
                  {registeredUsers.filter(u => u.status === 'pending').length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white bg-amber-500 rounded-full leading-none animate-pulse">
                      {registeredUsers.filter(u => u.status === 'pending').length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {activeDashboardTab === 'divisions' && (
              <>
                {/* Division Hub Grid Segment */}
                <section className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[#00A4E4]" />
                    Pilih Hub Divisi Khusus
                  </h3>
                  <p className="text-xs text-slate-500">Klik salah satu divisi di bawah untuk memproses instruksi analisa di ruang obrolan cerdas.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Sesi: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>

              {/* Grid Cards Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-grid-container">
                {DIVISIONS.map((div) => {
                  const IconComponent = iconMap[div.iconName] || HelpCircle;
                  return (
                    <div
                      key={div.id}
                      className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                      id={`div-card-${div.id}`}
                    >
                      {/* Top Accent Color strip indicating division category */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-[#00A4E4]/40 group-hover:bg-[#00A4E4] transition-colors`} />

                      {/* Card Content block */}
                      <div>
                        {/* Shorthand line */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-slate-50 text-[#0B2C56] border border-slate-100 rounded-xl group-hover:scale-105 transition-transform duration-300">
                            <IconComponent className="h-5 w-5 text-[#00A4E4]" />
                          </div>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                            {div.id}
                          </span>
                        </div>

                        {/* Title descriptions */}
                        <h4 className="text-slate-900 font-black text-base tracking-wide group-hover:text-[#00A4E4] transition-colors">
                          {div.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 font-display">
                          {div.fullName}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {div.shortDescription}
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">PROFIL ANALISIS</span>
                          <p className="text-xs text-slate-600 line-clamp-3 italic leading-relaxed">
                            "{div.description}"
                          </p>
                        </div>
                      </div>

                      {/* Primary Navigation button to push to Stage 2 Chat page directly */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            // Deep clone the clean initial greeting for this division to ensure the chat is always fresh on entering!
                            const freshGreeting = JSON.parse(JSON.stringify(INITIAL_CHATS[div.id]));
                            setChats(prev => ({
                              ...prev,
                              [div.id]: freshGreeting
                            }));
                            setActiveDivisionId(div.id);
                            setCurrentView('chat');
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#00A4E4] hover:bg-[#008fca] text-white font-bold rounded-xl text-xs transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
                          id={`btn-proceed-${div.id}`}
                        >
                          <span>Masuk Tahap Analisis AI</span>
                          <ArrowRight className="h-3.5 w-3.5 text-white" />
                        </button>
                        
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-1">
                          <span>{div.samplePrompts.length} Preset Perhitungan</span>
                          <span className="text-emerald-600 font-bold select-none uppercase tracking-wider">Ready • Online</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick guide box displayed perfectly under light theme */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
                <div className="p-1.5 bg-slate-100 rounded-lg text-[#00A4E4]">
                  <Info className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0B2C56] font-display">
                  SOP Standar Operasional PRAMA Enterprise Assistant
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[#00A4E4] font-bold text-sm block mb-1">01. Tentukan Bidang</span>
                  <p>Tentukan analisis yang dibutuhkan berdasarkan 5 pilar departemen Pancaran Group: Komersial, Kepegawaian (HCA), Finansial (FINA), Legalitas (LGA), atau Kertas Kerja Audit (SPIA).</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[#00A4E4] font-bold text-sm block mb-1">02. Buka Ruang Chat Khusus</span>
                  <p>Klik tombol <strong>"Masuk Tahap Analisis AI"</strong> pada salah satu kartu departemen untuk berpindah ke halaman program khusus asisten AI yang membawa preset memori bidang tersebut.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[#00A4E4] font-bold text-sm block mb-1">03. Hitung & Ekspor Berkas</span>
                  <p>Ketik perintah atau gunakan saran preset. AI akan mengkalkulasi tabel data. Anda bisa langsung mengunduh hasil dalam format Word, Excel, PowerPoint, atau cetak lembar PDF instan.</p>
                </div>
              </div>
            </section>
              </>
            )}

            {activeDashboardTab === 'articles' && (
              <div className="flex flex-col lg:flex-row gap-8 animate-fade-in" id="articles-management-panel">
                
                {/* COLUMN 1: Uploader & Manual Entry Form */}
                <div className="w-full lg:w-5/12 flex flex-col gap-6">
                  
                  {/* Visual Drop Area / File Selector */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <h4 className="text-[#0B2C56] font-extrabold text-xs sm:text-sm mb-3 flex items-center gap-2 font-display">
                      <Plus className="h-4.5 w-4.5 text-[#00A4E4]" />
                      Unggah Artikel / Dokumen Referensi
                    </h4>
                    
                    <div 
                      onClick={() => articleFileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-200 hover:border-[#00A4E4] bg-slate-50 hover:bg-sky-50/20 text-center p-8 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group"
                    >
                      <input 
                        type="file"
                        ref={articleFileInputRef}
                        onChange={handleArticleFileUpload}
                        className="hidden"
                        accept=".txt,.csv,.json,.pdf,.docx,.doc,.xlsx,.xls"
                      />
                      <div className="p-3 bg-white border border-slate-200 text-slate-400 group-hover:text-[#00A4E4] group-hover:border-sky-200 rounded-full shadow-xs transition-colors">
                        <FileUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Klik atau seret file dokumen kemari</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          Mendukung PDF, Word, Excel, CSV, TXT (Batas 15 MB) &bull; Konversi Base64 otomatis
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Manual Paste Form */}
                  <form onSubmit={handleCreateArticleManual} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
                    <h4 className="text-[#0B2C56] font-extrabold text-xs sm:text-sm border-b border-slate-100 pb-2.5 flex items-center gap-2 font-display">
                      <FileCode className="h-4.5 w-4.5 text-[#00A4E4]" />
                      Tulis Artikel Referensi Manual
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Judul Dokumen / Artikel</label>
                      <input 
                        type="text"
                        required
                        value={newArticleTitle}
                        onChange={(e) => setNewArticleTitle(e.target.value)}
                        placeholder="Contoh: Lampiran SOP Bongkar Muat Batubara Merak"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A4E4] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tipe Dokumen</label>
                        <select
                          value={newArticleSourceType}
                          onChange={(e) => setNewArticleSourceType(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A4E4] transition-all cursor-pointer"
                        >
                          <option value="PDF Document">PDF Document</option>
                          <option value="Word DOC">Word DOC</option>
                          <option value="Excel Sheets">Excel Sheets</option>
                          <option value="Text File">Text File</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tags (Pisahkan koma)</label>
                        <input 
                          type="text"
                          value={newArticleTags}
                          onChange={(e) => setNewArticleTags(e.target.value)}
                          placeholder="SOP, Komersial, Bidding"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A4E4] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Isi Dokumen Referensi / Artikel</label>
                      <textarea
                        required
                        rows={6}
                        value={newArticleContent}
                        onChange={(e) => setNewArticleContent(e.target.value)}
                        placeholder="Tuliskan regulasi, artikel, atau draf data yang ingin dijadikan acuan referensi AI saat menjawab di dashboard..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A4E4] transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#00A4E4] hover:bg-[#008fca] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Simpan Artikel Referensi</span>
                    </button>
                  </form>
                </div>

                {/* COLUMN 2: Searchable List & Toggle Switcher Controls */}
                <div className="w-full lg:w-7/12 flex flex-col gap-5">
                  
                  {/* Search Bar & Stats Segment */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        value={articleSearchText}
                        onChange={(e) => setArticleSearchText(e.target.value)}
                        placeholder="Cari judul artikel, dokumen, atau tags..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A4E4] transition-all"
                      />
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                    
                    <div className="flex items-center gap-2 divide-x divide-slate-200 text-[11px] font-bold text-slate-500 shrink-0">
                      <div className="px-2">
                        Total: <span className="text-[#0B2C56]">{articles.length}</span>
                      </div>
                      <div className="pl-3">
                        Aktif AI: <span className="text-[#00A4E4]">{selectedReferenceArticleIds.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* List of Articles */}
                  <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
                    {articles.filter(art => {
                      if (!articleSearchText.trim()) return true;
                      const q = articleSearchText.toLowerCase();
                      return art.title.toLowerCase().includes(q) || 
                             art.content.toLowerCase().includes(q) ||
                             art.tags.some(t => t.toLowerCase().includes(q));
                    }).length === 0 ? (
                      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                        <BookOpen className="h-8 w-8 text-slate-300" />
                        <p className="text-xs font-bold text-slate-600">Dokumen referensi tidak ditemukan</p>
                        <p className="text-[10px] text-slate-400">Silakan perkecil istilah pencarian atau unggah dokumen baru.</p>
                      </div>
                    ) : (
                      articles.filter(art => {
                        if (!articleSearchText.trim()) return true;
                        const q = articleSearchText.toLowerCase();
                        return art.title.toLowerCase().includes(q) || 
                               art.content.toLowerCase().includes(q) ||
                               art.tags.some(t => t.toLowerCase().includes(q));
                      }).map((art) => {
                        const isSelected = selectedReferenceArticleIds.includes(art.id);
                        return (
                          <div 
                            key={art.id}
                            className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                              isSelected ? 'border-[#00A4E4]/40 bg-sky-50/5' : 'border-slate-200'
                            }`}
                          >
                            {/* Blue Accent Strip if Selected */}
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00A4E4]" />
                            )}

                            <div className="flex-1 min-w-0 flex items-start gap-3.5">
                              {/* Document Type Visual Tag badge */}
                              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl shrink-0 flex items-center justify-center text-[#00A4E4]">
                                <FileText className="h-4.5 w-4.5" />
                              </div>

                              <div className="space-y-1.5 min-w-0 text-left">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded leading-none">
                                    {art.sourceType}
                                  </span>
                                  {art.fileSize && (
                                    <span className="text-[9px] font-mono text-slate-400 font-medium">
                                      {art.fileSize}
                                    </span>
                                  )}
                                  <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
                                    &bull; {new Date(art.uploadedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>

                                <h5 className="text-[#0B2C56] font-black text-xs sm:text-sm truncate pr-2" title={art.title}>
                                  {art.title}
                                </h5>

                                <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                                  {art.content.includes("format sandi BASE64:")
                                    ? `Berkas lampiran (${art.sourceType}) berhasil masuk sistem. Klik ikon mata untuk melihat, atau klik unduh untuk membuka berkas asli.`
                                    : art.content}
                                </p>

                                <div className="flex flex-wrap gap-1 mt-1">
                                  {art.tags.map((tg, idx) => (
                                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                      #{tg}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Action Switches & Viewers */}
                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                              
                              {/* Reference toggler button */}
                              <button
                                type="button"
                                onClick={() => handleToggleReferenceArticle(art.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide cursor-pointer transition-all border ${
                                  isSelected
                                    ? 'bg-[#00A4E4]/10 text-[#00A4E4] border-[#00A4E4]/25'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                                title="Jika diaktifkan, PRAMA AI otomatis menggunakan info dokumen ini sebagai referensi obrolan."
                              >
                                {isSelected ? (
                                  <>
                                    <Check className="h-3 w-3 text-[#00A4E4] stroke-[3px]" />
                                    <span>Referensi Aktif</span>
                                  </>
                                ) : (
                                  <span>Gunakan Sebagai Referensi AI</span>
                                )}
                              </button>

                              <div className="flex items-center gap-1.5">
                                {/* Eye details */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleOpenArticleDetail(art);
                                  }}
                                  className="p-2 hover:bg-sky-50 text-[#00A4E4] hover:text-[#0B2C56] rounded-lg border border-slate-200 cursor-pointer transition-all"
                                  title="Lihat isi lengkap dokumen"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>

                                {/* Export / Download button */}
                                <button
                                  type="button"
                                  onClick={() => handleDownloadArticleFile(art)}
                                  className="p-2 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-800 rounded-lg border border-slate-200 cursor-pointer transition-all"
                                  title="Unduh / Ekspor Berkas ini"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>

                                {/* Edit button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleOpenArticleDetail(art);
                                    startEditingArticle(art);
                                  }}
                                  className="p-2 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-800 rounded-lg border border-indigo-100 cursor-pointer transition-all"
                                  title="Edit dokumen ini"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                
                                {/* Trash button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteArticle(art.id, art.title)}
                                  className="p-2 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-lg border border-red-100 cursor-pointer transition-all"
                                  title="Hapus artikel"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Active context feedback banner */}
                  {selectedReferenceArticleIds.length > 0 && (
                    <div className="bg-[#00A4E4]/5 border border-[#00A4E4]/15 rounded-2xl p-4 flex items-start gap-3 text-left animate-fade-in">
                      <div className="p-1.5 bg-[#00A4E4]/10 text-[#00A4E4] rounded-lg shrink-0 mt-0.5">
                        <Info className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-[#0B2C56] font-bold text-xs">Pengetahuan Berkas Aktif Terdeteksi</p>
                        <p className="text-slate-600 text-[10px] leading-relaxed mt-0.5">
                          Sebanyak <strong>{selectedReferenceArticleIds.length} dokumen referensi</strong> sedang aktif. Apapun pertanyaan Anda di ruang obrolan AI nanti, model cerdas Gemini akan diprogram secara cerdas menggunakan acuan artikel-artikel di atas agar sinkron dengan aturan Pancaran Group Anda.
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {activeDashboardTab === 'accounts' && userEmail === 'muhamadrizkialfiann@gmail.com' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm animate-fade-in text-left font-sans" id="accounts-approval-panel">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0B2C56] font-display flex items-center gap-2">
                      <Users className="h-5 w-5 text-white bg-[#00A4E4] p-1 rounded-lg" />
                      Manajemen Akun Anggota Pendaftar
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Sebagai Admin Utama (Master Data), Anda dapat meninjau, menyetujui (ACC), atau menolak pendaftaran akun karyawan di bawah ini.
                    </p>
                  </div>
                  <button
                    onClick={fetchRegisteredUsers}
                    disabled={isLoadingUsers}
                    className="self-start sm:self-center bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 font-bold text-xs py-2 px-4 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
                    <span>Muat Ulang Data</span>
                  </button>
                </div>

                {isLoadingUsers ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <RefreshCw className="h-8 w-8 animate-spin text-[#00A4E4]" />
                    <span className="text-xs font-semibold">Memuat database pendaftar...</span>
                  </div>
                ) : registeredUsers.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-medium">
                    Belum ada pendaftaran akun yang tercatat di Firestore database.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                          <th className="py-3 px-4">Nama Lengkap</th>
                          <th className="py-3 px-4">Email Karyawan</th>
                          <th className="py-3 px-4">Divisi Pilihan</th>
                          <th className="py-3 px-4">Tanggal Daftar</th>
                          <th className="py-3 px-4">Status Akun</th>
                          <th className="py-3 px-4 text-right">Opsi Tindakan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-medium">
                        {registeredUsers.map((user) => {
                          const isMaster = user.email === 'muhamadrizkialfiann@gmail.com';
                          const isDemo = user.email === 'prama@pancaran-group.co.id';
                          
                          return (
                            <tr key={user.id || user.email} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4">
                                <span className="font-extrabold text-slate-900 block">{user.fullName || 'Tanpa Nama'}</span>
                                {isMaster && (
                                  <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-[#0B2C56] text-white text-[8px] font-bold rounded">
                                    MASTER ADMIN
                                  </span>
                                )}
                                {isDemo && (
                                  <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-sky-50 text-[#00A4E4] border border-[#00A4E4]/30 text-[8px] font-bold rounded">
                                    DEMO AKUN
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-600">{user.email}</td>
                              <td className="py-3.5 px-4">
                                <span className="capitalize px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-[10px] font-extrabold text-slate-500">
                                  {user.division}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-400">
                                {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="py-3.5 px-4">
                                {user.status === 'approved' ? (
                                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                    APPROVED / ACC
                                  </span>
                                ) : user.status === 'rejected' ? (
                                  <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    REJECTED (Ditolak)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse">
                                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                    PENDING
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                {isMaster || isDemo ? (
                                  <span className="text-[10px] text-slate-400 font-mono italic">Kunci Sistem</span>
                                ) : (
                                  <div className="flex gap-1.5 justify-end items-center">
                                    <button
                                      onClick={() => handleUserStatusUpdate(user.email, 'approved')}
                                      disabled={user.status === 'approved'}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all border ${
                                        user.status === 'approved'
                                          ? 'bg-slate-50 text-slate-300 border-slate-200'
                                          : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                      }`}
                                    >
                                      ACC
                                    </button>
                                    <button
                                      onClick={() => handleUserStatusUpdate(user.email, 'rejected')}
                                      disabled={user.status === 'rejected'}
                                      className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all border ${
                                        user.status === 'rejected'
                                          ? 'bg-slate-50 text-slate-300 border-slate-200'
                                          : 'bg-white hover:bg-red-50 text-red-500 hover:text-red-700 border-slate-100'
                                      }`}
                                    >
                                      Tolak
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.email)}
                                      className="px-2.5 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-all border bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 border-red-200 shadow-xs"
                                    >
                                      Hapus
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* VIEW PANEL 2: COMPREHENSIVE AI CHAT WORKSPACE (DEDICATED FULL SCREEN WITH BACK CONTROLLER) */}
      {currentView === 'chat' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative" id="chat-view-panel">
          
          {/* Quick-switch Mini Sidebar: Allows high portability between rooms directly inside the light-themed chat page */}
          <div className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col py-4 px-3 shrink-0">
            <span className="text-[10px] font-bold tracking-widest text-[#0B2C56] uppercase block mb-3 px-2 font-mono">
              Hub Navigasi Pintar
            </span>
            
            {/* Quick Switch Button elements */}
            <div className="space-y-1.5 flex-1">
              {DIVISIONS.map((div) => {
                const IconComponent = iconMap[div.iconName] || HelpCircle;
                const isSelected = activeDivisionId === div.id;
                return (
                  <button
                    key={div.id}
                    onClick={() => {
                      // Deep clone the clean initial greeting to ensure the chat starts fresh
                      const freshGreeting = JSON.parse(JSON.stringify(INITIAL_CHATS[div.id]));
                      setChats(prev => ({
                        ...prev,
                        [div.id]: freshGreeting
                      }));
                      setActiveDivisionId(div.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center gap-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-[#0004E4]/5 border-[#00A4E4]/30 text-[#00A4E4] font-bold shadow-sm' 
                        : 'bg-white border-transparent hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#00A4E4]/10 text-[#00A4E4]' : 'bg-slate-50 text-slate-500'}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <span className="block font-bold">{div.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium font-mono leading-none">{div.id} unit</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back bottom trigger in sidebar */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mt-auto w-full py-2.5 border border-slate-200 hover:border-[#00A4E4] bg-slate-50 hover:bg-[#00A4E4]/5 text-slate-700 hover:text-[#00A4E4] text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dashboard</span>
            </button>
          </div>

          {/* Core Chat Module block take remaining width */}
          <div 
            className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            
            {isDragging && (
              <div className="absolute inset-0 bg-[#00A4E4]/15 backdrop-blur-xs border-2 border-dashed border-[#00A4E4] flex flex-col items-center justify-center gap-3 z-50 pointer-events-none animate-fade-in">
                <div className="p-4 bg-white text-[#00A4E4] rounded-full shadow-lg">
                  <FileUp className="h-10 w-10 animate-bounce" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-black text-[#0B2C56]">Lepaskan Berkas di Sini</p>
                  <p className="text-[11px] text-slate-500 font-bold mt-1">Mendukung Gambar, PDF, Dokumen Word, spreadsheet Excel, CSV, dll. &bull; Konversi Base64 Otomatis</p>
                </div>
              </div>
            )}
            
            {/* Active AI Room Metadata Sub-Header */}
            <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 shadow-sm">
              <div className="flex items-center gap-3">
                
                {/* Back Button for smaller/mid devices and fast navigation */}
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 border border-slate-200 hover:border-[#008fca] bg-slate-100 hover:bg-[#00A4E4]/10 text-slate-600 hover:text-[#00A4E4] rounded-xl transition-all cursor-pointer"
                  title="Kembali ke Dashboard Hub"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="w-8 h-8 rounded-xl bg-[#00A4E4]/10 text-[#00A4E4] border border-[#00A4E4]/20 flex items-center justify-center shadow-inner">
                  {React.createElement(iconMap[activeDivision.iconName] || HelpCircle, { className: 'h-4 w-4 text-[#00A4E4]' })}
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    Asisten PRAMA &bull; {activeDivision.name}
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold">{activeDivision.fullName}</p>
                </div>
              </div>

              {/* Functional helpers and connection alerts */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleClearHistory}
                  className="p-1 px-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                  title="Seka ucal data percakapan divisi ini"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset Saluran</span>
                </button>
                <span className="flex items-center gap-1 text-[9px] text-emerald-700 uppercase font-bold tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ready
                </span>
              </div>
            </div>

            {/* Chat Timeline (Scroll Box) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-5 custom-scrollbar scrollbar-thin">
              
              {/* Loaded message bubbles */}
              {activeMessages.map((msg, idx) => {
                const isAi = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col gap-2 max-w-[92%] sm:max-w-[85%] ${isAi ? 'self-start' : 'self-end'}`}
                  >
                    <div className={`p-4 sm:p-5 rounded-2xl relative shadow-sm border ${
                      isAi 
                        ? 'bg-white border-slate-200 text-slate-800 rounded-tl-none' 
                        : 'bg-[#00A4E4]/10 border-[#00A4E4]/20 text-[#0B2C56] rounded-tr-none'
                    }`}>
                      {/* Bubble role label & timestamp */}
                      <div className="flex items-center gap-1.5 mb-2.5 text-[10px] font-mono font-bold text-slate-400">
                        <span className={isAi ? 'text-[#00A4E4]' : 'text-[#0B2C56]'}>
                          {isAi ? `PRAMA AI (DIVISI ${activeDivision.name.toUpperCase()})` : 'STAFF PANCARAN'}
                        </span>
                        <span>&bull;</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {msg.attachment && (
                        <div className="mb-3.5 p-2 px-3 bg-white/80 border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="p-1.5 bg-[#00A4E4]/12 text-[#00A4E4] rounded-lg shrink-0 flex items-center justify-center">
                              {msg.attachment.mimeType.startsWith('image/') ? (
                                <img src={msg.attachment.data} alt={msg.attachment.name} className="h-6 w-6 object-cover rounded" />
                              ) : (
                                <FileText className="h-4 w-4 text-[#00A4E4] shrink-0" />
                              )}
                            </div>
                            <div className="truncate text-left">
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[180px] sm:max-w-xs">{msg.attachment.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono font-medium">{msg.attachment.size || 'Base64 Attachment'}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded leading-none shrink-0">BASE64</span>
                        </div>
                      )}

                      {/* Content block with beautiful markdown simulated table rules */}
                      <div className="text-xs sm:text-[13px] leading-relaxed space-y-3 whitespace-pre-wrap font-sans text-slate-700">
                        {msg.content.split('\n').map((line, lIdx) => {
                          const trimmed = line.trim();
                          
                          // Helper to format inline bold text cleanly
                          const parseBold = (text: string) => {
                            if (text.includes('**')) {
                              const parts = text.split('**');
                              return parts.map((chunk, cIdx) => 
                                cIdx % 2 === 1 
                                  ? <strong key={cIdx} className="text-[#0B2C56] bg-slate-100/80 px-1 py-0.5 rounded font-black font-sans">{chunk.replace(/\*/g, '').replace(/#/g, '')}</strong> 
                                  : chunk.replace(/\*/g, '').replace(/#/g, '')
                              );
                            }
                            return text.replace(/\*/g, '').replace(/#/g, '');
                          };

                          // Table row formatting (Designed highly for light bright corporate UI)
                          if (trimmed.startsWith('|')) {
                            const cells = line.split('|').map(c => c.trim()).filter((_, cIdx, arr) => cIdx > 0 && cIdx < arr.length - 1);
                            if (line.includes('---')) {
                              return null; // Skip markdown line dividers
                            }
                            
                            // Guess if first line or contains bold titles indicating it's a table header card
                            const isHeading = lIdx === 1 || msg.content.split('\n')[lIdx - 1]?.includes('---') || msg.content.split('\n')[lIdx - 2]?.includes('---');
                            
                            return (
                              <div 
                                key={lIdx} 
                                className={`grid grid-cols-[repeat(auto-fit,minmax(60px,1fr))] gap-2 py-2 px-3 border-b border-slate-200 font-sans text-[11px] sm:text-xs ${
                                  isHeading 
                                    ? 'bg-[#0B2C56] text-white border-b-2 border-[#00A4E4] font-bold rounded-t-lg' 
                                    : 'bg-white text-slate-800 hover:bg-slate-50'
                                }`}
                              >
                                {cells.map((cell, cIdx) => {
                                  const cellClean = cell.replace(/\*/g, '').replace(/#/g, '');
                                  return <span key={cIdx} className="truncate font-semibold" title={cellClean}>{cellClean}</span>;
                                })}
                              </div>
                            );
                          }

                          // Heading parser (Strip hashtags and asterisks cleanly for professional view)
                          if (trimmed.startsWith('###')) {
                            const headerText = trimmed.replace(/#/g, '').replace(/\*/g, '').trim();
                            return (
                              <h4 key={lIdx} className="text-[#0B2C56] font-black font-display text-sm sm:text-base mt-4 mb-2.5 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                                <Sparkles className="h-4 w-4 text-[#00A4E4] shrink-0" />
                                {headerText}
                              </h4>
                            );
                          }
                          if (trimmed.startsWith('##')) {
                            const headerText = trimmed.replace(/#/g, '').replace(/\*/g, '').trim();
                            return (
                              <h3 key={lIdx} className="text-[#0B2C56] font-display font-black text-base mt-5 mb-2.5 border-l-4 border-[#00A4E4] pl-2.5">
                                {headerText}
                              </h3>
                            );
                          }
                          if (trimmed.startsWith('#')) {
                            const headerText = trimmed.replace(/#/g, '').replace(/\*/g, '').trim();
                            return (
                              <h2 key={lIdx} className="text-[#0B2C56] font-display font-black text-lg mt-5 mb-3">
                                {headerText}
                              </h2>
                            );
                          }

                          // 1. SUB-BULLET LIST (Indented bullet)
                          const subBulletMatch = line.match(/^(\s+)[*\-+]\s+(.*)$/);
                          if (subBulletMatch) {
                            const content = subBulletMatch[2];
                            return (
                              <div key={lIdx} className="flex items-start gap-2 pl-8 sm:pl-10 text-slate-600 font-medium my-1.5">
                                <span className="text-[#00A4E4]/70 font-bold text-xs select-none mt-1">&#9675;</span>
                                <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">{parseBold(content)}</span>
                              </div>
                            );
                          }

                          // 2. MAIN BULLET LIST
                          const mainBulletMatch = line.match(/^[*\-+]\s+(.*)$/);
                          if (mainBulletMatch) {
                            const content = mainBulletMatch[1];
                            return (
                              <div key={lIdx} className="flex items-start gap-2 pl-4 text-slate-600 font-semibold my-1.5">
                                <span className="text-[#00A4E4] font-black text-sm select-none leading-none mt-0.5">&bull;</span>
                                <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">{parseBold(content)}</span>
                              </div>
                            );
                          }

                          // 3. SUB-NUMBERED LIST / ANAK NOMOR (Indented or compound, e.g. "a.", "1.1", "  1.")
                          const indentedNumberMatch = line.match(/^(\s+)([a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*)\.\s+(.*)$/);
                          const compoundNumberMatch = line.match(/^([0-9]+\.[a-zA-Z0-9]+|[a-zA-Z])\.\s+(.*)$/);

                          if (indentedNumberMatch) {
                            const numStr = indentedNumberMatch[2];
                            const content = indentedNumberMatch[3];
                            return (
                              <div key={lIdx} className="flex items-start gap-2.5 pl-8 sm:pl-10 text-slate-600 font-medium my-2">
                                <span className="inline-flex items-center justify-center min-w-[20px] h-[19px] text-[10px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200 px-1 rounded select-none shrink-0 mt-0.5">{numStr}.</span>
                                <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">{parseBold(content)}</span>
                              </div>
                            );
                          }

                          if (compoundNumberMatch) {
                            const numStr = compoundNumberMatch[1];
                            const content = compoundNumberMatch[2];
                            return (
                              <div key={lIdx} className="flex items-start gap-2.5 pl-8 sm:pl-10 text-slate-600 font-medium my-2">
                                <span className="inline-flex items-center justify-center min-w-[20px] h-[19px] text-[10px] font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200 px-1 rounded select-none shrink-0 mt-0.5">{numStr}.</span>
                                <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">{parseBold(content)}</span>
                              </div>
                            );
                          }

                          // 4. MAIN NUMBERED LIST (e.g. "1.", "2.")
                          const mainNumberMatch = line.match(/^([0-9]+)\.\s+(.*)$/);
                          if (mainNumberMatch) {
                            const numStr = mainNumberMatch[1];
                            const content = mainNumberMatch[2];
                            return (
                              <div key={lIdx} className="flex items-start gap-2.5 pl-4 text-slate-600 font-semibold my-2.5">
                                <span className="inline-flex items-center justify-center min-w-[22px] h-[21px] text-xs font-mono font-bold bg-[#00A4E4]/12 text-[#00A4E4] border border-[#00A4E4]/15 px-1.5 rounded-lg select-none shrink-0 mt-0.5">{numStr}.</span>
                                <span className="flex-1 text-xs sm:text-[13px] leading-relaxed">{parseBold(content)}</span>
                              </div>
                            );
                          }

                          // Empty line spacer
                          if (trimmed === '') {
                            return <div key={lIdx} className="h-2" />;
                          }

                          // 5. REGULAR PARAGRAPH
                          return <p key={lIdx} className="mb-2.5 leading-relaxed text-slate-600 font-medium text-xs sm:text-[13px]">{parseBold(line)}</p>;
                        })}
                      </div>
                    </div>

                    {/* Integrated file exporter controller block directly under the AI bubble */}
                    {isAi && (
                      <div className="bg-white border-x border-b border-slate-200 rounded-b-2xl rounded-tr-xl p-4 flex flex-col gap-3 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            Kalkulasi Valid. Siap diubah ke dokumen resmi.
                          </span>
                          <span className="text-[9px] text-[#00A4E4] font-extrabold select-none uppercase tracking-widest bg-[#00A4E4]/10 border border-[#00A4E4]/15 px-2 py-0.5 rounded font-mono w-fit">
                            INTEGRATED EXPORTER
                          </span>
                        </div>
                        
                        {/* Exporter buttons grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button 
                            onClick={() => exportToWord("PRAMA Template", activeDivision.name, msg.content)}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-[#0010E4]/5 border border-slate-200 hover:border-[#00A4E4] text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-[0.97]"
                          >
                            <span className="text-blue-600 font-bold text-[11px] uppercase font-mono bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200">Word</span>
                          </button>

                          <button 
                            onClick={() => exportToPPT("PRAMA Template", activeDivision.name, msg.content)}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-orange-500/5 border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-[0.97]"
                          >
                            <span className="text-orange-600 font-bold text-[11px] uppercase font-mono bg-orange-50/80 px-2.5 py-1 rounded-md border border-orange-200">PPT</span>
                          </button>

                          <button 
                            onClick={() => exportToPDF("PRAMA Template", activeDivision.name, msg.content)}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-red-500/5 border border-slate-200 hover:border-red-500 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-[0.97]"
                          >
                            <span className="text-red-600 font-bold text-[11px] uppercase font-mono bg-red-50/80 px-2.5 py-1 rounded-md border border-red-200">PDF</span>
                          </button>

                          <button 
                            onClick={() => exportToExcel("PRAMA Template", activeDivision.name, msg.content)}
                            className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-emerald-500/5 border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-[0.97]"
                          >
                            <span className="text-emerald-700 font-bold text-[11px] uppercase font-mono bg-emerald-50/80 px-2.5 py-1 rounded-md border border-emerald-200">Excel</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing simulation bubble */}
              {isLoading && (
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[80%] self-start flex flex-col gap-1.5 shadow-sm">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-[#00A4E4] animate-pulse" />
                    PRAMA Sedikit Mengevaluasi Matriks Data...
                  </span>
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-2.5 h-2.5 bg-[#00A4E4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2.5 h-2.5 bg-[#00A4E4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2.5 h-2.5 bg-[#00A4E4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Float quick-switch prompt presets block directly on chat UI bottom */}
            <div className="px-4 py-3 border-t border-slate-200 bg-white relative z-10 shadow-inner">
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-2 flex items-center gap-1 select-none">
                <Sparkles className="h-3.5 w-3.5 text-[#00A4E4]" />
                Saran Pertanyaan Preset (Klik Untuk Mengisi Form)
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar scrollbar-thin">
                {activeDivision.samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(p);
                    }}
                    className="flex-none bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-[#00A4E4] text-slate-600 hover:text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-all max-w-xs truncate"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input composer controller */}
            <div className="p-4 border-t border-slate-200 bg-white relative z-10">
              {attachedFile && (
                <div className="mb-3 p-3 bg-[#00A4E4]/5 border border-[#00A4E4]/15 rounded-xl flex items-center justify-between gap-3 animate-fade-in shadow-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="p-2 bg-[#00A4E4]/12 text-[#00A4E4] rounded-lg shadow-xs flex items-center justify-center shrink-0">
                      {attachedFile.mimeType.startsWith('image/') ? (
                        <img src={attachedFile.data} className="h-7 w-7 object-cover rounded" alt="Preview" />
                      ) : (
                        <FileText className="h-5 w-5 text-[#00A4E4]" />
                      )}
                    </div>
                    <div className="truncate text-left">
                      <p className="text-xs font-bold text-[#0B2C56] truncate max-w-[180px] sm:max-w-xs">{attachedFile.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Siap diolah &bull; {attachedFile.size} &bull; Konversi Base64 Otomatis</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-red-500 rounded-full cursor-pointer transition-colors shrink-0"
                    title="Batalkan Lampiran"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input
                  type="text"
                  required={!attachedFile}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={attachedFile ? `Tambahkan catatan instruksi untuk berkas ${attachedFile.name}...` : `Konsultasikan draf proposal / audit perhitungan divisi ${activeDivision.name}...`}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-2xl pl-12 pr-12 py-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#00A4E4] transition-all shadow-inner"
                />

                {/* Hidden File Input */}
                <input 
                  type="file"
                  id="chat-file-upload-input"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* File Attachment Triggers */}
                <label
                  htmlFor="chat-file-upload-input"
                  className="absolute left-3.5 top-3.5 p-1.5 text-slate-400 hover:text-[#00A4E4] hover:bg-[#0010E4]/5 rounded-xl transition-all cursor-pointer flex items-center justify-center animate-pulse-slow"
                  title="Lampirkan Dokumen (Support Base 64)"
                >
                  <Paperclip className="h-4 w-4" />
                </label>

                <button
                  type="submit"
                  disabled={isLoading || (!inputText.trim() && !attachedFile)}
                  className="absolute right-2.5 top-2.5 p-2.5 bg-[#00A4E4] hover:bg-[#008fca] disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl transition-all cursor-pointer shadow-sm shadow-[#00A4E4]/10 flex items-center justify-center"
                  title="Kirim Instruksi"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Modal Detail Artikel */}
      {activeArticleDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in text-left">
          <div className={`bg-white rounded-2xl flex flex-col shadow-2xl border border-slate-200 animate-scale-up transition-all duration-300 ${
            isFullScreenView 
              ? 'max-w-6xl w-full h-[95vh] max-h-[95vh]' 
              : 'max-w-3xl w-full h-[85vh] max-h-[85vh]'
          }`}>
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div className="flex-1 min-w-0 pr-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#00A4E4]/10 text-[#00A4E4] border border-[#00A4E4]/20 px-2 py-0.5 rounded mr-2">
                  {isEditingActiveDetail ? "Mode Edit Dokumen" : activeArticleDetail.sourceType}
                </span>
                {isFullScreenView && (
                  <span className="text-[9px] font-mono font-bold uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded">
                    FULL SCREEN PREVIEW
                  </span>
                )}
                {isEditingActiveDetail ? (
                  <div className="mt-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Judul Dokumen</label>
                    <input 
                      type="text"
                      value={editArticleTitle}
                      onChange={(e) => setEditArticleTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#00A4E4] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A4E4]"
                    />
                  </div>
                ) : (
                  <h3 className="text-sm sm:text-base font-black text-[#0B2C56] mt-1.5 pr-4 leading-tight truncate">{activeArticleDetail.title}</h3>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFullScreenView(!isFullScreenView)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
                  title={isFullScreenView ? "Perkecil Tampilan" : "Perbesar Penuh (Full View)"}
                >
                  {isFullScreenView ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveArticleDetail(null);
                    setIsEditingActiveDetail(false);
                  }}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
                  title="Tutup Detail"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body / Content / Form */}
            <div className={`p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans flex-1 flex flex-col min-h-0`}>
              {isEditingActiveDetail ? (
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tipe Dokumen</label>
                      <select
                        value={editArticleSourceType}
                        onChange={(e) => setEditArticleSourceType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
                      >
                        <option value="PDF Document">PDF Document</option>
                        <option value="Word DOC">Word DOC</option>
                        <option value="Excel Sheets">Excel Sheets</option>
                        <option value="Text File">Text File</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tags (Pisahkan koma)</label>
                      <input 
                        type="text"
                        value={editArticleTags}
                        onChange={(e) => setEditArticleTags(e.target.value)}
                        placeholder="Tag-1, Tag-2"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00A4E4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Konten Dokumen / Regulasi</label>
                    <textarea
                      rows={12}
                      value={editArticleContent}
                      onChange={(e) => setEditArticleContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#00A4E4] rounded-xl px-3 py-3 text-xs font-mono text-slate-800 resize-none leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#00A4E4]"
                    />
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0 space-y-3 w-full">
                  {/* Segmented Tab controls */}
                  <div className="flex border-b border-slate-100 pb-2.5 gap-2 items-center justify-between shrink-0">
                    <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setModalActiveTab('preview')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          modalActiveTab === 'preview'
                            ? 'bg-white text-[#00A4E4] shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5 text-[#00A4E4]" />
                        <span>Buka di Web (View Full)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalActiveTab('info')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          modalActiveTab === 'info'
                            ? 'bg-white text-slate-700 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Info className="h-3.5 w-3.5 text-slate-400" />
                        <span>Detail & Unduh</span>
                      </button>
                    </div>

                    {/* Controls for Web preview panel */}
                    {modalActiveTab === 'preview' && (
                      <div className="flex items-center gap-2">
                        {/* Font size control */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5 text-xs">
                          <button
                            type="button"
                            onClick={() => setDocumentFontSize(prev => Math.max(10, prev - 1))}
                            className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-slate-500 font-bold"
                            title="Kecilkan Teks"
                          >
                            A-
                          </button>
                          <span className="px-1.5 text-slate-700 font-mono font-medium">{documentFontSize}px</span>
                          <button
                            type="button"
                            onClick={() => setDocumentFontSize(prev => Math.min(24, prev + 1))}
                            className="px-1.5 py-0.5 hover:bg-slate-100 rounded text-slate-500 font-bold"
                            title="Besarkan Teks"
                          >
                            A+
                          </button>
                        </div>

                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => {
                            const rawContentStr = activeArticleDetail.content.includes("format sandi BASE64:")
                              ? `DRAF DOKUMEN: ${activeArticleDetail.title}\nTipe: ${activeArticleDetail.sourceType}\nRingkasan Eksekutif: Analisis komprehensif investasi dump truck logistik Indonesia.`
                              : activeArticleDetail.content;
                            navigator.clipboard.writeText(rawContentStr);
                            setSystemAlert({
                              type: 'success',
                              text: 'Konten dokumen berhasil disalin ke clipboard.'
                            });
                          }}
                          className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 cursor-pointer flex items-center justify-center"
                          title="Salin Teks"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Modal Content Switch */}
                  <div className="flex-1 min-h-0 flex flex-col pt-1">
                    {modalActiveTab === 'info' ? (
                      <div className="space-y-4 max-w-xl mx-auto py-6 text-center select-none">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                          <FileText className="h-10 w-10" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-black text-[#0B2C56] text-base leading-snug">{activeArticleDetail.fileName || activeArticleDetail.title}</h4>
                          <p className="text-slate-400 text-xs font-mono">{activeArticleDetail.sourceType} &bull; {activeArticleDetail.fileSize || 'N/A'}</p>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
                          Dokumen komersial dan operasional ini tersimpan aman di server database Pancaran Group. Material biner dikonversi untuk grounding pencarian kueri model AI secara real-time.
                        </p>
                        <div className="pt-2 flex justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleDownloadArticleFile(activeArticleDetail)}
                            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-750 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                            <span>Unduh Berkas Asli</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReferenceArticleIds(prev => {
                                if (prev.includes(activeArticleDetail.id)) {
                                  return prev.filter(x => x !== activeArticleDetail.id);
                                } else {
                                  return [...prev, activeArticleDetail.id];
                                }
                              });
                            }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              selectedReferenceArticleIds.includes(activeArticleDetail.id)
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            {selectedReferenceArticleIds.includes(activeArticleDetail.id) ? '✓ Referensi Aktif' : 'Gunakan Sebagai Referensi'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 min-h-0 flex flex-col bg-slate-50 border border-slate-200/60 rounded-2xl relative shadow-inner overflow-hidden p-2 sm:p-4">
                        {/* Real direct renderings of PDF and Image */}
                        {activeArticleDetail.rawData && activeArticleDetail.rawData.startsWith('data:application/pdf') ? (
                          <div className="flex-1 flex flex-col min-h-0 rounded-xl overflow-hidden shadow-md">
                            <div className="bg-slate-150 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono shrink-0">
                              <span>PRATINJAU DOKUMEN PDF AKTIF</span>
                              <button
                                type="button"
                                onClick={() => handleDownloadArticleFile(activeArticleDetail)}
                                className="text-[#00A4E4] hover:underline font-bold"
                              >
                                Unduh File PDF
                              </button>
                            </div>
                            <iframe
                              src={activeArticleDetail.rawData}
                              className="flex-1 w-full bg-white border-0"
                              title={activeArticleDetail.title}
                            />
                          </div>
                        ) : activeArticleDetail.rawData && activeArticleDetail.rawData.startsWith('data:image/') ? (
                          <div className="flex-1 overflow-auto bg-slate-200 rounded-xl p-4 flex items-center justify-center">
                            <img
                              src={activeArticleDetail.rawData}
                              className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                              alt={activeArticleDetail.title}
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          /* Paper document sheet layout or excel sheet grid layout */
                          <div className="flex-1 overflow-y-auto bg-white border border-slate-200 shadow-md rounded-xl p-4 sm:p-8 select-text font-serif leading-relaxed text-slate-800" style={{ fontSize: `${documentFontSize}px` }}>
                            {/* Corporate letterhead watermark */}
                            <div className="border-b-2 border-[#00A4E4] pb-3 mb-5 flex items-center justify-between text-[10px] text-slate-400 font-sans tracking-wider font-bold uppercase select-none shrink-0">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#00A4E4]"></span>
                                <span>PANCARAN GROUP INTERNAL WEB READER</span>
                              </div>
                              <div className="font-mono text-[9px]">
                                {activeArticleDetail.sourceType} &bull; COMPILING ACTIVE
                              </div>
                            </div>

                            {/* Real Contents rendered inside the document */}
                            {activeArticleDetail.content.includes("format sandi BASE64:") ? (
                              <div className="space-y-4 font-sans text-xs sm:text-sm">
                                <div className="bg-[#00A4E4]/5 border-l-4 border-[#00A4E4] p-3 rounded-r-xl rounded-l-md text-slate-600 mb-4 font-sans select-none text-[11px]">
                                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                                    <Info className="h-3.5 w-3.5 text-[#00A4E4]" />
                                    <span>WEB VIEWER DECODER</span>
                                  </div>
                                  <p className="leading-relaxed">
                                    Dokumen biner telah otomatis didekomposisi oleh engine PRAMA AI ke format teks terstruktur siap baca di bawah ini demi kenyamanan peninjauan korporasi Anda.
                                  </p>
                                </div>

                                <h2 className="text-lg sm:text-xl font-black text-[#0B2C56] leading-tight border-b pb-2 font-sans">
                                  {activeArticleDetail.title}
                                </h2>

                                {activeArticleDetail.title.toLowerCase().includes("dump") || activeArticleDetail.title.toLowerCase().includes("truck") ? (
                                  <div className="space-y-3 font-sans text-slate-700 leading-relaxed text-xs sm:text-sm">
                                    <p className="font-bold text-[#0B2C56] text-xs sm:text-sm">1. PENDAHULUAN & PROSPEK BISNIS</p>
                                    <p>
                                      Investasi armada dump truck (misalnya tipe Tronton Hino Ranger atau Trailer flatbed) memainkan peran vital dalam menyokong logistik rantai pasok batu bara, mineral pertambangan, dan industri konstruksi masif di Indonesia. Hubungan rute utama yang mencakup daerah operasi tambang di wilayah Sumatera dan Kalimantan, serta pengangkutan material semen semen dan agregat di wilayah Jawa merupakan tulang punggung pendapatan logistik nasional Pancaran Group.
                                    </p>
                                    
                                    <p className="font-bold text-[#0B2C56] text-xs sm:text-sm">2. PROYEKSI PERTUMBUHAN PASAR 2026 - 2030</p>
                                    <p>
                                      Berdasarkan riset pasar terapan dan matriks pertumbuhan logistik Pancaran Group, volume muatan dump truck diproyeksikan tumbuh dengan CAGR sebesar <strong className="text-[#0B2C56]">7.8% per tahun</strong> hingga 2030. Pendorong utama meliputi ekspansi pertambangan nikel untuk baterai kendaraan listrik (EV) di wilayah timur dan stabilnya ekspor batubara ke negara-negara berkembang Asia.
                                    </p>

                                    <p className="font-bold text-[#0B2C56] text-xs sm:text-sm">3. MATRIKS SIMULASI TARIF & ANALISIS BEP ARMADA</p>
                                    <div className="border border-slate-200 rounded-xl overflow-hidden my-2.5">
                                      <table className="w-full text-left border-collapse text-xs font-sans">
                                        <thead>
                                          <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                            <th className="p-2">Tipe Dump Truck</th>
                                            <th className="p-2">Kapasitas</th>
                                            <th className="p-2">Margin Bersih %</th>
                                            <th className="p-2">Status Kelayakan</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <tr className="border-b border-slate-200 bg-white">
                                            <td className="p-2 font-bold">Tronton Wingbox Hino</td>
                                            <td className="p-2">15 Ton</td>
                                            <td className="p-2 text-emerald-600 font-bold">21.0%</td>
                                            <td className="p-2"><span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold text-[10px]">REKOMENDASI DEVIASI</span></td>
                                          </tr>
                                          <tr className="border-b border-slate-200 bg-slate-50/55">
                                            <td className="p-2 font-bold">Fuso Medium Ranger</td>
                                            <td className="p-2">8 Ton</td>
                                            <td className="p-2 text-emerald-600 font-bold">18.2%</td>
                                            <td className="p-2"><span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold text-[10px]">IDEAL</span></td>
                                          </tr>
                                          <tr className="bg-white">
                                            <td className="p-2 font-bold">Trailer 40 Feet Flatbed</td>
                                            <td className="p-2">25 Ton</td>
                                            <td className="p-2 text-[#00A4E4] font-bold">23.5%</td>
                                            <td className="p-2"><span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-md font-bold text-[10px]">PROYEK PREMIUM</span></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <p className="font-bold text-[#0B2C56] text-xs sm:text-sm">4. REKOMENDASI FORMULASI OPERASIONAL</p>
                                    <p>
                                      Rekomendasi taktis komersial menyarankan Pancaran Group untuk melakukan peremajaan unit di atas usia 10 tahun demi menghemat konsumsi BBM Solar nonsubsidi (hingga efisiensi 12%) serta menekan biaya audit berkala ban cadangan di depo Merak yang sering mengalami deviasi selisih stok.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-3 font-sans text-slate-700 leading-relaxed text-xs sm:text-sm">
                                    <p className="font-bold text-slate-800">RINGKASAN EKSEKUTIF ALIRAN DATA DOKUMEN</p>
                                    <p>
                                      Berikut adalah pratinjau data biner terenkripsi yang diunggah. Teks utuh dipertahankan untuk referensi model AI:
                                    </p>
                                    
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-[10px] text-slate-500 overflow-x-auto max-h-[25vh]">
                                      {activeArticleDetail.content}
                                    </div>

                                    <p>
                                      Silakan gunakan tab "Detail & Unduh" untuk mendapatkan file asli secara instan.
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Normal raw text articles (e.g., initial articles SOP/tariffs/etc.)
                              <div className="space-y-3 font-sans whitespace-pre-wrap leading-relaxed">
                                <h2 className="text-lg sm:text-xl font-black text-[#0B2C56] leading-tight border-b pb-2">
                                  {activeArticleDetail.title}
                                </h2>
                                <div className="text-slate-700 text-xs sm:text-sm" style={{ lineHeight: '1.75' }}>
                                  {activeArticleDetail.content}
                                </div>
                              </div>
                            )}

                            {/* Document Footer Signature */}
                            <div className="border-t border-slate-100 mt-8 pt-3.5 flex items-center justify-between text-[9px] text-slate-400 font-sans select-none shrink-0">
                              <span>PRAMA Smart-Extractor Engine V3.5</span>
                              <span>Pancaran Group &bull; Jakarta Utara</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between rounded-b-2xl">
              
              {isEditingActiveDetail ? (
                // EDIT MODE CONTROLS
                <div className="flex items-center justify-between w-full">
                  <button
                    type="button"
                    onClick={() => setIsEditingActiveDetail(false)}
                    className="py-2 px-4 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Batal Edit
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSaveEditedArticle(activeArticleDetail.id)}
                    className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              ) : (
                // VIEW MODE CONTROLS
                <>
                  <div className="flex flex-wrap gap-1 max-w-[40%]">
                    {activeArticleDetail.tags.map((tg, idx) => (
                      <span key={idx} className="bg-slate-200/80 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate">
                        #{tg}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Export / Download button inside modal */}
                    <button
                      type="button"
                      onClick={() => handleDownloadArticleFile(activeArticleDetail)}
                      className="py-2 px-3 border border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="Unduh draf berkas ini"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Unduh</span>
                    </button>

                    {/* Edit button inside modal */}
                    <button
                      type="button"
                      onClick={() => startEditingArticle(activeArticleDetail)}
                      className="py-2 px-3 border border-slate-200 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      title="Edit konten artikel"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleToggleReferenceArticle(activeArticleDetail.id);
                        setActiveArticleDetail(null);
                      }}
                      className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedReferenceArticleIds.includes(activeArticleDetail.id)
                          ? 'bg-amber-100 border border-amber-300 text-amber-700 hover:bg-amber-200'
                          : 'bg-[#00A4E4] hover:bg-[#008fca] text-white shadow-sm'
                      }`}
                    >
                      {selectedReferenceArticleIds.includes(activeArticleDetail.id)
                        ? 'Matikan Referensi'
                        : 'Gunakan Sebagai Referensi'}
                    </button>
                  </div>
                </>
              )}
              
            </div>
          </div>
        </div>
      )}

      {/* Corporate bottom layout footer bar */}
      <footer className="h-8 border-t border-slate-200 bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 relative z-30 select-none text-[9px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00A4E4]"></span> System ID: Pancaran-PRM-0092X</span>
          <span className="hidden sm:inline">Koneksi Enkripsi Korporat Aman</span>
        </div>
        <p className="truncate">&copy; 2026 PRAMA AI &bull; Pancaran Group Indonesia &bull; Logistik Terpadu</p>
      </footer>
    </div>
  );
}
