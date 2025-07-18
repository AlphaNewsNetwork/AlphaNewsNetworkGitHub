import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-white text-black"}>
      <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 bg-white dark:bg-black">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Alpha News Network</h1>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:underline">News</a>
          <a href="#" className="hover:underline">Trending</a>
          <a href="#" className="hover:underline">Pop Culture</a>
          <a href="#" className="hover:underline">LOL</a>
          <a href="#" className="hover:underline">Tech</a>
          <a href="#" className="hover:underline">More</a>
        </nav>
        <button
          className="text-sm border px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      <section className="relative w-full h-[60vh] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-3xl md:text-5xl font-black mb-4">BREAKING: 🚀 Gen Alpha Takes Over</h2>
          <p className="text-lg max-w-xl mx-auto">
            The future is now. TikTok trends, AI news, and cosmic vibes. Welcome to your new favorite feed.
          </p>
          <button className="mt-4 px-5 py-2 bg-yellow-400 text-black font-semibold rounded-full">Read More</button>
        </div>
      </section>

      <section className="bg-yellow-100 dark:bg-yellow-900 py-3 px-6 overflow-x-auto whitespace-nowrap text-sm font-semibold">
        <span className="mr-4">🔥 Trending Now:</span>
        <span className="mr-4">AI Pets Are a Thing Now</span>
        <span className="mr-4">SpongeBob Is Back (Again)</span>
        <span className="mr-4">Alpha Teens Hack NASA (Kinda)</span>
        <span className="mr-4">The Comet Fit is the Look</span>
      </section>

      <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((num, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform">
            <div className="w-full h-48 bg-gray-400 dark:bg-gray-700 flex items-center justify-center text-white text-xl">
              Image Placeholder
            </div>
            <div className="p-4">
              <span className="text-xs uppercase text-pink-600 dark:text-pink-300">Trending</span>
              <h3 className="mt-2 text-lg font-bold">Gen Alpha Reacts to the Latest TikTok Craze 😱</h3>
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                It’s got slime, sound effects, and a plot twist. Yep, it's viral.
              </p>
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-8 p-6 text-center text-xs text-gray-500 dark:text-gray-400">
        © 2025 Alpha News Network — Powered by Gen Alpha vibes 💫
      </footer>
    </div>
  );
}