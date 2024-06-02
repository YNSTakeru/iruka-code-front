import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Title } from './title';

interface TitleProps {
  initialData: Doc<'projects'>;
}

export const ProjectTitle = ({ initialData }: TitleProps) => {
  const update = useMutation(api.projects.update);
  const { project_name } = initialData;
  return (
    <Title
      initialData={initialData}
      value={project_name}
      update={update}
      category={'project'}
    />
  );
};
