'use client';

import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { MenuIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ClassTitle } from './class-title';
import { ProjectTitle } from './project-title';
import { TeamBanner } from './team-banner';
import { TeamTitle } from './team-tilte';
import { Title } from './title';

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const team = useQuery(api.teams.getById, {
    teamId: params.teamId as Id<'teams'>,
  });

  const projectQueryOptions = params.projectId
    ? {
        projectId: params.projectId as Id<'projects'>,
      }
    : undefined;

  const project = useQuery(api.projects.getById, projectQueryOptions || 'skip');

  const classQueryOptions = params.classId
    ? { classId: params.classId as Id<'classes'> }
    : undefined;

  const _class = useQuery(api.classes.getById, classQueryOptions || 'skip');

  if (team === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center">
        <Title.Skeleton />
      </nav>
    );
  }

  if (team === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex  items-center justify-between wf-ull">
          <TeamTitle initialData={team} />
          {project && (
            <>
              <div className="mx-2">{'>'}</div>
              <ProjectTitle initialData={project} />
            </>
          )}
          {_class && (
            <>
              <div className="mx-2">{'>'}</div>
              <ClassTitle initialData={_class} />
            </>
          )}
        </div>
      </nav>
      {team.is_archived && <TeamBanner teamId={team._id} />}
    </>
  );
};
