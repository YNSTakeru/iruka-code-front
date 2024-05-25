'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { ChevronsLeftRight } from 'lucide-react';
import { redirect } from 'next/navigation';

export const UserItem = () => {
  const { user } = useUser();

  if (!user) return redirect('/');

  const name = user.fullName ? user.fullName : user.username;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user.imageUrl} />
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {name}さんのプロジェクト
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};
