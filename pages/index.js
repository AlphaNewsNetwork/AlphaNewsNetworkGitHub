import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getStories, getVideos } from "../lib/contentful";

export async function getStaticProps() {
  const stories = await getStories();
  const videos = await getVideos();
  return {
    props: {
      stories,
      videos,
    },
    revalidate: 60,
  };
}

// VideoCard component for interactive thumbnail → video embed
function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const { sys, fields } = video;
  const videoId = fields.videoId;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div
      key={sys.id}
      className="w-full rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900 cursor-pointer"
      onClick={() => setPlaying(true)}
    >
      {playing ? (
        <iframe
          className="w-full aspect-video"
          src={embedUrl}
          title={fields.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <img
          src={thumbnailUrl}
          alt={`${fields.title} thumbnail`}
          className="w-full object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {fields.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mt-2">{fields.description}</p>
      </div>
    </div>
  );
}

export default function Home({ stories, videos }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-white text-black"}>
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 bg-white dark:bg-black">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Alpha News Network Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-extrabold tracking-tight">
            Alpha News Network
          </h1>
        </div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:underline">
            News
          </a>
          <a href="#" className="hover:underline">
            Trending
          </a>
          <a href="#" className="hover:underline">
            Pop Culture
          </a>
          <a href="#" className="hover:underline">
            LOL
          </a>
          <a href="#" className="hover:underline">
            Tech
          </a>
          <a href="#" className="hover:underline">
            More
          </a>
        </nav>
        <button
          className="text-sm border px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[60vh] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <Image
          src="/hero-placeholder.jpg"
          alt="Top story hero image"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          priority
        />
        <div className="absolute z-10 text-center px-4 text-white">
          <h2 className="text-3xl md:text-5xl font-black mb-4 drop-shadow">
            BREAKING: 🚀 Gen Alpha Takes Over
          </h2>
          <p className="text-lg max-w-xl mx-auto drop-shadow">
            The future is now. TikTok trends, AI news, and cosmic vibes.
            Welcome to your new favorite feed.
          </p>
          <button className="mt-4 px-5 py-2 bg-yellow-400 text-black font-semibold rounded-full">
            Read More
          </button>
        </div>
      </section>

      {/* Trending Bar */}
      <section className="bg-yellow-100 dark:bg-yellow-900 py-3 px-6 overflow-x-auto whitespace-nowrap text-sm font-semibold">
        <span className="mr-4">🔥 Trending Now:</span>
        <span className="mr-4">AI Pets Are a Thing Now</span>
        <span className="mr-4">SpongeBob Is Back (Again)</span>
        <span className="mr-4">Alpha Teens Hack N
