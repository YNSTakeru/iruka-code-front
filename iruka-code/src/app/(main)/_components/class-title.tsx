import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Title } from './title';

interface TitleProps {
  initialData: Doc<'classes'>;
}

export const ClassTitle = ({ initialData }: TitleProps) => {
  const update = useMutation(api.classes.update);
  const { class_name } = initialData;

  return (
    <Title
      initialData={initialData}
      value={class_name}
      update={update}
      category={'class'}
    />
  );
};
