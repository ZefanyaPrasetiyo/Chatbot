"use client";
import { useState } from "react";
import { AwardIcon, SendHorizontal } from "lucide-react";
import {
  LimitUser,
  jumlahLimitUser,
  LimitTercapai,
  LIMIT,
} from "@/utils/limit";
import { useSession } from "@/hooks/useSession";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  console.log("=========================", session);
  const [pesanPertama, setPesanPertama] = useState(true);

  const simpanPercakapan = async (prompt: string) => {
  const dataBaru = {
    id: crypto.randomUUID(),
    judul: prompt.slice(0, 40),
    created_at: new Date().toISOString(),
  };

  window.dispatchEvent(
    new CustomEvent("percakapan-baru", { detail: dataBaru })
  );

  const { error } = await supabase.from("percakapan").insert({
    judul: prompt.slice(0, 40),
  });

  if (error) console.error(error);
};

  const sendPrompt = async () => {
    if (!prompt.trim() || loading) return;

    if (!session) {
      if (LimitTercapai()) {
        toast.error("Anda telah mencapai batas maksimum pertanyaan.");
        return;
      }
      jumlahLimitUser();
    }

    const userPrompt = prompt;
    setPrompt("");
    setLoading(true);

    if (pesanPertama) {
      await simpanPercakapan(userPrompt);
      setPesanPertama(false);
    }

    setChats((prev) => [
      ...prev,
      {
        pertanyaan: userPrompt,
        jawaban: "...",
        isloading: true,
      },
    ]);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();

      setChats((prev) =>
        prev.map((chat, i) =>
          i === prev.length - 1
            ? { ...chat, jawaban: data.reply, isloading: false }
            : chat
        )
      );
    } catch (error) {
      setChats((prev) =>
        prev.map((chat, i) =>
          i === prev.length - 1
            ? { ...chat, jawaban: "Terjadi Kesalahan", isloading: false }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <h1
        className="text-5xl font-bold bg-white
                  bg-clip-text text-transparent text-center py-8"
      >
        Tanya Vyolet !
      </h1>
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        <div className="max-w-xl mx-auto space-y-4 pb-32">
          {chats.map((chat, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-purple-600 p-3 rounded-2xl w-fit ml-auto max-w-[70%]">
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {chat.pertanyaan}
                </p>
              </div>
              <div className="p-3 rounded-2xl w-fit mr-auto max-w-[85%]">
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {chat.isloading ? (
                    <span className="flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </span>
                  ) : (
                    chat.jawaban
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 flex justify-center px-4 pb-6">
        <div className="w-full max-w-xl mx-auto flex items-center gap-2 bg-gray-800 p-3 rounded-full">
          <input
            type="text"
            placeholder="Tanya apa saja..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent outline-none text-white px-2"
            onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
          />
          <button
            onClick={sendPrompt}
            disabled={loading}
            className="bg-white-500 hover:bg-white-600 disabled:opacity-50 p-2 rounded-full"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
