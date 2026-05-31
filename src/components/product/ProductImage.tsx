'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  Gamepad2,
  Headphones,
  Monitor,
  MonitorSmartphone,
  Network,
  Radio,
  Sparkles,
  Watch,
} from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  category: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

const categoryStyles: Record<string, { icon: typeof Headphones; label: string; glow: string }> = {
  Headphones: {
    icon: Headphones,
    label: 'Audio',
    glow: 'from-amber-300/30 via-cyan-300/10 to-slate-950',
  },
  'Smart Speakers': {
    icon: Radio,
    label: 'Sound',
    glow: 'from-emerald-300/25 via-amber-300/10 to-slate-950',
  },
  'Luxury Smartphones': {
    icon: MonitorSmartphone,
    label: 'Mobile',
    glow: 'from-cyan-300/25 via-amber-300/10 to-slate-950',
  },
  'Tech Accessories': {
    icon: Watch,
    label: 'Gear',
    glow: 'from-indigo-300/25 via-amber-300/10 to-slate-950',
  },
  Computing: {
    icon: Monitor,
    label: 'Desk',
    glow: 'from-cyan-300/25 via-amber-300/10 to-slate-950',
  },
  Wearables: {
    icon: Watch,
    label: 'Wear',
    glow: 'from-emerald-300/25 via-amber-300/10 to-slate-950',
  },
  Accessories: {
    icon: Sparkles,
    label: 'Kit',
    glow: 'from-indigo-300/25 via-amber-300/10 to-slate-950',
  },
  Cameras: {
    icon: Camera,
    label: 'Lens',
    glow: 'from-rose-300/25 via-amber-300/10 to-slate-950',
  },
  Gaming: {
    icon: Gamepad2,
    label: 'Play',
    glow: 'from-violet-300/25 via-cyan-300/10 to-slate-950',
  },
  Networking: {
    icon: Network,
    label: 'Mesh',
    glow: 'from-sky-300/25 via-amber-300/10 to-slate-950',
  },
  'Home Cinema': {
    icon: Monitor,
    label: 'Cinema',
    glow: 'from-amber-300/25 via-rose-300/10 to-slate-950',
  },
  'Limited Edition Audio': {
    icon: Sparkles,
    label: 'Limited',
    glow: 'from-amber-200/35 via-rose-300/10 to-slate-950',
  },
};

export default function ProductImage({
  src,
  alt,
  category,
  className = '',
  loading = 'lazy',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const style = categoryStyles[category] ?? categoryStyles['Tech Accessories'];
  const Icon = style.icon;

  if (!src || hasError) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${style.glow} ${className}`}
        aria-label={alt}
        role="img"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_34%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-4/5 -translate-x-1/2 rounded-t-full bg-black/20 blur-2xl" />
        <div className="relative grid h-24 w-24 place-items-center rounded-2xl border border-white/15 bg-white/10 text-amber-200 shadow-2xl shadow-amber-950/30 backdrop-blur">
          <Icon size={42} strokeWidth={1.5} />
        </div>
        <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-slate-200">
          {style.label}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        loading={loading}
        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        onError={() => setHasError(true)}
        className="object-cover"
      />
    </div>
  );
}
