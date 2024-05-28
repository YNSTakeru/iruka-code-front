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
  teamId,
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
  const create = useMutation(api.projects.create);
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
      team_id: teamId as Id<'teams'>,
      project_name: '空のプロジェクト',
      class_name: '空のクラス',
      max_participant_count: 3,
      max_class_num: 1,
    }).then((projectId) => {
      if (!expanded) {
        onExpand?.();
      }

      //   router.push(`/teams/${id}/projects/${projectId}`);
    });

    toast.promise(promise, {
      loading: 'プロジェクトを作成中...',
      success: 'プロジェクトを作成しました',
      error: 'プロジェクトの作成に失敗しました',
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
