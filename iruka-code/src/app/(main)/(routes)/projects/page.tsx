'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const ProjectsPage = () => {
  const { user } = useUser();

  if (!user) return redirect('/');

  const name = user.firstName ? user.firstName : user.username;

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
      <Button>
        <PlusCircle className="h-4 w-4 mr-2" />
        プロジェクトを作成する
      </Button>
    </div>
  );
};

export default ProjectsPage;
