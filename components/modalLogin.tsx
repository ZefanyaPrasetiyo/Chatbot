"use client"

import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "sonner"
import { Lock } from 'lucide-react';
import Link from "next/link"
import { useRouter } from "next/navigation";

interface ModalMasukProps {
  onSwitchToRegister?: () => void
}

export default function ModalMasuk({ onSwitchToRegister }: ModalMasukProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const Masuk = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Login berhasil!")
      router.refresh();
    }

    setLoading(false)
  }

  return (
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl p-6 shadow-lg w-sm">
        <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center mx-auto">
        <Lock className="mx-auto text-purple-600" />
        </div>
        <h2 className="text-xl font-medium text-white text-center mt-4">Selamat Datang !</h2>
        <h2 className="text-md font-medium text-gray-500 text-center">Masuk ke Akun Anda</h2>
        <form onSubmit={Masuk} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-300 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-300 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <Link href={""}>
            <h2 className="text-right text-md text-medium text-white hover:underline">Lupa password ?</h2>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Belum punya akun?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-purple-500 hover:underline font-semibold"
          >
            Daftar di sini
          </button>
        </p>
      </div>
  )
}
