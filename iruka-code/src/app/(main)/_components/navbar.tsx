'use client';

import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const team = useQuery(api.teams.getById, {
    teamId: params.teamId as Id<'teams'>,
  });

  if (team === undefined) {
    return <p>読み込み中...</p>;
  }

  if (team === null) {
    return null;
  }

  return (
    <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
      {isCollapsed && (
        <MenuIcon
          role="button"
          onClick={onResetWidth}
          className="h-6 w-6 text-muted-foreground"
        />
      )}
      <div className="flex items-center justify-between wf-ull">Navbar</div>
    </nav>
  );
};
