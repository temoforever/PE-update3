import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    description: string;
    url: string;
    type: string;
  } | null;
}

export default function ContentViewDialog({
  isOpen,
  onClose,
  content,
}: ContentViewDialogProps) {
  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {content.type === "image" && (
            <div className="relative aspect-video">
              <img
                src={content.url}
                alt={content.title}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          )}
          {content.type === "video" && (
            <div className="relative aspect-video">
              <iframe
                src={content.url}
                title={content.title}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          )}
          {content.type === "file" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                فتح الملف
              </a>
            </div>
          )}
          <p className="mt-4 text-gray-600">{content.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
