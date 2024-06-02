import { api } from '@convex/_generated/api';
import { Doc } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Title } from './title';

interface TitleProps {
  initialData: Doc<'teams'>;
}

export const TeamTitle = ({ initialData }: TitleProps) => {
  const update = useMutation(api.teams.update);
  const { _id, title, icon } = initialData;

  return <Title initialData={{ _id, value: title, icon }} update={update} />;
};
