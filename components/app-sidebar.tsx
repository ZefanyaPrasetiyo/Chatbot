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
import { Ellipsis, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import ModalSettingRiwayat from "./modal-setting-riwayat";

type Riwayat = {
  id: string;
  judul: string | null;
};

export function AppSidebar() {
  const [riwayat, setRiwayat] = useState<Riwayat[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const logOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Apakah kamu yakin mau keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      reverseButtons: true,
      theme: "dark",
    });

    if (!result.isConfirmed) return;

    await supabase.auth.signOut();
    window.location.reload();
  };

  const fetchRiwayat = async () => {
    const { data } = await supabase
      .from("percakapan")
      .select("id, judul")
      .order("created_at", { ascending: false });

    setRiwayat(data || []);
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("sidebar-percakapan")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "percakapan" },
        (payload: any) => {
          setRiwayat((prev) =>
            prev.some((item) => item.id === payload.new.id)
              ? prev
              : [payload.new, ...prev]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <Sidebar>
        <SidebarHeader className="lg:text-center text-white font-bold bg-black">
          VYOLET
        </SidebarHeader>

        <SidebarContent className="bg-black text-white">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">
              Menu
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-800/60 hover:text-white"
                  >
                    <Link href="/">Obrolan baru</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarGroupLabel className="text-gray-400">
                  Riwayat Obrolan
                </SidebarGroupLabel>

                {riwayat.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <div className="relative flex items-center group/item">
                      <SidebarMenuButton
                        className="w-full pr-10 hover:bg-gray-800/60 hover:text-white"
                        onClick={() =>
                          Swal.fire(
                            "Info",
                            "Maaf fitur sedang dikembangkan",
                            "info"
                          )
                        }
                      >
                        <span className="truncate">
                          {item.judul || "Obrolan Baru"}
                        </span>
                      </SidebarMenuButton>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(item.id);
                          setOpenModal(true);
                        }}
                        className="absolute right-3 opacity-0 group-hover/item:opacity-100 transition-opacity text-white hover:text-gray-300"
                      >
                        <Ellipsis size={14} />
                      </button>
                    </div>
                  </SidebarMenuItem>
                ))}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-gray-800/60 hover:text-white"
                  >
                    <Button
                      className="bg-transparent flex items-center justify-start"
                      onClick={logOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-black text-white">Vy</SidebarFooter>
      </Sidebar>

      <ModalSettingRiwayat
        open={openModal}
        id={selectedId}
        onClose={() => setOpenModal(false)}
        onSuccess={(id) =>
          setRiwayat((prev) => prev.filter((item) => item.id !== id))
        }
      />
    </>
  );
}
