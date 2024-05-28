'use client';

import { useRouter } from 'next/navigation';
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
    />
  );
};
