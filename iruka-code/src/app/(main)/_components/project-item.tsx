'use client';

import { useUser } from '@clerk/clerk-react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Item, ItemProps } from './item';

export const ProjectItem = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  isSearch,
  level = 1,
  onExpand,
  expanded,
}: ItemProps) => {
  const router = useRouter();
  const archive = useMutation(api.projects.archive);
  const create = useMutation(api.classes.create);
  const { user } = useUser();

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id || !user) return;

    const promise = archive({
      projectId: id as Id<'projects'>,
    });

    toast.promise(promise, {
      loading: 'プロジェクトをゴミ箱に移動中...',
      success: 'プロジェクトをゴミ箱に移動しました。',
      error: 'プロジェクトをゴミ箱に移動することに失敗しました。',
    });
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;

    const promise = create({
      project_id: id as Id<'projects'>,
      class_name: '空のクラス',
      max_participant_count: 3,
    }).then((projectId) => {
      if (!expanded) {
        onExpand?.();
      }

      //   router.push(`/teams/${id}/projects/${projectId}`);
    });

    toast.promise(promise, {
      loading: 'クラスを作成中...',
      success: 'クラスを作成しました',
      error: 'クラスの作成に失敗しました',
    });
  };

  return (
    <Item
      {...{
        id,
        label,
        onClick,
        onCreate,
        icon: Icon,
        active,
        isSearch,
        level,
        onExpand,
        expanded,
      }}
      username={user!.username!}
      onArchive={onArchive}
    />
  );
};
