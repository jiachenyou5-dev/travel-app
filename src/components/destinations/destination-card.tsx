import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/generated/prisma/client";
import { ArrowRight } from "@/components/ui/clay-icons";

interface DestinationCardProps {
  destination: Pick<Destination, "id" | "nameZh" | "province" | "country"> & {
    displayPhotos: { id: string; url: string; thumbnailUrl?: string | null }[];
  };
  index: number;
}

const colors = ["var(--clay-lavender)", "var(--clay-peach)", "var(--clay-ochre)", "var(--clay-teal)", "var(--clay-pink)", "var(--secondary)"];

export function DestinationCard({ destination, index }: DestinationCardProps) {
  const illustrationIndex = ["苏州", "昆明", "重庆"].indexOf(destination.nameZh);
  const photo = destination.displayPhotos[0];
  const dark = index % 6 === 3 || index % 6 === 4;
  return (
    <Link href={`/destinations/${destination.id}`} className={`group relative flex min-h-[380px] flex-col overflow-hidden rounded-xl p-7 transition-transform duration-200 hover:-translate-y-1 ${dark ? "text-white" : "text-[#0a0a0a]"}`} style={{ backgroundColor: colors[index % colors.length] }}>
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[30px] font-medium tracking-tight">{destination.nameZh}</h3>
          <p className="mt-1 text-sm opacity-80">{destination.province || destination.country}</p>
        </div>
        <ArrowRight className="mt-2 size-7 transition-transform group-hover:translate-x-1" />
      </div>
      {photo ? (
        <div className="relative mt-5 h-48 overflow-hidden rounded-lg">
          <Image src={photo.thumbnailUrl || photo.url} alt={`${destination.nameZh}旅行照片`} fill unoptimized sizes="(max-width: 768px) 90vw, 33vw" className="object-cover" />
        </div>
      ) : (
        <div role="img" aria-label="黏土旅行主题插画，非目的地实景" className="absolute inset-x-0 bottom-0 aspect-square bg-no-repeat" style={{ backgroundImage: `url('/images/clay/${illustrationIndex >= 0 ? "destinations" : "hero"}.png')`, backgroundSize: illustrationIndex >= 0 ? "300% 100%" : "100% auto", backgroundPosition: illustrationIndex >= 0 ? `${illustrationIndex * 50}% bottom` : "center bottom" }} />
      )}
    </Link>
  );
}
