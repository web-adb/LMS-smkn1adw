// components/ShareQuizDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, BookOpen, Share2 } from "lucide-react";
import { toast } from 'react-hot-toast';


interface ShareQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizLink: string;
  onViewQuiz: () => void;
}

export const ShareQuizDialog = ({ 
  open, 
  onOpenChange, 
  quizLink,
  onViewQuiz
}: ShareQuizDialogProps) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(quizLink);
    toast.success('Link berhasil disalin!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Bagikan Quiz
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Quiz Anda telah berhasil dibuat! Bagikan link berikut dengan peserta didik:
          </p>
          
          <div className="flex items-center gap-2">
            <Input
              value={quizLink}
              readOnly
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Salin
            </Button>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Tutup
            </Button>
            <Button
              onClick={onViewQuiz}
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Lihat Quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};