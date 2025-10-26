import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/next";
export default function Home() {
  return (
    <main className="min-h-screen">
      <Analytics />
      <Hero />
      <Sidebar />
    </main>
  );
}
