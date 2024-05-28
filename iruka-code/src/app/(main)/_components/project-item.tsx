'use client';

import { useRouter } from 'next/navigation';
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
