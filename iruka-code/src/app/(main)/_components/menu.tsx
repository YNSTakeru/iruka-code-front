'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/clerk-react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface MenuProps {
  teamId: Id<'teams'>;
}

export const Menu = ({ teamId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const archive = useMutation(api.teams.archive);

  const onArchive = () => {
    const promise = archive({ teamId: teamId });

    toast.promise(promise, {
      loading: 'ゴミ箱へ移動中...',
      success: 'ゴミ箱へ移動しました',
      error: 'ゴミ箱へ移動できませんでした',
    });

    router.push('/teams');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          ゴミ箱へ移動
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          最後の編集者: {user?.username}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-10 w-10" />;
};
