import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side Kiri */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600">
        <div className="text-center text-white px-10">
          <img src="/login-illustration.png" className="w-96 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-3">E-Wallet Sentiment</h1>
          <p className="text-lg opacity-90">
            Analisis sentimen pengguna dompet digital secara mudah dan cepat.
          </p>
        </div>
      </div>

      {/* Side Kanan */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-2">Login</h2>

          <p className="text-gray-500 text-center mb-8">Masuk ke akun anda</p>

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div className="mb-2">
            <label className="text-sm text-gray-600">Password</label>

            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Lock size={18} className="text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full p-2 outline-none"
              />

              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right text-sm mb-6">
            <Link href="/forgotPassword" className="text-purple-600 hover:underline">
              Forgot Password
            </Link>
          </div>

          {/* LOGIN BUTTON */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
            Login
          </button>

          {/* GOOGLE LOGIN */}
          <button className="w-full border mt-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            <img src="/google.png" className="w-5" />
            Login dengan Google
          </button>

          {/* REGISTER */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Tidak punya akun?{" "}
            <Link href="/register" className="text-purple-600 font-semibold hover:underline">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
