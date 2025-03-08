import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGES } from "@/lib/constants";
import ContentUploadDialog from "../content/ContentUploadDialog";
import { cn } from "@/lib/utils";

export function ContentManagementSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة المحتوى</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.values(STAGES).map((stage) => (
            <Card
              key={stage.id}
              className="overflow-hidden border-none shadow-sm"
            >
              <CardHeader className="bg-[#7C9D32]/5">
                <CardTitle className="text-lg">{stage.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-6">
                  {stage.categories?.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#7C9D32]">
                        {category.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.subcategories?.map((subcategory) => (
                          <Card
                            key={subcategory.id}
                            className="overflow-hidden"
                          >
                            <div className="relative h-32">
                              <img
                                src={subcategory.imageUrl}
                                alt={subcategory.title}
                                className="w-full h-full object-cover"
                              />
                              <div
                                className={`absolute inset-0 ${subcategory.buttonColor} opacity-60`}
                              />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">
                                {subcategory.title}
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {subcategory.contentTypes?.map((type) => (
                                  <ContentUploadDialog
                                    key={type.id}
                                    stageId={stage.id}
                                    categoryId={subcategory.id}
                                    contentType={type.id}
                                    isAdmin={true}
                                    className={cn(
                                      "w-full justify-start text-right border bg-[#95B846]/10 hover:bg-[#95B846]/20 border-[#95B846]/30 text-gray-900",
                                    )}
                                    variant="outline"
                                    showIcon={true}
                                    label={`رفع ${
                                      type.id === "image"
                                        ? "الصور"
                                        : type.id === "video"
                                          ? "الفيديوهات"
                                          : type.id === "file"
                                            ? "الملفات"
                                            : "الموهوبين"
                                    }`}
                                  />
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
