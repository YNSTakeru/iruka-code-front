import { cn } from '@/lib/utils';
import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Item } from './item';
import { ProjectItem } from './project-item';

interface ProjectListProps {
  teamId?: Id<'teams'>;
  level?: number;
  data?: Doc<'projects'>[];
}

export const ProjectList = ({ teamId, level = 1 }: ProjectListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (projectId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [projectId]: !prevExpanded[projectId],
    }));
  };

  const projects = useQuery(api.projects.getSidebar, {
    team_id: teamId,
  });

  const onRedirect = (projectId: string) => {
    router.push(`/teams/${teamId}/projects/${projectId}`);
  };

  if (projects === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 1 && (
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
        プロジェクトがまだありません
      </p>
      {projects.map((project) => (
        <div key={project._id}>
          <ProjectItem
            id={project._id}
            onClick={() => onRedirect(project._id)}
            label={project.project_name}
            icon={FileIcon}
            active={params.projectId === project._id}
            level={level}
            onExpand={() => onExpand(project._id)}
            expanded={expanded[project._id]}
          />
          {expanded[project._id] && <div>classList</div>}
        </div>
      ))}
    </>
  );
};
