"use client";

import { useState } from "react";
import ModalMasuk from "./modalLogin";
import RegisterModal from "./modalRegister";
import { Button } from "./ui/button";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  
  const closeModal = () => setOpen(false);
  return (
    <>
      <Button className="bg-gray-800 font-bold" onClick={() => setOpen(true)}>Login</Button>

      {open && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-999"
    onClick={closeModal}
  >
    <div
      onClick={(e) => e.stopPropagation()}
    >
      {mode === "login" ? (
        <ModalMasuk onSwitchToRegister={() => setMode("register")} close={() => setOpen(false)} />
      ) : (
        <RegisterModal onSwitchToLogin={() => setMode("login")} close={() => setOpen(false)} />
      )}
    </div>
  </div>
)}
    </>
  );
}
