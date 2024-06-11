'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';

interface BannerProps {
  onRemove: () => void;
  onRestore: () => void;
}

export const Banner = ({ onRemove, onRestore }: BannerProps) => {
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>このページはゴミ箱です。</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="bborder-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        チームを復元
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          削除(データは復元できません)
        </Button>
      </ConfirmModal>
    </div>
  );
};
