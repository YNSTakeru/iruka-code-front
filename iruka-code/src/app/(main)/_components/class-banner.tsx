import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Banner } from './banner';

interface BannerProps {
  classId: Id<'classes'>;
}

export const ClassBanner = ({ classId }: BannerProps) => {
  const router = useRouter();
  const params = useParams();

  const remove = useMutation(api.classes.remove);
  const restore = useMutation(api.classes.restore);

  const onRemove = () => {
    const promise = remove({ id: classId });

    toast.promise(promise, {
      loading: '削除中...',
      success: '削除しました',
      error: '削除に失敗しました',
    });

    router.push(`/teams/${params.teamId}/projects/${params.projectId}`);
  };

  const onRestore = () => {
    const promise = restore({ id: classId });

    toast.promise(promise, {
      loading: '復元中...',
      success: '復元しました',
      error: '復元に失敗しました',
    });
  };

  return <Banner onRemove={onRemove} onRestore={onRestore} typeStr="クラス" />;
};
