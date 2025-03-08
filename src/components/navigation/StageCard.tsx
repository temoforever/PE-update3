import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StageCardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  icon?: "book" | "target" | "users";
  onClick?: () => void;
  className?: string;
  color?: string;
  buttonColor?: string;
  features?: string[];
}

const StageCard = ({
  title = "المرحلة التعليمية",
  description = "انقر لاستكشاف الموارد والأنشطة لهذا المستوى التعليمي",
  imageSrc,
  icon = "book",
  onClick = () => {},
  className = "",
  color,
  buttonColor,
  features,
}: StageCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("w-full max-w-[350px] cursor-pointer", className)}
      onClick={onClick}
    >
      <Card
        className={`h-full overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-xl static ${color || "bg-[#F8FAF5]"}`}
      >
        <div className="relative h-24 sm:h-32 md:h-48 overflow-hidden">
          <img
            src={
              imageSrc ||
              (() => {
                if (title?.includes("المرحلة الابتدائية")) {
                  return "https://i.imgur.com/sJbg6xJ.png";
                } else if (title?.includes("اللعب النشط")) {
                  return "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&auto=format&fit=crop";
                } else if (title?.includes("إدارة الجسم")) {
                  return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop";
                } else if (title?.includes("الحركة التعبيرية")) {
                  return "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&auto=format&fit=crop";
                } else if (title?.includes("مرحلة الطفولة")) {
                  return "https://i.imgur.com/ddVwLrc.png";
                } else if (title?.includes("الصفوف العليا")) {
                  return "https://i.imgur.com/yv5Ny0t.png";
                } else {
                  return "https://i.imgur.com/yv5Ny0t.png";
                }
              })()
            }
            alt={title}
            className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 transition-colors duration-300 mix-blend-multiply ${buttonColor || "bg-[#7C9D32]"} opacity-80`}
          />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 transform-gpu transition-all duration-300 hover:scale-110 hover:rotate-6">
            <img
              src={(() => {
                if (title?.includes("اللعب النشط")) {
                  return "https://api.iconify.design/fluent-emoji-flat/person-bouncing-ball.svg";
                } else if (title?.includes("إدارة الجسم")) {
                  return "https://api.iconify.design/fluent-emoji-flat/person-in-lotus-position.svg";
                } else if (title?.includes("الحركة التعبيرية")) {
                  return "https://api.iconify.design/fluent-emoji-flat/person-dancing.svg";
                } else if (title?.includes("مرحلة الطفولة")) {
                  return "https://api.iconify.design/fluent-emoji-flat/child.svg";
                } else if (title?.includes("الصفوف العليا")) {
                  return "https://api.iconify.design/fluent-emoji-flat/student.svg";
                } else {
                  return "https://api.iconify.design/fluent-emoji-flat/person-running.svg";
                }
              })()}
              alt={title}
              className="w-8 h-8 sm:w-12 sm:h-12 transform transition-transform group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
        <div className="p-3 sm:p-4 md:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 text-center">
                {title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 text-center">
                {description}
              </p>
            </div>
            {features && features.length > 0 && (
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-end gap-2 text-gray-600"
                  >
                    <span className="text-sm">{feature}</span>
                    <div
                      className={`flex items-center justify-center w-5 h-5 rounded-full ${buttonColor?.replace("bg-", "bg-opacity-20 bg-")}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-3 w-3 ${buttonColor?.replace("bg-", "text-")}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              className={`mt-3 sm:mt-4 md:mt-6 w-full ${buttonColor || "bg-[#7C9D32]"} hover:opacity-90 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm md:text-base font-medium`}
            >
              {title?.includes("المرحلة") ? "استكشف المرحلة" : "عرض المحتوى"}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StageCard;
