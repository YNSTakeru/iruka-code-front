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

  const onSelect = (id: string) => {
    router.push(`/teams/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`${user?.username} さん、検索したいチーム名を入力してください`}
      />
      <CommandList>
        <CommandEmpty>検索にヒットしませんでした。</CommandEmpty>
        <CommandGroup heading="チーム">
          {teams?.map((team) => (
            <CommandItem
              key={team._id}
              value={`${team._id}-${team.title}`}
              title={team.title}
              onSelect={onSelect}
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
      </CommandList>
    </CommandDialog>
  );
};
