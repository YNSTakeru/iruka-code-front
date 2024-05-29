'use client';

import { Spinner } from '@/components/spinner';
import { Input } from '@/components/ui/input';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const teams = useQuery(api.teams.getTrash);
  const restore = useMutation(api.teams.restore);
  const remove = useMutation(api.teams.remove);

  const [search, setSearch] = useState('');

  const filteredTeams = teams?.filter((team) => {
    return team.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    teamId: Id<'teams'>,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: teamId });

    toast.promise(promise, {
      loading: 'チームを復元中...',
      success: 'チームを復元しました。',
      error: 'チームを復元することに失敗しました。',
    });
  };

  const onRemove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    teamId: Id<'teams'>,
  ) => {
    event.stopPropagation();
    const promise = remove({ id: teamId });

    toast.promise(promise, {
      loading: 'チームを削除中...',
      success: 'チームを削除しました。',
      error: 'チームを削除することに失敗しました。',
    });

    if (params.teamId === teamId) {
      router.push('/teams');
    }
  };

  if (teams === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="チーム検索"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          チームがゴミ箱にありません
        </p>
        {filteredTeams?.map((team) => (
          <div
            key={team._id}
            role="button"
            onClick={() => onClick(team._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span>{team.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
