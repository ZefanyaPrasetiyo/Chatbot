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
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import GradientText from "@/components/GradientText";

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

  const sugesti = [
    "Apa itu Next.js dan kegunaannya?",
    "Bahlil Lahadalia adalah siapa?",
    "Fakultas Teknik UI itu ngapain sih ?",
    "Syarat masuk Fakultas Hukum UI?",
  ];

  const handleSugesti = async (text: string) => {
    setPrompt(text);
    sendPrompt();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {chats.length === 0 && (
        <h1 className="text-5xl font-bold text-center py-8">
          <GradientText className="text-5xl">VYOLET</GradientText>
        </h1>
      )}
      <div className="relative flex-1 overflow-y-auto px-4 pt-4">
        <div className="max-w-xl mx-auto space-y-4 pb-32">
          {chats.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {sugesti.map((item, i) => (
                <Card className="max-w-85">
                  <Card
                    isPressable
                    isHoverable
                    onPress={() => handleSugesti(item)}
                    className="border border-r-purple-500 border-l-fuchsia-600  border-t-purple-500 border-b-fuchsia-600 transition-all duration-200 cursor-pointer rounded-2xl hover:bg-gradient-to-r hover:from-purple-600/40 hover:to-fuchsia-600/40 transition duration-300"
                  >
                    <CardBody className="px-4 py-5 text-sm text-white">
                      <p className="leading-relaxed">{item}</p>
                    </CardBody>
                  </Card>
                </Card>
              ))}
            </div>
          )}
          {chats.map((chat, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-3 rounded-2xl w-fit ml-auto max-w-[70%]">
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {chat.pertanyaan}
                </p>
              </div>
              <div className="p-3 rounded-2xl w-fit mr-auto max-w-[85%] ">
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
        <div className="w-full max-w-xl mx-auto flex items-center gap-2 border border-purple-500 p-3 rounded-full">
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
            className="hover:bg-purple-900/80 p-2 rounded-full"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
