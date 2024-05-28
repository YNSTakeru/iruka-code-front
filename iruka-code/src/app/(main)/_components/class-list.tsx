import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ClassItem } from './class-item';
import { Item } from './item';

interface ClassListProps {
  teamId?: Id<'teams'>;
  projectId?: Id<'projects'>;
  level?: number;
  data?: Doc<'classes'>[];
}

export const ClassList = ({ teamId, projectId, level = 2 }: ClassListProps) => {
  const params = useParams();
  const router = useRouter();

  const classes = useQuery(api.classes.getSidebar, {
    project_id: projectId,
  });

  const onRedirect = (classId: string) => {
    router.push(`/teams/${teamId}/projects/${projectId}/classes/${classId}`);
  };

  if (classes === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 2 && (
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
      {classes.map((_class) => (
        <div key={_class._id}>
          <ClassItem
            id={_class._id}
            onClick={() => onRedirect(_class._id)}
            label={_class.class_name}
            icon={FileIcon}
            active={params.classId === _class._id}
            level={level}
          />
        </div>
      ))}
    </>
  );
};
