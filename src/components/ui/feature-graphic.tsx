import React from "react";
import { cn } from "@/lib/utils";

interface FeatureGraphicProps {
  type: "books" | "puzzle" | "medal";
  className?: string;
}

const FeatureGraphic = ({ type, className }: FeatureGraphicProps) => {
  const graphics = {
    books: (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Stack of Books */}
            <div className="absolute bottom-0 left-0 right-0 transform rotate-[-5deg]">
              <div className="h-16 bg-[#4CAF50] rounded-lg shadow-lg flex items-center justify-center">
                <div className="w-3/4 h-2 bg-white/30 rounded" />
              </div>
            </div>
            <div className="absolute bottom-4 left-2 right-2 transform rotate-[5deg]">
              <div className="h-16 bg-[#66BB6A] rounded-lg shadow-lg flex items-center justify-center">
                <div className="w-3/4 h-2 bg-white/30 rounded" />
              </div>
            </div>
            <div className="absolute bottom-8 left-4 right-4">
              <div className="h-16 bg-[#81C784] rounded-lg shadow-lg flex items-center justify-center">
                <div className="w-3/4 h-2 bg-white/30 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    puzzle: (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Puzzle Pieces */}
            <div className="absolute top-0 left-0 w-16 h-16">
              <div className="w-full h-full bg-[#FB8C00] rounded-lg transform rotate-12 shadow-lg" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16">
              <div className="w-full h-full bg-[#F57C00] rounded-lg transform -rotate-12 shadow-lg" />
            </div>
            <div className="absolute top-8 right-8 w-16 h-16">
              <div className="w-full h-full bg-[#EF6C00] rounded-lg transform rotate-45 shadow-lg" />
            </div>
          </div>
        </div>
      </div>
    ),
    medal: (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Medal Design */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-16 bg-[#9C27B0] rounded-t-full" />
            </div>
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 rounded-full bg-[#7B1FA2] shadow-lg flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#E1BEE7] flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#9C27B0] flex items-center justify-center text-white text-4xl font-bold">
                    1
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div
      className={cn(
        "w-32 h-32 rounded-full flex items-center justify-center",
        className,
      )}
    >
      {graphics[type]}
    </div>
  );
};

export default FeatureGraphic;
