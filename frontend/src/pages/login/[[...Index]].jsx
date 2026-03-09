import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* Tombol kembali */}
      <Link
        href="/"
        className="absolute top-6 left-6 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700"
      >
        ← Kembali
      </Link>

      <SignIn path="/login" signUpUrl="/register" routing="path" />
    </div>
  );
}
