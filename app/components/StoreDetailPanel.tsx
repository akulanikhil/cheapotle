"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { PROTEINS, PROTEIN_LABELS, PROTEIN_IMAGES, type Protein } from "@/lib/proteins";
import { FOOD_IMAGES } from "@/lib/images";
import type { StoreLocation } from "@/app/api/stores/route";
import type { PriceData } from "@/app/api/price/[storeId]/route";

interface StoreDetailPanelProps {
  store: StoreLocation | null;
  allPrices: Record<string, PriceData>;
  loadingKeys: Set<string>;
  selectedProtein: Protein;
  distance: number;
  onClose: () => void;
  onProteinSelect: (p: Protein) => void;
}

function ProteinTile({
  protein,
  price,
  isLoading,
  isSelected,
  isBestValue,
  onClick,
}: {
  protein: Protein;
  price: PriceData | undefined;
  isLoading: boolean;
  isSelected: boolean;
  isBestValue: boolean;
  onClick: () => void;
}) {
  const [imgSrc, setImgSrc] = useState(PROTEIN_IMAGES[protein]);

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all hover:shadow-md cursor-pointer text-center ${
        isSelected
          ? "border-[#c41230] bg-[#fff5f7] shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {isBestValue && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
          Best Value
        </span>
      )}

      {/* Protein image */}
      <div className="relative w-16 h-16">
        <Image
          src={imgSrc}
          alt={PROTEIN_LABELS[protein]}
          fill
          className="object-contain"
          sizes="64px"
          onError={() => setImgSrc(FOOD_IMAGES.default)}
        />
      </div>

      <span
        className="text-xs font-bold text-gray-800 leading-tight uppercase tracking-wider"
        style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.75rem" }}
      >
        {PROTEIN_LABELS[protein]}
      </span>

      {isLoading ? (
        <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
      ) : price?.isLive ? (
        <span className={`text-sm font-black tracking-tight ${isSelected ? "text-[#c41230]" : "text-gray-800"}`}>
          ${price.price.toFixed(2)}
        </span>
      ) : (
        <span className="text-xs text-gray-400">—</span>
      )}
    </button>
  );
}

export default function StoreDetailPanel({
  store,
  allPrices,
  loadingKeys,
  selectedProtein,
  distance,
  onClose,
  onProteinSelect,
}: StoreDetailPanelProps) {
  const [storeImgSrc, setStoreImgSrc] = useState(store?.image ?? FOOD_IMAGES.default);

  // Keep storeImgSrc in sync when store changes
  const imgSrc = store ? storeImgSrc : FOOD_IMAGES.default;

  // Sort proteins by price (loaded ones first, then unloaded)
  const sortedProteins = useMemo(() => {
    if (!store) return [...PROTEINS];
    return [...PROTEINS].sort((a, b) => {
      const pa = allPrices[`${store.id}-${a}`]?.price ?? Infinity;
      const pb = allPrices[`${store.id}-${b}`]?.price ?? Infinity;
      return pa - pb;
    });
  }, [store, allPrices]);

  const bestValueProtein = useMemo(() => {
    if (!store) return null;
    const loaded = PROTEINS.filter(p => allPrices[`${store.id}-${p}`]?.isLive);
    if (!loaded.length) return null;
    return loaded.reduce((best, p) =>
      allPrices[`${store.id}-${p}`].price < allPrices[`${store.id}-${best}`].price ? p : best,
      loaded[0]
    );
  }, [store, allPrices]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          store ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out max-h-[72vh] flex flex-col ${
          store ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-4 pb-6">
          {store && (
            <>
              {/* Store header */}
              <div className="flex items-center gap-3 py-3 border-b border-gray-100 mb-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <Image
                    src={imgSrc}
                    alt={store.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                    onError={() => setStoreImgSrc(FOOD_IMAGES.default)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-gray-900 text-sm leading-snug tracking-tight">{store.name}</h3>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#c41230] font-medium mt-0.5 truncate transition-colors group"
                  >
                    <svg className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{store.address}</span>
                  </a>
                  <p className="text-xs text-gray-500 mt-0.5 font-semibold">{distance.toFixed(1)} mi away</p>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Section label */}
              <p
                className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
                style={{ fontFamily: "var(--font-barlow-condensed)" }}
              >
                Bowl Prices
              </p>

              {/* Protein grid */}
              <div className="grid grid-cols-3 gap-3">
                {sortedProteins.map((protein) => {
                  const key = `${store.id}-${protein}`;
                  return (
                    <ProteinTile
                      key={protein}
                      protein={protein}
                      price={allPrices[key]}
                      isLoading={loadingKeys.has(key)}
                      isSelected={protein === selectedProtein}
                      isBestValue={protein === bestValueProtein}
                      onClick={() => onProteinSelect(protein)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
