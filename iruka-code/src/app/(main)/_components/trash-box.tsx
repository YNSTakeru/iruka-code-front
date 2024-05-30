'use client';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Spinner } from '@/components/spinner';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { Search, Trash, Undo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const teams = useQuery(api.teams.getTrash);
  const projects = useQuery(api.projects.getTrash);
  const _class = useQuery(api.classes.getTrash);
  const restoreTeam = useMutation(api.teams.restore);
  const restoreProject = useMutation(api.projects.restore);
  const removeTeam = useMutation(api.teams.remove);
  const removeProject = useMutation(api.projects.remove);

  const [search, setSearch] = useState('');

  const filteredTeams = teams?.filter((team) => {
    return team.title.toLowerCase().includes(search.toLowerCase());
  });

  const filteredProjects = projects?.filter((project) => {
    return project?.project?.project_name
      ?.toLowerCase()
      .includes(search.toLowerCase());
  });

  const onTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  const onProjectClick = ({
    teamId,
    projectId,
  }: {
    teamId: string;
    projectId: string;
  }) => {
    router.push(`/teams/${teamId}/projects/${projectId}`);
  };

  const onTeamRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    teamId: Id<'teams'>,
  ) => {
    event.stopPropagation();
    const promise = restoreTeam({ id: teamId });

    toast.promise(promise, {
      loading: 'チームを復元中...',
      success: 'チームを復元しました。',
      error: 'チームを復元することに失敗しました。',
    });
  };

  const onProjectRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    projectId: Id<'projects'>,
  ) => {
    event.stopPropagation();
    const promise = restoreProject({ id: projectId });

    toast.promise(promise, {
      loading: 'プロジェクトを復元中...',
      success: 'プロジェクトを復元しました。',
      error: 'プロジェクトを復元することに失敗しました。',
    });
  };

  const onTeamRemove = (teamId: Id<'teams'>) => {
    const promise = removeTeam({ id: teamId });

    toast.promise(promise, {
      loading: 'チームを削除中...',
      success: 'チームを削除しました。',
      error: 'チームを削除することに失敗しました。',
    });

    if (params.teamId === teamId) {
      router.push('/teams');
    }
  };

  const onProjectRemove = (projectId: Id<'projects'>) => {
    const promise = removeProject({ id: projectId });

    toast.promise(promise, {
      loading: 'プロジェクトを削除中...',
      success: 'プロジェクトを削除しました。',
      error: 'プロジェクトを削除することに失敗しました。',
    });

    if (params.projectId === projectId) {
      router.push(`teams/${params.teamId}/projects`);
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
          placeholder="チーム、プロジェクト、クラス検索"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="pl-2 font-bold">チーム</p>
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          チームがゴミ箱にありません
        </p>
        {filteredTeams?.map((team) => (
          <div
            key={team._id}
            role="button"
            onClick={() => onTeamClick(team._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{team.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onTeamRestore(e, team._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onTeamRemove(team._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
      <DropdownMenuSeparator />
      <div className="mt-2 px-1 pb-1">
        <p className="pl-2 font-bold">プロジェクト</p>
      </div>
      {projects === undefined && (
        <div className="h-full flex items-center justify-center p-4">
          <Spinner size="lg" />
        </div>
      )}
      {projects && (
        <div className="mt-2 px-1 pb-1">
          <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
            プロジェクトがゴミ箱にありません
          </p>
          {filteredProjects?.map((project) => (
            <div>
              <div className="pl-2">{project.team_title}</div>
              <div
                key={project.project!._id}
                role="button"
                onClick={() =>
                  onProjectClick({
                    teamId: project!.project!.team_id,
                    projectId: project!.project!._id,
                  })
                }
                className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
              >
                <span className="truncate pl-4">
                  {project?.project!.project_name}
                </span>
                <div className="flex items-center">
                  <div
                    onClick={(e) => onProjectRestore(e, project!.project!._id)}
                    role="button"
                    className="rounded-sm p-2 hover:bg-neutral-200"
                  >
                    <Undo className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <ConfirmModal
                    onConfirm={() => onProjectRemove(project!.project!._id)}
                  >
                    <div
                      role="button"
                      className="rounded-sm p-2 hover:bg-neutral-200"
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </ConfirmModal>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <DropdownMenuSeparator />
      <div className="mt-2 px-1 pb-1">
        <p className="pl-2 font-bold">クラス</p>
      </div>
      {_class === undefined && (
        <div className="h-full flex items-center justify-center p-4">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};
