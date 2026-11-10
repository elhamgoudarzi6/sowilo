
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  FiVolume2,
  FiVolumeX,
  FiPause,
  FiPlay,
} from "react-icons/fi";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  return (
    <section className="
      relative isolate
      h-svh min-h-162.5 max-h-275
      w-full overflow-hidden
      bg-(--color-background)
      text-(--color-text)
    ">

      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="/images/4.mp4"
          poster="/images/10.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="h-full w-full object-cover"
        />

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-(--color-overlay)/30" />

        {/* Gradient Overlay */}
        <div className="
          absolute inset-0
          bg-linear-to-t
          from-(--color-overlay)/80
          via-transparent
          to-(--color-overlay)/35
        " />
      </div>

      {/* Center Content */}
      <div className="
        relative z-10
        flex h-full flex-col
        items-center justify-center
        px-5 text-center
      ">

        <h1 className="
          text-(--color-text)
    text-[clamp(4rem,12vw,10rem)]
          font-black leading-none
          tracking-[-0.08em]
        ">
          sowilo<span className="text-(--color-primary)">.</span>
        </h1>

        <p className="
          mt-4
          text-(--color-text)/80
          text-[9px] sm:text-[11px]
          font-medium uppercase
          tracking-[0.42em]
        ">
          Creative Without Limits
        </p>

        <Link
          href="/work"
          className="
    group mt-10
    inline-flex items-center justify-center
    gap-3 p-4
    border border-(--color-border-light)/40
    text-(--color-text)
    text-[10px] font-semibold uppercase
    tracking-[0.22em]
    transition-all duration-300
    hover:border-(--color-primary)
    hover:bg-(--color-primary)
    hover:text-(--color-accent)
  "
        >
          Discover Our Work
        </Link>
      </div>

      {/* Bottom Bar */}
      <div className="
        absolute bottom-7
        left-6 right-6 z-10
        flex items-end justify-between
        sm:bottom-9 sm:left-10 sm:right-10
        lg:left-16 lg:right-16
      ">

        {/* Video Controls */}
        <div className="flex items-center gap-2">

          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            aria-pressed={!isPlaying}
            className="
              flex h-9 w-9
              items-center justify-center
           
              border border-(--color-border-light)/20
              text-(--color-text)
              transition-all duration-300
              hover:border-(--color-primary)
              hover:bg-(--color-primary)
              hover:text-(--color-accent)
            "
          >
            {isPlaying ? (
              <FiPause className="h-3.5 w-3.5" />
            ) : (
              <FiPlay className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Mute / Unmute */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            aria-pressed={!isMuted}
            className="
              flex h-9 w-9
              items-center justify-center
          
              border border-(--color-border-light)/20
              text-(--color-text)
              transition-all duration-300
              hover:border-(--color-primary)
              hover:bg-(--color-primary)
              hover:text-(--color-accent)
            "
          >
            {isMuted ? (
              <FiVolumeX className="h-3.5 w-3.5" />
            ) : (
              <FiVolume2 className="h-3.5 w-3.5" />
            )}
          </button>

        </div>
      </div>
    </section>
  );
};

export default Hero;
