"use client";

import { useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import { Trash2, Pencil } from "lucide-react";

type Props = {
  open: boolean;
  id: string;
  onClose: () => void;
  onSuccess: (id: string) => void;
};

export default function ModalSettingRiwayat({
  open,
  id,
  onClose,
  onSuccess,
}: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const hapusRiwayat = async () => {
    const result = await Swal.fire({
      title: "Hapus riwayat?",
      text: "Chat ini akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase
      .from("percakapan")
      .delete()
      .eq("id", id);

    if (error) {
      Swal.fire("Error", "Gagal menghapus data", "error");
      return;
    }

    onSuccess(id);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-2 top-full mt-2 z-50 bg-gray-800 p-3 w-40 text-white text-sm shadow-xl flex flex-col gap-2"
    >
      <button
        onClick={hapusRiwayat}
        className="flex items-center gap-2 text-red-500 hover:bg-gray-700 p-2"
      >
        <Trash2 size={16} />
        Hapus
      </button>

      <button className="flex items-center gap-2 hover:bg-gray-700 p-2 rounded">
        <Pencil size={16} />
        Ganti judul
      </button>
    </div>
  );
}
