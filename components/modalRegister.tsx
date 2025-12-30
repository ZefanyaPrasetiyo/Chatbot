"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Eye } from "lucide-react";
import { EyeClosed } from "lucide-react";

export default function RegisterModal({ onSwitchToLogin }: ModalDaftarProps) {
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const Daftar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !nama || !password) {
        toast.error("Semua field harus diisi");
        return;
      }
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          name: nama,
          password: password,
          email: data.user.email,
        });
        toast.warning("Silahkan cek email untuk verifikasi akun");

        setEmail("");
        setNama("");
        setPassword("");
        setShowPassword(false);
        onSwitchToLogin();
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  interface ModalDaftarProps {
    onSwitchToLogin?: () => void;
  }
  return (
    <div className="w-full max-w-md bg-gray-900 rounded-2xl p-6 shadow-lg w-sm">
      <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center mx-auto">
        <Lock className="mx-auto text-purple-600" />
      </div>
      <h2 className="text-xl font-medium text-white text-center mt-4">
        Selamat Datang !
      </h2>
      <h2 className="text-md font-medium text-gray-500 text-center">
        Daftarkan akun untuk melanjutkan
      </h2>
      <form onSubmit={Daftar} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="nama" className="text-gray-300 mb-1">
            Nama
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <label htmlFor="email" className="text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="relative">
          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg p-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-12 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <EyeClosed /> : <Eye />}
            </button>
          </div>
        </div>
        <Link href={""}>
          <h2 className="text-right text-md text-medium text-white hover:underline">
            Lupa password ?
          </h2>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Daftar"}
        </button>
      </form>

      <p className="text-gray-400 text-sm mt-4 text-center">
        Sudah punya akun?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-purple-500 hover:underline font-semibold"
        >
          Masuk di sini
        </button>
      </p>
    </div>
  );
}
