import React, { useState } from 'react';
import PancaranLogo from './PancaranLogo';
import { Shield, Key, Mail, Lock, ArrowRight, UserCheck, ArrowLeft, UserPlus, FileText } from 'lucide-react';
import { db } from '../utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
  onBackToLanding?: () => void;
}

export default function LoginView({ onLoginSuccess, onBackToLanding }: LoginViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form states
  const [email, setEmail] = useState('prama@pancaran-group.co.id');
  const [password, setPassword] = useState('pancaranprama');
  
  // Register form states
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regDivision, setRegDivision] = useState('comercial');
  const [regSuccess, setRegSuccess] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const loginEmailClean = email.trim().toLowerCase();

    try {
      // 1. Check if the user is logging in using the main master admin account
      if (loginEmailClean === 'muhamadrizkialfiann@gmail.com' && password === '12345678') {
        // Automatically upsert or seed the master admin account in Firestore to ensure it exists
        const adminRef = doc(db, 'users', 'muhamadrizkialfiann@gmail.com');
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
          await setDoc(adminRef, {
            email: 'muhamadrizkialfiann@gmail.com',
            password: '12345678',
            fullName: 'Muhamad Rizki Alfian (Admin)',
            role: 'admin',
            status: 'approved',
            division: 'comercial',
            createdAt: new Date().toISOString()
          });
        }
        setIsLoading(false);
        onLoginSuccess('muhamadrizkialfiann@gmail.com');
        return;
      }

      // Check for custom demo account to make onboarding seamless
      if (loginEmailClean === 'prama@pancaran-group.co.id' && password === 'pancaranprama') {
        const demoRef = doc(db, 'users', 'prama@pancaran-group.co.id');
        const demoSnap = await getDoc(demoRef);
        if (!demoSnap.exists()) {
          await setDoc(demoRef, {
            email: 'prama@pancaran-group.co.id',
            password: 'pancaranprama',
            fullName: 'Prama Demo User',
            role: 'user',
            status: 'approved',
            division: 'comercial',
            createdAt: new Date().toISOString()
          });
        }
        setIsLoading(false);
        onLoginSuccess('prama@pancaran-group.co.id');
        return;
      }

      // 2. Query other accounts in the database
      const userRef = doc(db, 'users', loginEmailClean);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.password === password) {
          if (userData.status === 'approved') {
            setIsLoading(false);
            onLoginSuccess(userData.email);
          } else if (userData.status === 'pending') {
            setError('Akun Anda sedang dalam antrean persetujuan oleh Admin (muhamadrizkialfiann@gmail.com). Silakan hubungi Admin untuk persetujuan ("ACC").');
            setIsLoading(false);
          } else {
            setError('Pendaftaran akun Anda ditolak atau dinonaktifkan oleh administrator.');
            setIsLoading(false);
          }
        } else {
          setError('Katasandi (password) yang Anda masukkan salah.');
          setIsLoading(false);
        }
      } else {
        setError('Alamat email belum terdaftar. Silakan daftar via tab Pendaftaran.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Firestore Login Error:", err);
      // Fallback in case of temporary network or connection issues
      if (loginEmailClean === 'muhamadrizkialfiann@gmail.com' && password === '12345678') {
        onLoginSuccess('muhamadrizkialfiann@gmail.com');
      } else if (loginEmailClean === 'prama@pancaran-group.co.id' && password === 'pancaranprama') {
        onLoginSuccess('prama@pancaran-group.co.id');
      } else {
        setError('Layanan cloud tidak terhubung. Silakan beralih ke kredensial admin / demo utama.');
        setIsLoading(false);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRegSuccess('');

    const regEmailClean = regEmail.trim().toLowerCase();

    if (regPassword.length < 6) {
      setError('Kata sandi pendaftaran minimal harus terdiri atas 6 karakter.');
      setIsLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', regEmailClean);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setError('Alamat email ini sudah terdaftar di sistem PRAMA.');
        setIsLoading(false);
        return;
      }

      // Determine role: make muhamadrizkialfiann@gmail.com admin automatically, others default user
      const computedRole = regEmailClean === 'muhamadrizkialfiann@gmail.com' ? 'admin' : 'user';
      const computedStatus = regEmailClean === 'muhamadrizkialfiann@gmail.com' ? 'approved' : 'pending';

      await setDoc(userRef, {
        email: regEmailClean,
        password: regPassword,
        fullName: regFullName,
        role: computedRole,
        status: computedStatus,
        division: regDivision,
        createdAt: new Date().toISOString()
      });

      setRegSuccess(`Registrasi Berhasil! Akun ${regEmailClean} didaftarkan dengan status PENDING. Silakan minta Admin utama (muhamadrizkialfiann@gmail.com) untuk menyetujui ("ACC") akun Anda.`);
      setRegEmail('');
      setRegFullName('');
      setRegPassword('');
      setIsLoading(false);
      setActiveTab('login');
      setEmail(regEmailClean);
    } catch (err: any) {
      console.error("Firestore Registry Error:", err);
      setError('Gagal mendaftarkan akun baru ke database. Pastikan koneksi internet stabil.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess('prama@pancaran-group.co.id');
    }, 400);
  };

  const activeDivisionText = (divId: string) => {
    switch(divId) {
      case 'comercial': return 'Commercial Division';
      case 'hca': return 'HCA & Training';
      case 'fina': return 'Finance & Accounting';
      case 'lga': return 'Legal & Corporate Secretary';
      case 'spia': return 'SPI Audit & Ban';
      default: return 'Commercial Division';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 relative overflow-hidden" id="login-container">
      {/* Background elegant corporate curves */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00A4E4]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-[#0B2C56]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Center Cards */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto my-8 relative z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="mb-6 text-center" id="brand-header">
          <div className="bg-white rounded-2xl p-4 shadow-md inline-block border border-slate-200/80 mb-3 hover:scale-105 transition-transform duration-300">
            <PancaranLogo className="h-12" />
          </div>
          <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight">
            PRAMA SYSTEM
          </h1>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">
            Project Management Analytics — Corporate AI Bot
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-full mb-4 border border-slate-200">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-[#00A4E4] shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Portal Masuk Karyawan</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Registrasi Akun Baru</span>
          </button>
        </div>

        {/* Status Alerts */}
        {regSuccess && (
          <div className="mb-4 text-emerald-800 text-xs py-3 px-4 bg-emerald-50 border border-emerald-100 rounded-2xl font-medium shadow-sm leading-relaxed w-full">
            {regSuccess}
          </div>
        )}

        {/* Login/Register Form Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl w-full" id="login-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold font-display flex items-center gap-2 ${activeTab === 'login' ? 'text-slate-800' : 'text-[#0B2C56]'}`}>
              {activeTab === 'login' ? (
                <>
                  <Shield className="h-5 w-5 text-[#00A4E4]" />
                  Portal Masuk Karyawan
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 text-emerald-500" />
                  Registrasi Akun
                </>
              )}
            </h2>
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors text-xs font-semibold cursor-pointer"
                title="Kembali ke beranda video"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali</span>
              </button>
            )}
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Input Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Alamat Email Kantor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00A4E4] focus:ring-1 focus:ring-[#00A4E4] text-sm transition-all shadow-inner"
                    placeholder="name@pancaran-group.co.id"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Kata Sandi (Password)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00A4E4] focus:ring-1 focus:ring-[#00A4E4] text-sm transition-all shadow-inner"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-600 text-xs py-2 px-3 text-center bg-red-50 border border-red-100 rounded-lg font-medium leading-relaxed">
                  {error}
                </p>
              )}

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00A4E4] hover:bg-[#008fca] active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm mt-6 flex items-center justify-center gap-2"
                id="btn-login-submit"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memverifikasi...
                  </div>
                ) : (
                  <>
                    Masuk ke Dashboard PRAMA
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Reg Email */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Alamat Email Kantor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all shadow-inner"
                    placeholder="email@pancaran-group.co.id"
                  />
                </div>
              </div>

              {/* Reg Fullname */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Nama Lengkap Karyawan
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all shadow-inner"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
              </div>

              {/* Reg Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Kata Sandi (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all shadow-inner"
                    placeholder="Masukkan sandi unik Anda"
                  />
                </div>
              </div>

              {/* Division Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Pilihan Divisi Kerja Utama
                </label>
                <select
                  value={regDivision}
                  onChange={(e) => setRegDivision(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                >
                  <option value="comercial">Commercial Division</option>
                  <option value="hca">HCA & Training</option>
                  <option value="fina">Finance & Accounting</option>
                  <option value="lga">Legal & Corporate Secretary</option>
                  <option value="spia">SPI Audit & Ban</option>
                </select>
              </div>

              {/* Reg Error Message */}
              {error && (
                <p className="text-red-600 text-xs py-2 px-3 text-center bg-red-50 border border-red-100 rounded-lg font-medium leading-relaxed">
                  {error}
                </p>
              )}

              {/* Register Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm mt-6 flex items-center justify-center gap-2"
                id="btn-register-submit"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mendaftarkan...
                  </div>
                ) : (
                  <>
                    Daftar Akun Baru
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Access Bypass Button (Only show in login) */}
          {activeTab === 'login' && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={handleDemoLogin}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-850 border border-slate-200 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-sm"
                id="btn-demo-bypass"
              >
                <UserCheck className="h-4 w-4 text-emerald-500" />
                Masuk Instan dengan Akun Demo
              </button>
            </div>
          )}
        </div>

        {/* Credentials hints card for developers */}
        <div className="mt-4 bg-white border border-slate-200/80 rounded-xl p-4 w-full text-center shadow-md animate-fade-in">
          <span className="text-[10.5px] font-bold text-slate-600 block mb-2 uppercase tracking-wider flex items-center justify-center gap-1">
            <Key className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> KREDENSIAL AKSES DATABASE FIRESTORE
          </span>
          <div className="space-y-2">
            <div className="bg-amber-50/75 p-2 rounded-xl border border-amber-100/80 text-left text-[11px]">
              <span className="text-amber-700 block font-sans font-bold text-[9px] uppercase tracking-wide">Akun Utama Administrasi (Admin):</span>
              <div className="flex justify-between font-mono bg-white px-2 py-1 rounded border border-amber-100 mt-1">
                <span>muhamadrizkialfiann@gmail.com</span>
                <span className="font-bold text-amber-800">Sandi: 12345678</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-slate-600 text-left">
                <span className="text-slate-400 block font-sans font-bold text-[9px] uppercase">Default Demo User:</span>
                prama@pancaran-group.co.id
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-slate-600 text-left">
                <span className="text-slate-400 block font-sans font-bold text-[9px] uppercase">Default Sandi:</span>
                pancaranprama
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branded Line */}
      <div className="text-center text-slate-400 text-xs py-4" id="login-footer">
        &copy; {new Date().getFullYear()} Pancaran Group Indonesia. All rights reserved. <br/>
        <span className="text-[10px] text-slate-400 font-mono">PRAMA BOT v1.0.0 &bull; Secure Corporate Channel (Integrated with Firestore Database)</span>
      </div>
    </div>
  );
}
