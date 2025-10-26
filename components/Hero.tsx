"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";

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
        setMessage("Email cadastrado com sucesso!");
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
    <div className="relative flex justify-center min-h-screen bg-white px-4 py-8">
      {/* Texto "experimente!" com seta no canto superior direito */}
      <div className="absolute top-[17rem] right-20 ">
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
      </div>
    </div>
  );
}
