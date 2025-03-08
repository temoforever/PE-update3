import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ResourceGrid } from "./ResourceGrid";
import ContentCard from "./ContentCard";
import StageCard from "../navigation/StageCard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Home } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ContentUploadDialog from "./ContentUploadDialog";
import { useToast } from "@/components/ui/use-toast";
import { Stage, STAGES } from "@/lib/constants";

const ContentSection = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showContentTypes, setShowContentTypes] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [contentItems, setContentItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, email")
          .eq("id", user.id)
          .single();

        // التحقق مباشرة من دور المستخدم
        setIsAdmin(profile?.role === "admin");
      }
    };
    checkAdmin();
  }, []);

  const [selectedStage, setSelectedStage] = useState(stageId || "primary");
  const stage = STAGES[selectedStage];

  // Listen for content updates
  useEffect(() => {
    const handleContentUpdate = () => {
      if (selectedSubcategory?.selectedContentType) {
        fetchContent(selectedSubcategory.selectedContentType);
      }
    };

    window.addEventListener("content-updated", handleContentUpdate);
    return () =>
      window.removeEventListener("content-updated", handleContentUpdate);
  }, [selectedSubcategory]);

  const handleBack = () => {
    if (showContentTypes && selectedSubcategory?.selectedContentType) {
      setSelectedSubcategory({
        ...selectedSubcategory,
        selectedContentType: null,
      });
      setShowContentTypes(false);
    } else if (showContentTypes) {
      setShowContentTypes(false);
    } else if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      navigate("/home");
    }
  };

  const fetchContent = async (contentType: string) => {
    console.log("Fetching content for type:", contentType);
    setContentItems([]);
    try {
      console.log("Fetching content for:", {
        contentType,
        stageId: selectedStage,
        categoryId: selectedSubcategory?.id,
      });

      // Map UI content types to database types
      let dbContentType = contentType;
      if (contentType === "images") dbContentType = "image";
      if (contentType === "videos") dbContentType = "video";
      if (contentType === "files") dbContentType = "file";
      if (contentType === "talented") dbContentType = "talent";

      console.log("Using DB content type:", dbContentType);

      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", dbContentType)
        .eq("stage_id", selectedStage)
        .eq("category_id", selectedSubcategory?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched content:", data);

      // Map the data to include proper URLs
      const mappedData = (data || []).map((item) => ({
        ...item,
        url: item.url.startsWith("http") ? item.url : item.url,
      }));

      console.log("Mapped data:", mappedData);
      setContentItems(mappedData);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast({
        title: "خطأ!",
        description: "حدث خطأ أثناء تحميل المحتوى",
        variant: "destructive",
      });
    }
  };

  const renderContentTypeGrid = (contentType: any) => {
    const filteredContent =
      activeTab === "recent"
        ? contentItems.slice(0, 5)
        : activeTab === "favorites"
          ? contentItems.filter((item) => favorites.includes(item.id))
          : contentItems;

    const resources = filteredContent.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      thumbnail: item.url,
      downloadUrl: item.url,
    }));

    // If no content is available, add example content based on content type and subcategory
    if (resources.length === 0) {
      // Map content type IDs to database types
      const dbContentType =
        contentType.id === "images"
          ? "image"
          : contentType.id === "videos"
            ? "video"
            : contentType.id === "files"
              ? "file"
              : "talent";

      // Empty example content object - all examples removed
      const exampleContent = {};

      // No example content will be added
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-right">
          {contentType.title}
        </h2>
        <ResourceGrid
          resources={resources}
          onPreview={(resource) => {
            setSelectedResource(resource);
          }}
          onDownload={(resource) => {
            const link = document.createElement("a");
            link.href = resource.downloadUrl;
            link.download = resource.title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          onDelete={(resource) => {
            console.log("Deleting resource:", resource.id);
            // Force refresh the content
            if (selectedSubcategory?.selectedContentType) {
              fetchContent(selectedSubcategory.selectedContentType);
            }
          }}
          isAdmin={isAdmin}
        />
      </div>
    );
  };

  const renderHeader = () => {
    let title = stage.name;
    let description = `استكشف الموارد والأنشطة التعليمية لطلاب ${stage.name}`;

    if (showContentTypes && selectedSubcategory?.selectedContentType) {
      const contentType = selectedSubcategory.contentTypes?.find(
        (type) => type.id === selectedSubcategory.selectedContentType,
      );
      title = contentType?.title || selectedSubcategory.title;
      description = contentType?.description || selectedSubcategory.description;
    } else if (selectedSubcategory) {
      title = selectedSubcategory.title;
      description = selectedSubcategory.description;
    } else if (selectedCategory) {
      title = selectedCategory.title;
      description = selectedCategory.description;
    }

    return (
      <div className="mb-4 pt-2">
        <Card className="p-3 sm:p-4 bg-[#FFD700]/10 text-center" dir="rtl">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-xl sm:text-2xl font-heading text-[#7C9D32]">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl line-clamp-2">
              {description}
            </p>
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    if (selectedSubcategory?.selectedContentType) {
      const selectedType = selectedSubcategory.contentTypes?.find(
        (type) => type.id === selectedSubcategory.selectedContentType,
      );
      if (selectedType) {
        return (
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid gap-6">
              {renderContentTypeGrid(selectedType)}
            </div>
          </div>
        );
      }
    }

    if (selectedSubcategory) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {selectedSubcategory.contentTypes?.map((contentType) => (
            <ContentCard
              key={contentType.id}
              type={contentType.id as any}
              title={contentType.title}
              description={contentType.description}
              onClick={() => {
                fetchContent(contentType.id);
                setSelectedSubcategory({
                  ...selectedSubcategory,
                  selectedContentType: contentType.id,
                });
                setShowContentTypes(true);
              }}
            />
          ))}
        </div>
      );
    }

    if (selectedCategory) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {selectedCategory.subcategories?.map((subcategory) => (
            <StageCard
              key={subcategory.id}
              title={subcategory.title}
              description={subcategory.description}
              imageSrc={subcategory.imageUrl}
              features={subcategory.features}
              color={subcategory.color}
              buttonColor={subcategory.buttonColor}
              onClick={() => setSelectedSubcategory(subcategory)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-items-center max-w-[800px] mx-auto">
          {stage?.categories?.map((category) => (
            <StageCard
              key={category.id}
              title={category.title}
              description={category.description}
              imageSrc={category.imageUrl}
              color={category.color}
              buttonColor={category.buttonColor}
              features={category.features}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#748D19]/10 pt-12"> {/* Add top padding */}
      <div
        className="flex items-center justify-between px-4 bg-[#F8FAF5] shadow-sm z-40 h-14 mt-safe" /* Add mt-safe class */
        dir="rtl"
      >
        <Button
          onClick={handleBack}
          variant="outline"
          className="[&:not(:disabled)]:bg-white [&:not(:disabled)]:hover:bg-gray-50 [&:not(:disabled)]:text-black flex items-center gap-2 border border-input"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع
        </Button>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="bg-white hover:bg-gray-50 flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          الرئيسية
        </Button>
        {selectedSubcategory && !showContentTypes && (
          <div className="flex-1 flex justify-center">
            <ContentUploadDialog
              stageId={selectedStage}
              categoryId={selectedSubcategory.id}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {renderHeader()}
          {showContentTypes && selectedSubcategory?.selectedContentType ? (
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full max-w-md mx-auto mb-8">
                <TabsTrigger value="all" className="flex-1">
                  الكل
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex-1">
                  الأحدث
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex-1">
                  المفضلة
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">{renderContent()}</TabsContent>
              <TabsContent value="recent">{renderContent()}</TabsContent>
              <TabsContent value="favorites">{renderContent()}</TabsContent>
            </Tabs>
          ) : (
            renderContent()
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedResource}
        onOpenChange={() => setSelectedResource(null)}
      >
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedResource?.type === "image" && (
              <img
                src={selectedResource.downloadUrl}
                alt={selectedResource.title}
                className="w-full h-full object-contain rounded-lg max-h-[70vh]"
              />
            )}
            {selectedResource?.type === "video" && (
              <div className="aspect-video w-full">
                <iframe
                  src={selectedResource.downloadUrl}
                  title={selectedResource.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            )}
            {selectedResource?.type === "file" && (
              <object
                data={selectedResource.downloadUrl}
                type="application/pdf"
                className="w-full h-[70vh] rounded-lg"
              >
                <div className="text-center py-8">
                  <p className="mb-4">لا يمكن عرض الملف مباشرة</p>
                  <Button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedResource.downloadUrl;
                      link.download = selectedResource.title;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="bg-[#748d19] hover:bg-[#647917]"
                  >
                    تحميل الملف
                  </Button>
                </div>
              </object>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentSection;
