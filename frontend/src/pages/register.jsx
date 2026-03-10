import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
        <div className="text-center text-white px-10">
          <img src="/login-illustration.png" className="w-96 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-3">Buat Akun Baru</h1>
          <p className="opacity-90">Mulai analisis sentimen e-wallet sekarang.</p>
        </div>
      </div>

      {/* FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

          <div className="mb-4">
            <label className="text-sm text-gray-600">Nama</label>

            <div className="flex items-center border rounded-lg px-3 mt-1">
              <User size={18} className="text-gray-400" />
              <input type="text" placeholder="Nama lengkap" className="w-full p-2 outline-none" />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>

            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                placeholder="email@gmail.com"
                className="w-full p-2 outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm text-gray-600">Password</label>

            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Lock size={18} className="text-gray-400" />
              <input type="password" placeholder="********" className="w-full p-2 outline-none" />
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold">
            Daftar
          </button>

          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-purple-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
