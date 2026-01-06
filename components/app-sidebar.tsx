"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { Ellipsis, LogOut, Trash2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowDownToLine } from 'lucide-react';

type Riwayat = {
  id: string;
  judul: string | null;
};

export function AppSidebar() {
  const [riwayat, setRiwayat] = useState<Riwayat[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);


  const downloadApk = () => {
  window.location.href =
    "https://github.com/ZefanyaPrasetiyo/apk-download/releases/tag/v1.0-test/Chess-test.apk";
};

  const obrolanBaru = () => {
    window.location.reload();
  };

  const hapusRiwayat = async (id: string) => {
    const res = await Swal.fire({
  title: "Hapus riwayat?",
  text: "Chat ini akan dihapus permanen",
  icon: "warning",
  iconColor: "#a855f7",
  showCancelButton: true,
  background: "#111827",
  color: "#ffffff",
  confirmButtonColor: "#a855f7", 
  cancelButtonColor: "#ef4444", 
  confirmButtonText: "Hapus",
  cancelButtonText: "Batal",
});


    if (!res.isConfirmed) return;

    const { error } = await supabase.from("percakapan").delete().eq("id", id);

    if (!error) {
      setRiwayat((prev) => prev.filter((r) => r.id !== id));
      setOpenId(null);
    }
  };

  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
  });

  const {
    data: listener,
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


  useEffect(() => {
  if (!session) {
    setRiwayat([]);
    return;
  }

  supabase
    .from("percakapan")
    .select("id, judul")
    .order("created_at", { ascending: false })
    .then(({ data }) => setRiwayat(data || []));
}, [session]);


  const logOut = async () => {
    const res = await Swal.fire({
  title: "Yakin ingin keluar?",
  text: "Confirm untuk logout dari akun Anda.",
  icon: "warning",
  iconColor: "#a855f7",
  showCancelButton: true,
  background: "#111827",
  color: "#ffffff",
  confirmButtonColor: "#a855f7", 
  cancelButtonColor: "#ef4444", 
  confirmButtonText: "Ya",
  cancelButtonText: "Batal",
});

    if (res.isConfirmed) {
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="bg-black text-white font-bold text-center text-2xl">
        <div className="flex flex-row items-center gap-2 px-1 justify-items-start">
        <Image
          src={"/image/logo-vyolet.png"}
          alt="Vyolet Logo"
          width={80}
          height={80}
          />
          <h1 className="text-white text-3xl">VYOLET</h1>
          </div>
      </SidebarHeader>
      <SidebarContent className="bg-black text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Menu</SidebarGroupLabel>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="hover:bg-purple-600/30 hover:text-white"
            >
              <button onClick={obrolanBaru}>Obrolan baru</button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarGroupLabel className="text-gray-400">
            Riwayat Obrolan
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {riwayat.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <div className="relative flex items-center ">
                    <SidebarMenuButton className="w-full pr-8 hover:bg-purple-600/30 hover:text-white">
                      <span className="truncate">{item.judul}</span>
                    </SidebarMenuButton>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenId(openId === item.id ? null : item.id);
                      }}
                      className="absolute right-2"
                    >
                      <Ellipsis size={14} />
                    </button>

                    {openId === item.id && (
                      <div className="absolute right-2 top-full mt-1 z-50 w-28 bg-gray-800 shadow rounded-xl">
                        <button
                          onClick={() => hapusRiwayat(item.id)}
                          className="flex font-bold w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-700 rounded-xl"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                >
                <button onClick={downloadApk} className="transition-all duration-200 cursor-pointer rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white transition duration-300">
                  <div className="flex flex-row items-center justify-center px-12 py-2 font-bold text-center">
                    <ArrowDownToLine className="inline mr-2 h-4 w-4" />
                  Unduh Aplikasi
                  </div>
                </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {session && (
                <SidebarMenuItem>
                <Button
                  onClick={logOut}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-600/20 hover:text-red-600"
                  >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </Button>
              </SidebarMenuItem>
                )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black text-white text-center">
        Vy
      </SidebarFooter>
    </Sidebar>
  );
}
