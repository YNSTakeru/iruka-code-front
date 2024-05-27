'use client';

import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Item } from './item';

interface ItemProps {
  id?: Id<'teams'>;
  teamIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

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
  const create = useMutation(api.projects.create);

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;

    const promise = create({
      team_id: id,
      project_name: '空のプロジェクト',
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
        teamIcon,
        isSearch,
        level,
        onExpand,
        expanded,
      }}
    />
  );
};
