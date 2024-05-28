'use client';

import { useUser } from '@clerk/clerk-react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Item, ItemProps } from './item';

export const ClassItem = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  isSearch,
  level = 2,
  onExpand,
  expanded,
}: ItemProps) => {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.classes.archive);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id || !user) return;

    const promise = archive({
      classId: id as Id<'classes'>,
    });

    toast.promise(promise, {
      loading: 'クラスをゴミ箱に移動中...',
      success: 'クラスをゴミ箱に移動しました。',
      error: 'クラスをゴミ箱に移動することに失敗しました。',
    });
  };

  return (
    <Item
      {...{
        id,
        label,
        onClick,
        icon: Icon,
        active,
        isSearch,
        level,
        onExpand,
        expanded,
      }}
      isExpand={false}
      username={user!.username!}
      onArchive={onArchive}
    />
  );
};
