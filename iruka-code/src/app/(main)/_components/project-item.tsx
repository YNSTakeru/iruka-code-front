'use client';

import { Id } from '@convex/_generated/dataModel';
import { LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Item } from './item';

interface ItemProps {
  id?: Id<'projects'>;
  label: string;
  onClick: () => void;
  active?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  expanded?: boolean;
  icon: LucideIcon;
}

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
    />
  );
};
