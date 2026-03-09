import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">E-Wallet Sentiment Dashboard</h1>

        <p className="text-gray-600 mb-8">
          Analisis sentimen pengguna dompet digital dengan mudah.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
