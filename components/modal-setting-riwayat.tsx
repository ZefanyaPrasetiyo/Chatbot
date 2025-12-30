import Swal from "sweetalert2";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function ModalSettingRiwayat() {
  const [riwayat, setRiwayat] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const hapusRiwayat = async () => {
    if (!selectedId) return;

    const result = await Swal.fire({
      title: "Hapus riwayat?",
      text: "Chat ini akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    await supabase.from("percakapan").delete().eq("id", selectedId);

    setRiwayat((prev) => prev.filter((i) => i.id !== selectedId));
    setOpenModal(false);
    setSelectedId(null);
  };
  <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm">
    <button onClick={() => hapusRiwayat()}>
      <Trash2 className="text-red-500 hover:text-red-700" />
    </button>
  </div>;
}
