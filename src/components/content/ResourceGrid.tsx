import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Resource {
  id: string;
  title: string;
  type: "image" | "file" | "video" | "talent";
  thumbnail: string;
  downloadUrl: string;
}

interface ResourceGridProps {
  resources?: Resource[];
  onPreview?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  isAdmin?: boolean;
  onDelete?: (resource: Resource) => void;
}

const ResourceGrid = ({
  resources = [],
  onPreview = () => {},
  onDownload = () => {},
  isAdmin = false,
  onDelete,
}: ResourceGridProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(
    null,
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const handleDelete = async (resource: Resource) => {
    try {
      // Check if this is an example resource (has example- prefix)
      if (resource.id && resource.id.startsWith("example-")) {
        console.log("Deleting example resource:", resource.id);
        // For example resources, just call the onDelete callback without database operations
        toast({
          title: "تم الحذف!",
          description: "تم حذف المحتوى بنجاح",
          variant: "default",
        });

        // Call onDelete callback if provided
        if (onDelete) {
          onDelete(resource);
        }

        // Close the dialog
        setDeleteDialogOpen(false);
        return;
      }

      // Delete from storage if URL is from Supabase storage
      if (resource.downloadUrl.includes("content")) {
        const path = resource.downloadUrl.split("/").pop();
        if (path) {
          await supabase.storage.from("content").remove([path]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", resource.id);

      if (error) throw error;

      toast({
        title: "تم الحذف!",
        description: "تم حذف المحتوى بنجاح",
        variant: "default",
      });

      // Call onDelete callback if provided
      onDelete?.(resource);
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast({
        variant: "destructive",
        description: "حدث خطأ أثناء حذف المحتوى",
      });
    }
  };

  const renderPreviewContent = (resource: Resource) => {
    switch (resource.type) {
      case "image":
        return (
          <div className="relative w-full h-full bg-white flex items-center justify-center">
            <img
              src={resource.downloadUrl}
              alt={resource.title}
              className="w-full h-full object-contain rounded-lg max-h-[70vh]"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x400?text=Error+Loading+Image";
              }}
            />
          </div>
        );
      case "video":
        return (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={resource.downloadUrl}
              title={resource.title}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      case "file":
        return (
          <div className="w-full h-[70vh] bg-white rounded-lg p-4">
            <object
              data={resource.downloadUrl}
              type="application/pdf"
              className="w-full h-full rounded-lg"
            >
              <div className="text-center py-8 bg-white">
                <p className="mb-4">لا يمكن عرض الملف مباشرة</p>
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = resource.downloadUrl;
                    link.download = resource.title;
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
          </div>
        );
      default:
        return <div className="text-center p-4 bg-white">غير متوفر</div>;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {resources.map((resource) => (
          <Card
            key={resource.id}
            className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white backdrop-blur-sm"
          >
            <div
              className="relative aspect-video cursor-pointer bg-white h-24 sm:h-auto"
              onClick={() => {
                setSelectedResource(resource);
                onPreview(resource);
              }}
            >
              {resource.type === "image" ? (
                <div className="w-full h-full bg-gray-50">
                  <img
                    src={resource.downloadUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400?text=Error+Loading+Image";
                    }}
                    loading="lazy"
                  />
                </div>
              ) : resource.type === "video" ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500">معاينة غير متوفرة</div>
                </div>
              )}
              {resource.type === "file" && (
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                  PDF
                </div>
              )}
            </div>
            <CardContent className="p-2 sm:p-3 text-right bg-white">
              <h3 className="font-semibold mb-2 text-sm sm:text-base line-clamp-1">
                {resource.title}
              </h3>
              <div className="flex justify-between items-center gap-2">
                {isAdmin && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:bg-red-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setResourceToDelete(resource);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>حذف</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedResource(resource);
                          onPreview(resource);
                        }}
                      >
                        <img
                          src="https://api.iconify.design/fluent-emoji-flat/eyes.svg"
                          alt="معاينة"
                          className="h-5 w-5"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>معاينة</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          onDownload(resource);
                          const link = document.createElement("a");
                          link.href = resource.downloadUrl;
                          link.download = resource.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <img
                          src="https://api.iconify.design/fluent-emoji-flat/inbox-tray.svg"
                          alt="تحميل"
                          className="h-5 w-5"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>تحميل</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedResource}
        onOpenChange={() => setSelectedResource(null)}
      >
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedResource && renderPreviewContent(selectedResource)}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذا المحتوى؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف المحتوى نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (resourceToDelete) {
                  handleDelete(resourceToDelete);
                  setDeleteDialogOpen(false);
                }
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { ResourceGrid };
