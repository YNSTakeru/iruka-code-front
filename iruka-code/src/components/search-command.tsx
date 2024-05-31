'use client';

import { useSearch } from '@/hooks/use-search';
import { useUser } from '@clerk/clerk-react';
import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import { File } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const teams = useQuery(api.teams.getSearch);
  const projects = useQuery(api.projects.getSearch);
  const classes = useQuery(api.classes.getSearch);
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  const onSelectTeam = (id: string) => {
    router.push(`/teams/${id}`);
    onClose();
  };

  const onSelectProject = (id: string) => {
    // router.push(`teams/${teamId}/projects/${id}`);
    console.log(id);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`検索したいチーム、プロジェクト、クラスを入力してください`}
      />
      <CommandList>
        <CommandEmpty>検索にヒットしませんでした。</CommandEmpty>
        <CommandGroup heading="チーム">
          {teams?.map((team) => (
            <CommandItem
              key={team._id}
              value={`${team._id}-${team.title}`}
              title={team.title}
              onSelect={onSelectTeam}
            >
              {team.icon ? (
                <p className="mr-2 text-[18px]">{team.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{team.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="プロジェクト">
          {projects?.map((obj) => (
            <CommandItem
              key={obj!.project?._id}
              value={`${obj!.project!._id!}-${obj!.project!.project_name!}`}
              title={obj!.project!.project_name!}
              onSelect={onSelectProject}
            >
              <div className="">
                <div className="mb-2">{obj!.team_title}</div>
                <div className="flex ml-2">
                  <File className="mr-2 h-4 w-4" />
                  <span>{obj.project?.project_name}</span>
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="クラス">
          {classes?.map((obj) =>
            obj.projectNameClass.classes.map((cls) => (
              <CommandItem
                key={cls!._id}
                value={`${cls._id}-${cls.class_name}`}
                title={cls.class_name}
                onSelect={onSelectProject}
              >
                <div className="">
                  <div className="mb-2">{obj!.team_title}</div>
                  <div className="mb-2 ml-2">
                    {obj!.projectNameClass.projectName}
                  </div>
                  <div className="flex ml-4">
                    <File className="mr-2 h-4 w-4" />
                    <span>{cls.class_name}</span>
                  </div>
                </div>
              </CommandItem>
            )),
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
