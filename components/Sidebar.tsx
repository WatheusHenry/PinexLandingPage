"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuButtons = [
    { icon: "Note.svg", label: "Notas" },
    { icon: "ColorPicker.svg", label: "Seletor de cores" },
    { icon: "AddFromDevice.svg", label: "Adicionar do dispositivo" },
    { icon: "Clipboard.svg", label: "Área de transferência" },
    { icon: "Clean.svg", label: "Limpar" },
    { icon: "Arrowleft.svg", label: "Fechar sidebar", rotate: true },
  ];

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : "46px",
          right: isSidebarOpen ? "calc(280px + 2rem)" : "2rem",
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-[50vh] -translate-y-1/2 bg-[#1A1A1A] shadow-lg rounded-xl overflow-hidden z-[60]"
      >
        <div className="flex flex-col gap-3 p-3">
          <motion.button
            onClick={() => {
              if (!isMenuOpen && !isSidebarOpen) {
                setIsMenuOpen(true);
                setIsSidebarOpen(true);
              } else {
                // Fecha a sidebar primeiro, depois o menu
                setTimeout(() => setIsMenuOpen(false), 200);
                setIsSidebarOpen(false);
              }
            }}
            className="hover:bg-[#202020] rounded-lg p-0 transition-colors"
            aria-label={
              isSidebarOpen ? "Fechar sidebar e menu" : "Abrir menu e sidebar"
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                rotate: isMenuOpen ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={"ArrowLeft.svg"}
                width={22}
                height={22}
                alt="toggle menu"
              />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                {menuButtons.slice(0, -1).map((button, index) => (
                  <motion.button
                    key={button.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    aria-label={button.label}
                    className="hover:bg-[#202020] rounded-lg p-0 transition-colors"
                  >
                    <Image
                      src={button.icon}
                      width={22}
                      height={22}
                      alt={button.label}
                    />
                  </motion.button>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Sidebar */}
      <div
        className={`fixed h-[90vh] w-[280px] rounded-3xl top-12 right-3 bg-[#1A1A1A] shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Conteúdo da sidebar */}
        <div className="w-70 h-[90vh] overflow-y-auto p-6">
          {/* Botão de fechar */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="mb-4 hover:bg-[#202020] rounded-lg p-2 transition-colors"
            aria-label="Fechar sidebar"
          >
            <Image
              src={"ArrowLeft.svg"}
              width={22}
              height={22}
              alt="Fechar"
              className="rotate-180"
            />
          </button>

          {/* Separador */}
          <div className="border-t border-[#2A2A2A] my-6"></div>

          {/* Conteúdo adicional */}
          <div className="space-y-4">
            <div className="p-4 bg-[#252525] rounded-lg">
              <h3 className="font-medium text-white mb-2">Item 1</h3>
              <p className="text-sm text-gray-400">Conteúdo do primeiro item</p>
            </div>

            <div className="p-4 bg-[#252525] rounded-lg">
              <h3 className="font-medium text-white mb-2">Item 2</h3>
              <p className="text-sm text-gray-400">Conteúdo do segundo item</p>
            </div>

            <div className="p-4 bg-[#252525] rounded-lg">
              <h3 className="font-medium text-white mb-2">Item 3</h3>
              <p className="text-sm text-gray-400">Conteúdo do terceiro item</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
