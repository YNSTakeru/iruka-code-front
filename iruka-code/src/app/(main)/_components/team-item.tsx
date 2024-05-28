'use client';

import { useUser } from '@clerk/clerk-react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Item, ItemProps } from './item';

export const TeamItem = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  teamIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.teams.archive);
  const create = useMutation(api.projects.create);

  const maxParticipantCount = 3;

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id || !user) return;

    const promise = archive({
      teamId: id as Id<'teams'>,
    });

    toast.promise(promise, {
      loading: 'チームをゴミ箱に移動中...',
      success: 'チームをゴミ箱に移動しました。',
      error: 'チームをゴミ箱に移動することに失敗しました。',
    });
  };

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;

    const promise = create({
      team_id: id as Id<'teams'>,
      project_name: '空のプロジェクト',
      class_name: '空のクラス',
      max_participant_count: maxParticipantCount,
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
        teamIcon,
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
