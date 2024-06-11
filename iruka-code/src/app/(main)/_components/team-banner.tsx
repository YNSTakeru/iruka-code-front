import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Banner } from './banner';

interface BannerProps {
  teamId: Id<'teams'>;
}

export const TeamBanner = ({ teamId }: BannerProps) => {
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

  return <Banner onRemove={onRemove} onRestore={onRestore} />;
};
