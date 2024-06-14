'use client';

import { TeamToolbar } from '@/components/team-toolbar';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';

interface TeamIdPageProps {
  params: {
    teamId: Id<'teams'>;
  };
}

const TeamIdPage = ({ params }: TeamIdPageProps) => {
  const team = useQuery(api.teams.getById, {
    teamId: params.teamId,
  });

  if (team === undefined) {
    return <div>読み込み中...</div>;
  }

  if (team === null) {
    return <div>見つかりません</div>;
  }

  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TeamToolbar initialData={team} />
      </div>
    </div>
  );
};

export default TeamIdPage;
