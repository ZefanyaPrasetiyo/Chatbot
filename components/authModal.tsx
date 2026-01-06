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
      <Button className="transition-all duration-200 cursor-pointer rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white transition duration-300 font-bold text-md" onClick={() => setOpen(true)}>
        Login
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {mode === "login" ? (
              <ModalMasuk
                onSwitchToRegister={() => setMode("register")}
                close={closeModal}
              />
            ) : (
              <RegisterModal
                onSwitchToLogin={() => setMode("login")}
                close={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
