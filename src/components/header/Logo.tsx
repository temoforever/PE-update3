import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg md:text-2xl font-bold text-white">PE</span>
        <img
          src="https://i.imgur.com/fcLmxsY.png"
          alt="PE Community Logo"
          className="h-8 w-8 md:h-10 md:w-10 object-contain"
        />
        <span className="text-lg md:text-2xl font-bold text-white hidden md:inline">
          COMMUNITY
        </span>
      </div>
    </Link>
  );
};

export default Logo;
