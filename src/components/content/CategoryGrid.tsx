import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentViewDialog from "./ContentViewDialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileText, Video, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ContentUploadDialog from "./ContentUploadDialog";
import StageCard from "../navigation/StageCard";
import ContentCard from "./ContentCard";

interface ContentType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  stage_id?: string;
  features?: string[];
  color?: string;
  buttonColor?: string;
}

interface CategoryGridProps {
  categories?: ContentType[];
  onCategoryClick?: (category: ContentType) => void;
}

const CategoryGrid = ({
  categories = [],
  onCategoryClick,
}: CategoryGridProps) => {
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contents, setContents] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkAdmin();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#748D19]/10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {categories?.map((category) => (
            <StageCard
              key={category.id}
              title={category.title}
              description={category.description}
              imageSrc={category.imageUrl}
              features={category.features}
              color={category.color}
              buttonColor={category.buttonColor}
              onClick={() => onCategoryClick?.(category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
