'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface BannerProps {
  teamId: Id<'teams'>;
}

export const Banner = ({ teamId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.teams.remove);
  const restore = useMutation(api.teams.restore);

  const onRemove = () => {
    const promise = remove({ id: teamId });

    toast.promise(promise, {
      loading: '削除中...',
      success: '削除しました',
      error: '削除に失敗しました',
    });

    router.push('/teams');
  };

  const onRestore = () => {
    const promise = restore({ id: teamId });

    toast.promise(promise, {
      loading: '復元中...',
      success: '復元しました',
      error: '復元に失敗しました',
    });
  };

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
