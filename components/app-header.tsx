"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthModal from "./authModal";
import { useSession } from "@/hooks/useSession";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AppHeader() {
  const session = useSession();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      setUserName(data?.name);
    };
    loadUser();
  });

  const userInitial = userName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 border-b border-white/10 bg-black">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white" />
        <h1 className="font-semibold text-lg text-white">Vyolet</h1>
      </div>
      <div>
        {session ? (
          <div className="flex items-center gap-2 text-white rounded-full px-3 py-1">
            <span>{userName}</span>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-bold">
              {userInitial}
            </div>
          </div>
        ) : (
          <AuthModal />
        )}
      </div>
    </header>
  );
}
