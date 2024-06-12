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
  projectId?: Id<'projects'>;
  classId?: Id<'classes'>;
}

export const Menu = ({ teamId, projectId, classId }: MenuProps) => {
  const router = useRouter();
  const { user } = useUser();

  const teamArchive = useMutation(api.teams.archive);
  const projectArchive = useMutation(api.projects.archive);
  const classArchive = useMutation(api.classes.archive);

  const onTeamArchive = () => {
    const promise = teamArchive({ teamId: teamId });

    toast.promise(promise, {
      loading: 'チームをゴミ箱へ移動中...',
      success: 'チームをゴミ箱へ移動しました',
      error: 'チームをゴミ箱へ移動できませんでした',
    });

    router.push('/teams');
  };

  const onProjectArchive = () => {
    const promise = projectArchive({ projectId: projectId! });

    toast.promise(promise, {
      loading: 'プロジェクトをゴミ箱へ移動中...',
      success: 'プロジェクトをゴミ箱へ移動しました',
      error: 'プロジェクトをゴミ箱へ移動できませんでした',
    });

    router.push(`/teams/${teamId}/projects`);
  };

  const onClassArchive = () => {
    const promise = classArchive({ classId: classId! });

    toast.promise(promise, {
      loading: 'クラスをゴミ箱へ移動中...',
      success: 'クラスをゴミ箱へ移動しました',
      error: 'クラスをゴミ箱へ移動できませんでした',
    });

    router.push(`/teams/${teamId}/projects/${projectId}`);
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
        <DropdownMenuItem onClick={onTeamArchive}>
          <Trash className="h-4 w-4 mr-2" />
          チームをゴミ箱へ移動
        </DropdownMenuItem>
        {projectId && (
          <DropdownMenuItem onClick={onProjectArchive}>
            <Trash className="h-4 w-4 mr-2" />
            プロジェクトをゴミ箱へ移動
          </DropdownMenuItem>
        )}
        {classId && (
          <DropdownMenuItem onClick={onClassArchive}>
            <Trash className="h-4 w-4 mr-2" />
            クラスをゴミ箱へ移動
          </DropdownMenuItem>
        )}
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
