"use client";

import { useEffect, useState } from "react";

const images = [
  "/images/039d0998de5bba1c0b48d0bbdb51e5bc.jpg",
  "/images/24608e2f7f7585c2d901625d22228226.jpg",
  "/images/40b88819628c2a96b93174d7d1235680.jpg",
  "/images/4845aec2150157e327f29ebe09825564.jpg",
  "/images/4fee54c490fc77f62ea34fdf5411c059.jpg",
  "/images/8887c8444499e3d4f7468524e08dc1b5.jpg",
  "/images/ce2c0fdf2821a004d73165ca786e4ad1.jpg",
  "/images/d25d938e23e329c0d5ce02ef0ae557b7.jpg",
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

export default function FloatingImages() {
  const [floatingImages, setFloatingImages] = useState<FloatingImageProps[]>(
    []
  );

  useEffect(() => {
    // Gerar posições aleatórias para as imagens
    const generatePositions = () => {
      const positions: FloatingImageProps[] = [];
      const usedImages = new Set<string>();

      // Criar 8-12 imagens aleatórias
      const count = Math.floor(Math.random() * 5) + 8;

      for (let i = 0; i < count; i++) {
        // Selecionar imagem aleatória
        let randomImage;
        do {
          randomImage = images[Math.floor(Math.random() * images.length)];
        } while (
          usedImages.has(randomImage) &&
          usedImages.size < images.length
        );

        usedImages.add(randomImage);

        positions.push({
          src: randomImage,
          side: Math.random() > 0.5 ? "left" : "right",
          top: Math.random() * 80 + 10, // 10% a 90% da altura
          size: Math.floor(Math.random() * 100) + 120, // 120px a 220px
          rotation: Math.random() * 20 - 10, // -10deg a 10deg
        });
      }

      setFloatingImages(positions);
    };

    generatePositions();
  }, []);

  if (floatingImages.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {floatingImages.map((img, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            [img.side]: "4%",
            top: `${img.top}%`,
            transform: `rotate(${img.rotation}deg)`,
            width: `${img.size}px`,
            height: `${img.size}px`,
          }}
        >
          <img
            src={img.src}
            alt=""
            className="rounded-2xl shadow-lg object-cover w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
