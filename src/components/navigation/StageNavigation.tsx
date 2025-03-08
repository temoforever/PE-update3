import React from "react";
import StageCard from "./StageCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

import { Stage } from "@/lib/constants";

interface StageNavigationProps {
  stages?: Stage[];
}

import { STAGES } from "@/lib/constants";

const defaultStages = Object.values(STAGES);

const StageNavigation = ({ stages = defaultStages }: StageNavigationProps) => {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleStageSelect = (stageId: string) => {
    console.log("Navigating to stage:", stageId);
    navigate(`/stage/${stageId}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#748D19]/10 p-4 md:p-6 pt-16 md:pt-20">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between bg-[#F8FAF5] shadow-sm z-40 h-14 mb-8">
          <div className="h-full w-full flex items-center justify-between px-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="bg-white hover:bg-gray-50"
            >
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-display text-gray-900 text-center">
              المرحلة التعليمية
            </h1>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>
        <motion.div className="flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 text-[#a80303]">
          {stages.map((stage) => (
            <motion.div key={stage.id} variants={item}>
              <StageCard
                title={stage.title}
                description={stage.description}
                icon={stage.icon}
                onClick={() => handleStageSelect(stage.id)}
                className="h-full"
                color={stage.color}
                buttonColor={stage.buttonColor}
                features={stage.features}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StageNavigation;
