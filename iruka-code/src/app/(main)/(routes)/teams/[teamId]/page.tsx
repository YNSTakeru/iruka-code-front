'use client';

import { Cover } from '@/components/cover';
import { TeamToolbar } from '@/components/team-toolbar';
import { Skeleton } from '@/components/ui/skeleton';
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
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (team === null) {
    return <div>見つかりません</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={team.coverImage} />
      <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
        <TeamToolbar initialData={team} />
      </div>
    </div>
  );
};

export default TeamIdPage;
