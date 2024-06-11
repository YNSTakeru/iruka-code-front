import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Banner } from './banner';

interface BannerProps {
  projectId: Id<'projects'>;
}

export const ProjectBanner = ({ projectId }: BannerProps) => {
  const router = useRouter();
  const params = useParams();

  const remove = useMutation(api.projects.remove);
  const restore = useMutation(api.projects.restore);

  const onRemove = () => {
    const promise = remove({ id: projectId });

    toast.promise(promise, {
      loading: '削除中...',
      success: '削除しました',
      error: '削除に失敗しました',
    });

    router.push(`/teams/${params.teamId}/projects`);
  };

  const onRestore = () => {
    const promise = restore({ id: projectId });

    toast.promise(promise, {
      loading: '復元中...',
      success: '復元しました',
      error: '復元に失敗しました',
    });
  };

  return (
    <Banner onRemove={onRemove} onRestore={onRestore} typeStr="プロジェクト" />
  );
};
