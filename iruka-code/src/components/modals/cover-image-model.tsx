'use client';

import { useCoverImage } from '@/hooks/use-cover-image';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';

export const CoverImageModal = () => {
  const coverImage = useCoverImage();

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">画像</h2>
        </DialogHeader>
        <div>画像をアップロード</div>
      </DialogContent>
    </Dialog>
  );
};
