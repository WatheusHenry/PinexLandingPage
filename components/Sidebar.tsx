"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

interface SavedItem {
  id: string;
  type: "image" | "text" | "color";
  content: string;
  name: string;
  timestamp: number;
}

interface FloatingImage {
  id: string;
  content: string;
  name: string;
  x: number;
  y: number;
  isMinimized: boolean;
}

export default function Sidebar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const [copiedColorId, setCopiedColorId] = useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const clickStartPos = useRef<{ x: number; y: number } | null>(null);

  // Carregar itens salvos do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("savedItems");
    if (stored) {
      setSavedItems(JSON.parse(stored));
    }
  }, []);

  // Handler para colar imagens e textos
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isSidebarOpen) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      let hasImage = false;

      // Verificar se tem imagem
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          hasImage = true;
          const file = item.getAsFile();
          if (file) {
            processImageFile(file);
          }
        }
      }

      // Se não tem imagem, pegar texto
      if (!hasImage) {
        const text = e.clipboardData?.getData("text");
        if (text && text.trim()) {
          addTextItem(text.trim());
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [isSidebarOpen, savedItems]);

  // Salvar itens no localStorage
  const saveToLocalStorage = (items: SavedItem[]) => {
    localStorage.setItem("savedItems", JSON.stringify(items));
  };

  // Reordenar itens
  const handleReorder = (newOrder: SavedItem[]) => {
    setSavedItems(newOrder);
    saveToLocalStorage(newOrder);
  };

  // Adicionar texto
  const addTextItem = (text: string) => {
    setIsAdding(true);

    const newItem: SavedItem = {
      id: Date.now().toString(),
      type: "text",
      content: text,
      name: text.substring(0, 30) + (text.length > 30 ? "..." : ""),
      timestamp: Date.now(),
    };

    setTimeout(() => {
      const updatedItems = [...savedItems, newItem];
      setSavedItems(updatedItems);
      saveToLocalStorage(updatedItems);
      setIsAdding(false);

      // Scroll suave para o final
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 150);
    }, 100);
  };

  // Processar arquivo de imagem
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, adicione apenas arquivos de imagem");
      return;
    }

    setIsAdding(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const newItem: SavedItem = {
        id: Date.now().toString(),
        type: "image",
        content: e.target?.result as string,
        name: file.name,
        timestamp: Date.now(),
      };

      setTimeout(() => {
        const updatedItems = [...savedItems, newItem];
        setSavedItems(updatedItems);
        saveToLocalStorage(updatedItems);
        setIsAdding(false);

        // Scroll suave para o final
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
              top: scrollContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 150);
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  // Handlers de drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Verificar se tem arquivos
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      files.forEach((file) => processImageFile(file));
      return;
    }

    // Verificar se tem URL de imagem (arrastada da página)
    const imageUrl = e.dataTransfer.getData("text/uri-list");
    if (imageUrl && imageUrl.startsWith("/images/")) {
      // Converter URL da imagem para blob e depois para file
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const fileName = imageUrl.split("/").pop() || "image.jpg";
        const file = new File([blob], fileName, { type: blob.type });
        processImageFile(file);
        return;
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
      }
    }

    // Se não tem arquivos, verificar se tem texto
    const text = e.dataTransfer.getData("text");
    if (text && text.trim()) {
      addTextItem(text.trim());
    }
  };

  // Handler para input de arquivo
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => processImageFile(file));
  };

  // Deletar item
  const deleteItem = (id: string) => {
    const updatedItems = savedItems.filter((item) => item.id !== id);
    setSavedItems(updatedItems);
    saveToLocalStorage(updatedItems);
  };

  // Abrir imagem como modal flutuante
  const openFloatingImage = (item: SavedItem) => {
    if (item.type !== "image") return;

    const newFloatingImage: FloatingImage = {
      id: `floating-${Date.now()}`,
      content: item.content,
      name: item.name,
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 200,
      isMinimized: false,
    };

    setFloatingImages([...floatingImages, newFloatingImage]);
  };

  // Minimizar/Maximizar imagem flutuante
  const toggleMinimizeImage = (id: string) => {
    setFloatingImages(
      floatingImages.map((img) =>
        img.id === id ? { ...img, isMinimized: !img.isMinimized } : img
      )
    );
  };

  // Fechar imagem flutuante
  const closeFloatingImage = (id: string) => {
    setFloatingImages(floatingImages.filter((img) => img.id !== id));
  };

  // Registrar posição inicial do clique
  const handlePointerDown = (e: React.PointerEvent) => {
    // Não registrar se clicar em botões
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    clickStartPos.current = { x: e.clientX, y: e.clientY };
  };

  // Verificar se foi um clique ou drag
  const handleClick = (item: SavedItem, e: React.MouseEvent) => {
    // Não abrir se clicar em botões
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    // Verificar se houve movimento (drag)
    if (clickStartPos.current) {
      const deltaX = Math.abs(e.clientX - clickStartPos.current.x);
      const deltaY = Math.abs(e.clientY - clickStartPos.current.y);

      // Se moveu menos de 5px, considera como clique
      if (deltaX < 5 && deltaY < 5) {
        if (item.type === "image") {
          openFloatingImage(item);
        } else if (item.type === "color") {
          copyColorToClipboard(item.content, item.id);
        }
      }
    }

    clickStartPos.current = null;
  };

  // Limpar todos os itens
  const clearAllItems = () => {
    setSavedItems([]);
    localStorage.removeItem("savedItems");
  };

  // Adicionar cor
  const addColorItem = (color: string) => {
    setIsAdding(true);

    const newItem: SavedItem = {
      id: Date.now().toString(),
      type: "color",
      content: color,
      name: color.toUpperCase(),
      timestamp: Date.now(),
    };

    setTimeout(() => {
      const updatedItems = [...savedItems, newItem];
      setSavedItems(updatedItems);
      saveToLocalStorage(updatedItems);
      setIsAdding(false);

      // Scroll suave para o final
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 150);
    }, 100);
  };

  // Abrir eyedropper para selecionar cor da tela
  const openEyeDropper = async () => {
    // Verificar se o navegador suporta EyeDropper API
    if (!("EyeDropper" in window)) {
      alert(
        "Seu navegador não suporta o seletor de cores da tela. Use Chrome, Edge ou Opera."
      );
      return;
    }

    try {
      // @ts-ignore - EyeDropper API ainda não está nos tipos do TypeScript
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      addColorItem(result.sRGBHex);
    } catch (error) {
      // Usuário cancelou ou ocorreu um erro
      console.log("Seleção de cor cancelada");
    }
  };

  // Copiar cor para clipboard
  const copyColorToClipboard = (color: string, itemId: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColorId(itemId);
    setTimeout(() => {
      setCopiedColorId(null);
    }, 2000);
  };

  // Colar da área de transferência
  const pasteFromClipboard = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();

      for (const clipboardItem of clipboardItems) {
        // Verificar se tem imagem
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], "clipboard-image.png", {
              type: blob.type,
            });
            processImageFile(file);
            return;
          }
        }
      }

      // Se não tem imagem, tentar pegar texto
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        addTextItem(text.trim());
      }
    } catch (err) {
      // Fallback: tentar apenas texto se não tiver permissão para clipboard
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          addTextItem(text.trim());
        }
      } catch (error) {
        alert(
          "Não foi possível acessar a área de transferência. Use Ctrl+V para colar."
        );
      }
    }
  };

  // Salvar nota do modal
  const saveNote = () => {
    if (noteText.trim()) {
      addTextItem(noteText.trim());
      setNoteText("");
      setIsNoteModalOpen(false);
    }
  };

  const menuButtons = [
    {
      icon: "Note.svg",
      label: "Notas",
      onClick: () => setIsNoteModalOpen(true),
    },
    {
      icon: "ColorPicker.svg",
      label: "Seletor de cores",
      onClick: openEyeDropper,
    },
    {
      icon: "AddFromDevice.svg",
      label: "Adicionar do dispositivo",
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: "Clipboard.svg",
      label: "Área de transferência",
      onClick: pasteFromClipboard,
    },
    { icon: "Clean.svg", label: "Limpar", onClick: clearAllItems },
    { icon: "Arrowleft.svg", label: "Fechar sidebar", rotate: true },
  ];

  return (
    <>
      <motion.div
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : "46px",
          right: isSidebarOpen ? "calc(17rem + 2rem)" : "2rem",
        }}
        transition={{
          height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          right: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            delay: isMenuOpen ? 0 : 0.2,
          },
        }}
        className="fixed top-[50vh] -translate-y-1/2 bg-[#1A1A1A] shadow-lg rounded-xl overflow-hidden z-[60] select-none"
      >
        <div className="flex flex-col gap-3 p-3">
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
                    onClick={button.onClick}
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
          <motion.button
            onClick={() => {
              if (!isMenuOpen && !isSidebarOpen) {
                setIsMenuOpen(true);
                setIsSidebarOpen(true);
              } else {
                // Fecha o menu primeiro para evitar animação atravessando a tela
                setIsMenuOpen(false);
                setTimeout(() => setIsSidebarOpen(false), 100);
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
        </div>
      </motion.div>

      {/* Sidebar */}
      <div
        className={`fixed h-[90vh] w-[280px] rounded-3xl top-12 right-3 bg-[#1A1A1A] shadow-2xl z-50 transition-transform duration-300 ease-in-out select-none ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Input oculto para seleção de arquivos */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Conteúdo da sidebar com drag and drop invisível */}
        <div
          ref={scrollContainerRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full h-full overflow-y-auto p-4 transition-all duration-300 scrollbar-hide ${
            isDragging ? "bg-blue-500/5 scale-[0.98]" : ""
          } ${isAdding ? "bg-green-500/5" : ""}`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Indicador de carregamento */}

          {/* Lista de itens salvos */}
          {savedItems.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src="AddFromDevice.svg"
                width={48}
                height={48}
                alt="Adicionar conteúdo"
                className="mx-auto mb-4 opacity-30"
              />
              <p className="text-gray-500 text-sm">Nenhum item salvo ainda</p>
              <p className="text-gray-600 text-xs mt-2">
                Arraste imagens/textos, cole ou use o botão acima
              </p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={savedItems}
              onReorder={handleReorder}
              className="space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {savedItems.map((item) => (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                      mass: 0.8,
                    }}
                    whileDrag={{ scale: 1.05, zIndex: 10, rotate: 2 }}
                    className="relative group bg-[#252525] rounded-lg overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown}
                    onClick={(e) => handleClick(item, e)}
                  >
                    <motion.div
                      initial={{ filter: "blur(10px)" }}
                      animate={{ filter: "blur(0px)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.type === "image" ? (
                        <div className="cursor-pointer">
                          <img
                            src={item.content}
                            alt={item.name}
                            className="w-full object-contain pointer-events-none"
                          />
                        </div>
                      ) : item.type === "color" ? (
                        <motion.div
                          className="p-4 flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyColorToClipboard(item.content, item.id);
                          }}
                          animate={{
                            backgroundColor:
                              copiedColorId === item.id
                                ? "rgba(34, 197, 94, 0.08)"
                                : "rgba(37, 37, 37, 1)",
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div
                            className="w-14 h-14 rounded-lg border border-gray-700/50 shadow-sm flex-shrink-0 pointer-events-none"
                            style={{ backgroundColor: item.content }}
                          />
                          <div className="flex-1 pointer-events-none">
                            <p className="text-white text-base font-mono">
                              {item.content.toUpperCase()}
                            </p>
                            <motion.p
                              className="text-xs mt-1"
                              animate={{
                                color:
                                  copiedColorId === item.id
                                    ? "rgb(134, 239, 172)"
                                    : "rgb(107, 114, 128)",
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {copiedColorId === item.id
                                ? "Copiado"
                                : "Clique para copiar"}
                            </motion.p>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="p-4 pointer-events-none">
                          <p className="text-white text-sm whitespace-pre-wrap break-words">
                            {item.content}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            {new Date(item.timestamp).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      aria-label="Deletar item"
                    >
                      ×
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </div>
      </div>

      {/* Modal de Notas */}
      <AnimatePresence>
        {isNoteModalOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: "fixed",
              left: window.innerWidth / 2 - 200,
              top: window.innerHeight / 2 - 150,
              zIndex: 100,
            }}
            className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden cursor-move select-none w-[400px]"
          >
            <div className="relative">
              {/* Barra de título */}
              <div className="bg-[#252525] px-3 py-2 flex items-center justify-between cursor-move">
                <p className="text-white text-sm">Nova Nota</p>
                <div className="flex gap-1">
                  <button
                    onClick={saveNote}
                    disabled={!noteText.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Salvar"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setNoteText("");
                      setIsNoteModalOpen(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors text-xs"
                    aria-label="Fechar"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Digite sua nota aqui..."
                  className="w-full h-40 bg-[#252525] text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      saveNote();
                    }
                  }}
                />
                <p className="text-gray-500 text-xs mt-2 text-center">
                  Ctrl+Enter para salvar
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagens flutuantes */}
      <AnimatePresence>
        {floatingImages.map((floatingImg) => {
          const originalItem = savedItems.find(
            (item) => item.content === floatingImg.content
          );
          return (
            <motion.div
              key={floatingImg.id}
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                width: floatingImg.isMinimized ? "150px" : "auto",
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                position: "fixed",
                left: floatingImg.x,
                top: floatingImg.y,
                zIndex: 100,
              }}
              className="bg-[#1A1A1A] rounded-xl shadow-2xl overflow-hidden cursor-move select-none"
            >
              <div className="relative group">
                {/* Barra de título */}
                <div className="bg-[#252525] px-3 py-2 flex items-center justify-between cursor-move">
                  <p
                    className={`text-white text-sm truncate ${
                      floatingImg.isMinimized ? "max-w-[60px]" : "max-w-[300px]"
                    }`}
                  >
                    {floatingImg.name}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleMinimizeImage(floatingImg.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors text-xs"
                      aria-label="Minimizar/Maximizar"
                    >
                      {floatingImg.isMinimized ? "□" : "_"}
                    </button>
                    <button
                      onClick={() => closeFloatingImage(floatingImg.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors text-xs"
                      aria-label="Fechar"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Imagem */}
                {!floatingImg.isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 max-w-[500px] max-h-[500px] overflow-auto"
                  >
                    <img
                      src={floatingImg.content}
                      alt={floatingImg.name}
                      className="w-full h-auto object-contain"
                      draggable={false}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </>
  );
}
