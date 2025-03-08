import React from "react";
import { Card, CardContent } from "./ui/card";

const Features = () => {
  const features = [
    {
      icon: "https://api.iconify.design/fluent-emoji-flat:books.svg",
      title: "محتوى تعليمي",
      description: "مكتبة شاملة من المواد التعليمية والأنشطة الرياضية",
      gradient: "from-[#E8F5E9] to-[#C8E6C9]",
      iconBg: "bg-[#81C784]",
    },
    {
      icon: "https://api.iconify.design/fluent-emoji-flat:people-hugging.svg",
      title: "مجتمع مهني",
      description: "تواصل مع نخبة وتبادل الخبرات والأفكار",
      gradient: "from-[#FFF3E0] to-[#FFE0B2]",
      iconBg: "bg-[#FFB74D]",
    },
    {
      icon: "https://api.iconify.design/fluent-emoji-flat:sports-medal.svg",
      title: "دعم الموهوبين",
      description: "اكتشاف ورعاية المواهب الرياضية",
      gradient: "from-[#E3F2FD] to-[#BBDEFB]",
      iconBg: "bg-[#64B5F6]",
    },
  ];

  return (
    <section className="py-8 sm:py-16 bg-gradient-to-b from-gray-100/50 to-white/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
          مميزات المنصة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-none overflow-hidden bg-gradient-to-br ${feature.gradient} hover:scale-105 transition-all duration-300 shadow-lg`}
            >
              <CardContent className="p-6 text-center relative">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 mb-4 transform hover:scale-110 transition-transform duration-300">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#748d19]">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
