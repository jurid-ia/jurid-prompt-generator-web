import { cn } from "@/lib/utils/cn";
import { ExternalLink, Image, Play, X } from "lucide-react";
import { useState } from "react";

interface AdBannerProps {
  id: string;
  title?: string;
  description?: string;
  ctaText?: string;
  variant?: "inline" | "top" | "fullwidth" | "video" | "hero" | "twin";
  ratio?: string;
  label?: string;
  className?: string;
  videoSrc?: string;
  videoPoster?: string;
  imageSrc?: string;
}

export default function AdBanner({
  id,
  title = "Espaço para anúncio",
  description = "Banner publicitário — placeholder",
  ctaText = "Saiba mais",
  variant = "inline",
  ratio,
  label,
  className,
  videoSrc,
  videoPoster,
  imageSrc,
}: AdBannerProps) {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem(`ad-dismissed-${id}`) === "true";
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(`ad-dismissed-${id}`, "true");
    setDismissed(true);
  };

  // Top promotional strip
  if (variant === "top") {
    return (
      <div
        className={cn(
          "relative bg-gradient-to-r from-brand-primary-dark to-brand-blue text-white px-4 py-3 flex items-center justify-center gap-3",
          className,
        )}
      >
        <p className="text-xs sm:text-sm font-medium">{title}</p>
        <button className="text-xs bg-brand-primary-light text-brand-black px-3 py-1 rounded-full font-semibold hover:bg-brand-primary-accent transition-colors shrink-0 cursor-pointer">
          {ctaText}
        </button>
        <button
          onClick={handleDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  // Video banner — real player when videoSrc is provided, placeholder otherwise
  if (variant === "video") {
    if (videoSrc) {
      return (
        <div
          data-banner-id={id}
          className={cn("block", className)}
        >
          <div
            className={cn(
              "relative rounded-2xl overflow-hidden bg-black",
              ratio || "aspect-video",
            )}
          >
            <video
              src={videoSrc}
              poster={videoPoster}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      );
    }

    return (
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        data-banner-id={id}
        className={cn(
          "block cursor-pointer active:scale-[0.98] transition-transform group",
          className,
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary-dark to-brand-blue",
            ratio || "aspect-video",
          )}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play size={28} className="text-white ml-1" />
            </div>
            <span className="text-xs text-white/60 font-medium">
              {label || "Vídeo placeholder"}
            </span>
          </div>
          <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors" />
        </div>
      </a>
    );
  }

  // Hero / large image placeholder
  if (variant === "hero") {
    return (
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        data-banner-id={id}
        className={cn(
          "block cursor-pointer active:scale-[0.98] transition-transform group",
          className,
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden",
            !imageSrc &&
              "border-2 border-dashed border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-brand-blue/5",
            ratio || "aspect-[3/1] sm:aspect-[4/1]",
          )}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={label || ""}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
              <Image size={32} className="text-brand-gray-400/50" />
              <span className="text-[11px] text-brand-gray-400 font-medium text-center">
                {label || "BANNER — 1200x400"}
              </span>
              <div className="flex items-center gap-1 text-[9px] text-brand-gray-400/80">
                <ExternalLink size={10} /> URL externa
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors" />
        </div>
      </a>
    );
  }

  // Twin side-by-side banners
  if (variant === "twin") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-3", className)}>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          data-banner-id={`${id}-left`}
          className="block cursor-pointer active:scale-[0.98] transition-transform group"
        >
          <div className="relative rounded-2xl border-2 border-dashed border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-brand-blue/5 overflow-hidden aspect-[1.8/1]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Image size={24} className="text-brand-gray-400/50" />
              <span className="text-[10px] text-brand-gray-400 font-medium">
                BANNER A — 600x340
              </span>
            </div>
            <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors" />
          </div>
        </a>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          data-banner-id={`${id}-right`}
          className="block cursor-pointer active:scale-[0.98] transition-transform group"
        >
          <div className="relative rounded-2xl border-2 border-dashed border-brand-primary/20 bg-gradient-to-br from-brand-blue/5 to-brand-primary/5 overflow-hidden aspect-[1.8/1]">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Image size={24} className="text-brand-gray-400/50" />
              <span className="text-[10px] text-brand-gray-400 font-medium">
                BANNER B — 600x340
              </span>
            </div>
            <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/5 transition-colors" />
          </div>
        </a>
      </div>
    );
  }

  // Default inline ad
  return (
    <div
      className={cn(
        "relative glass-primary rounded-2xl p-4 sm:p-5 overflow-hidden",
        variant === "fullwidth" && "rounded-none sm:rounded-2xl",
        className,
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 hover:bg-brand-black/10 rounded-full transition-colors cursor-pointer z-10"
      >
        <X size={14} className="text-brand-gray-600" />
      </button>

      <div className="flex items-center gap-4">
        {imageSrc ? (
          <div className="hidden sm:flex w-16 h-16 rounded-xl bg-brand-primary-dark items-center justify-center shrink-0 overflow-hidden">
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-contain p-2"
            />
          </div>
        ) : (
          <div className="hidden sm:flex w-16 h-16 rounded-xl bg-brand-primary/20 border-2 border-dashed border-brand-primary-dark/20 items-center justify-center shrink-0">
            <span className="text-xs text-brand-primary-dark font-medium text-center leading-tight">
              AD
              <br />
              IMG
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black truncate">
            {title}
          </p>
          <p className="text-xs text-brand-gray-600 mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs bg-brand-primary-dark text-white px-3 py-2 rounded-xl font-medium hover:bg-brand-primary-dark/90 transition-colors shrink-0 cursor-pointer active:scale-95">
          {ctaText} <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}
