"use client";

import Image from "next/image";
import { ChipotleLocation } from "@/lib/mockData";

interface LocationCardProps {
  location: ChipotleLocation;
  distance: number;
  rank: number;
  isCheapest: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export default function LocationCard({
  location,
  distance,
  rank,
  isCheapest,
  isSelected,
  onClick,
}: LocationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex gap-0 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 border-2 focus:outline-none ${
        isSelected
          ? "border-[#441500] shadow-lg scale-[1.01]"
          : isCheapest
          ? "border-green-400 shadow-green-100"
          : "border-transparent hover:border-gray-200 hover:shadow-md"
      } bg-white`}
    >
      {/* Image */}
      <div className="relative w-28 shrink-0 self-stretch">
        <Image
          src={location.image}
          alt={location.name}
          fill
          className="object-cover"
          sizes="112px"
        />
        {/* Rank pill */}
        <div
          className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow ${
            isCheapest
              ? "bg-green-500 text-white"
              : "bg-white/90 text-gray-600"
          }`}
        >
          {rank}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate">
              {location.name}
            </h3>
            {isCheapest && (
              <span className="shrink-0 text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                ⭐ Cheapest
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{location.address}</p>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className={`text-2xl font-extrabold tracking-tight ${
                  isCheapest ? "text-green-600" : "text-gray-800"
                }`}
              >
                ${location.price.toFixed(2)}
              </span>
              {location.isLive && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
                  live
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-xs text-gray-400">pickup</span>
              {location.deliveryPrice && (
                <>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">
                    ${location.deliveryPrice.toFixed(2)} delivery
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-gray-600">
              {distance.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 ml-0.5">mi</span>
          </div>
        </div>
      </div>
    </button>
  );
}
