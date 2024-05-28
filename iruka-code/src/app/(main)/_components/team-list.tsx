'use client';

import { cn } from '@/lib/utils';
import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Item } from './item';
import { ProjectList } from './project-list';
import { TeamItem } from './team-item';

interface TeamListProps {
  parentTeamId?: Id<'teams'>;
  level?: number;
  data?: Doc<'teams'>[];
}

export const TeamList = ({ parentTeamId, level = 0 }: TeamListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (teamId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [teamId]: !prevExpanded[teamId],
    }));
  };

  const teams = useQuery(api.teams.getSidebar, {
    project: parentTeamId,
  });

  const onRedirect = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  if (teams === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          expanded && 'last:block',
          level === 0 && 'hidden',
        )}
      >
        チームがまだありません
      </p>
      {teams.map((team) => (
        <div key={team._id}>
          <TeamItem
            id={team._id}
            onClick={() => onRedirect(team._id)}
            label={team.title}
            icon={FileIcon}
            teamIcon={team.icon}
            active={params.teamId === team._id}
            level={level}
            onExpand={() => onExpand(team._id)}
            expanded={expanded[team._id]}
          />

          {expanded[team._id] && (
            <ProjectList teamId={team._id} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};
