'use client';

import { ProjectToolbar } from '@/components/project-toolbar';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useQuery } from 'convex/react';

interface ProjectIdPageProps {
  params: {
    projectId: Id<'projects'>;
    teamId: Id<'teams'>;
  };
}

const ProjectIdPage = ({ params }: ProjectIdPageProps) => {
  const project = useQuery(api.projects.getById, {
    projectId: params.projectId,
  });

  if (project === undefined) {
    return <div>読み込み中...</div>;
  }

  if (project === null) {
    return <div>見つかりません</div>;
  }

  return (
    <div className="pb-40">
      <div className="h-[35vh]">
        <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
          <ProjectToolbar initialData={project} teamId={params.teamId} />
        </div>
      </div>
    </div>
  );
};

export default ProjectIdPage;
