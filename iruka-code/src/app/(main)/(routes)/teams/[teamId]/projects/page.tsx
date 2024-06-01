'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { redirect, useParams } from 'next/navigation';
import { toast } from 'sonner';

const ProjectPage = () => {
  const { user } = useUser();
  const params = useParams();
  const create = useMutation(api.projects.create);

  if (!user) return redirect('/');

  const name = user.firstName ? user.firstName : user.username;

  const onCreate = async () => {
    const promise = create({
      project_name: '無名のプロジェクト',
      class_name: '無名のクラス',
      team_id: params.teamId as Id<'teams'>,
      max_participant_count: 3,
      max_class_num: 1,
    });

    toast.promise(promise, {
      loading: 'プロジェクトを作成しています...',
      success: 'プロジェクトを作成しました！',
      error: 'プロジェクトの作成に失敗しました。',
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.jpg"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden border rounded-full h-[300px] w-[300px]"
      />
      <Image
        src="/empty-dark.jpg"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block border rounded-full h-[300px] w-[300px]"
      />
      <h2>{name}さん、Iruka Codeへようこそ！</h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        新しいプロジェクトを作成する
      </Button>
    </div>
  );
};

export default ProjectPage;
