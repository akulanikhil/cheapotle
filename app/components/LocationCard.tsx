"use client";

import Image from "next/image";
import { useState } from "react";
import { StoreLocation } from "@/app/api/stores/route";
import { PriceData } from "@/app/api/price/[storeId]/route";
import { FOOD_IMAGES } from "@/lib/images";

interface LocationCardProps {
  store: StoreLocation;
  price: PriceData | undefined;
  priceLoading: boolean;
  distance: number;
  rank: number;
  isCheapest: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: () => void;
  onHoverEnd: () => void;
}

export default function LocationCard({
  store,
  price,
  priceLoading,
  distance,
  rank,
  isCheapest,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onHoverEnd,
}: LocationCardProps) {
  const [imgSrc, setImgSrc] = useState(store.image);

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
      className={`w-full text-left flex gap-0 rounded-2xl overflow-hidden shadow-sm transition-all duration-200 border-2 focus:outline-none ${
        isSelected
          ? "border-[#441500] shadow-lg scale-[1.01]"
          : isHovered
          ? "border-[#441500]/40 shadow-md scale-[1.005]"
          : isCheapest
          ? "border-green-400 shadow-green-100"
          : "border-transparent hover:border-gray-200 hover:shadow-md"
      } bg-white`}
    >
      {/* Image */}
      <div className="relative w-28 shrink-0 self-stretch bg-gray-100">
        <Image
          src={imgSrc}
          alt={store.name}
          fill
          className="object-cover"
          sizes="112px"
          onError={() => setImgSrc(FOOD_IMAGES.default)}
        />
        {/* Rank badge */}
        <div
          className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow ${
            isCheapest ? "bg-green-500 text-white" : "bg-white/90 text-gray-600"
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
              {store.name}
            </h3>
            {isCheapest && price && (
              <span className="shrink-0 text-xs font-bold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                ⭐ Cheapest
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{store.address}</p>
        </div>

        <div className="flex items-end justify-between mt-2">
          {/* Price */}
          <div>
            {priceLoading || !price ? (
              <div className="flex items-center gap-2">
                <div className="h-7 w-16 bg-gray-100 rounded animate-pulse" />
                <span className="text-xs text-gray-400">Loading price…</span>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span
                    className={`text-2xl font-extrabold tracking-tight ${
                      isCheapest ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    ${price.price.toFixed(2)}
                  </span>
                  {price.isLive && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
                      live
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs text-gray-400">pickup</span>
                  {price.deliveryPrice > 0 && (
                    <>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        ${price.deliveryPrice.toFixed(2)} delivery
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Distance */}
          <div className="text-right shrink-0">
            <span className="text-sm font-medium text-gray-600">{distance.toFixed(1)}</span>
            <span className="text-xs text-gray-400 ml-0.5">mi</span>
          </div>
        </div>
      </div>
    </button>
  );
}
