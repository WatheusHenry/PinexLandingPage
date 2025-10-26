"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";

const images = [
  "/images/039d0998de5bba1c0b48d0bbdb51e5bc.jpg",
  "/images/0a9ca4f77d17f2899749cd39762392cd.jpg",
  "/images/24608e2f7f7585c2d901625d22228226.jpg",
  "/images/25f1f8c2a241d9413196237acbff01ef.jpg",
  "/images/40b88819628c2a96b93174d7d1235680.jpg",
  "/images/4845aec2150157e327f29ebe09825564.jpg",
  "/images/4fee54c490fc77f62ea34fdf5411c059.jpg",
  "/images/69eb7c8ae069e1d495eae50bfc088d27.jpg",
  "/images/8887c8444499e3d4f7468524e08dc1b5.jpg",
  "/images/ce2c0fdf2821a004d73165ca786e4ad1.jpg",
  "/images/d25d938e23e329c0d5ce02ef0ae557b7.jpg",
  "/images/ef1aaf5514e1aed292891ca47f98ab9a.jpg",
  "/images/f4baa46df0622ddfa6e8296b4d402382.jpg",
  "/images/f558950eb90866f13926d2817ace4b9b.jpg",
  "/images/fdc4067bdc291184d824cde2acfb9194.jpg",
  "/images/image1.jpg",
];

interface FloatingImageProps {
  src: string;
  side: "left" | "right";
  top: number;
  size: number;
  rotation: number;
}

function FloatingImages() {
  const [floatingImages, setFloatingImages] = useState<FloatingImageProps[]>(
    []
  );

  useEffect(() => {
    const positions: FloatingImageProps[] = [];

    // Embaralhar array de imagens para não repetir
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);
    const totalImages = 16;
    const leftImages = Math.ceil(totalImages / 2);
    const rightImages = Math.floor(totalImages / 2);

    let imageIndex = 0;

    // Criar imagens para o lado esquerdo (8 imagens)
    for (let i = 0; i < leftImages; i++) {
      positions.push({
        src: shuffledImages[imageIndex++],
        side: "left",
        top: i * 11 + 3 + Math.random() * 0,
        size: Math.floor(Math.random() * 40) + 200, // 120px a 160px
        rotation: Math.random() * 15 - 5,
      });
    }

    // Criar imagens para o lado direito (8 imagens)
    for (let i = 0; i < rightImages; i++) {
      positions.push({
        src: shuffledImages[imageIndex++],
        side: "right",
        top: i * 11 + 6 + Math.random() * 0,
        size: Math.floor(Math.random() * 40) + 200, // 120px a 160px
        rotation: Math.random() * 15 - 5,
      });
    }

    setFloatingImages(positions);
  }, []);

  return (
    <>
      {floatingImages.map((img, index) => (
        <div
          key={index}
          className="absolute cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", img.src);
            e.dataTransfer.setData("text/uri-list", img.src);
            e.dataTransfer.setData("image-url", img.src);
            e.dataTransfer.effectAllowed = "copy";
          }}
          style={{
            [img.side]: img.side === "left" ? "20%" : "20%",
            top: `${img.top}%`,
            transform: `rotate(${img.rotation}deg)`,
            width: `${img.size}px`,
            height: `${img.size}px`,
            zIndex: 1,
          }}
        >
          <img
            src={img.src}
            alt=""
            className="rounded-2xl shadow-lg object-cover w-full h-full pointer-events-none"
            draggable={false}
          />
        </div>
      ))}
    </>
  );
}

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Email cadastrado com sucesso! Olhe sua caixa de entrada");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Erro ao cadastrar email");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Erro ao processar requisição");
    }
  };

  return (
    <div className="relative flex justify-center h-screen bg-white px-4 py-8 overflow-hidden">
      {/* Imagens flutuantes de fundo */}
      <FloatingImages />

      {/* Texto "experimente!" com seta no canto superior direito */}
      <div className="absolute top-[17rem] right-20 z-10">
        <Image
          src="/experimente.png"
          alt="Experimente"
          width={180}
          height={180}
          className="w-32 h-32 md:w-44 md:h-44 object-contain"
        />
      </div>

      <div className="max-w-lg w-full mt-10 text-center">
        {/* Logo */}
        <div className="">
          <Image
            src="/logo.png"
            alt="ex Logo"
            width={200}
            height={200}
            className="w-40 h-30 mb-2 mx-auto object-contain"
            priority
          />
          <h1 className="text-xl  font-bold text-[#0B0B0B] mb-16">
            Salve o que te inspira.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-[10rem]">
          <div className="relative mb-6">
            <p className="text-md font-semibold  text-gray-700 mb-3">
              Insira seu email aqui para uma surpresa!
            </p>
            <Image
              src="/drawedArrow.png"
              alt="Seta"
              width={60}
              height={60}
              className="absolute -right-0 top-[-18px] w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          </div>

          <div className="flex  gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              disabled={status === "loading"}
              className="w-full px-5 py-2.5 text-sm rounded-xl bg-[#F6F6F6] text-gray-700 placeholder:text-gray-400 border-none focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-fit px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-black hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Enviando..." : "Salvar"}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm ${
                status === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
        <div className="absolute bottom-2 left-[44vw] text-gray-400">
          Algum Feedback ou sugestão?
          <br />
          Fale comigo!{" "}
          <a
            href="https://x.com/watheushenry"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700"
          >
            @watheushenry
          </a>
          <br />
        </div>
      </div>
    </div>
  );
}
