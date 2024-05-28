'use client';

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
  const projectCreate = useMutation(api.projects.create);
  const classCreate = useMutation(api.classes.create);

  const maxParticipantCount = 3;

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;

    const projectPromise = projectCreate({
      team_id: id as Id<'teams'>,
      project_name: '空のプロジェクト',
      max_participant_count: maxParticipantCount,
      max_class_num: 1,
    }).then((projectId) => {
      if (!expanded) {
        onExpand?.();
      }

      const classPromise = classCreate({
        project_id: projectId,
        class_name: '空のクラス',
        max_participant_count: maxParticipantCount,
      });

      toast.promise(classPromise, {
        loading: 'クラスを作成中...',
        success: 'クラスを作成しました',
        error: 'クラスの作成に失敗しました',
      });

      //   router.push(`/teams/${id}/projects/${projectId}`);
    });

    toast.promise(projectPromise, {
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
    />
  );
};
