'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Doc } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useRef, useState } from 'react';

export interface TitleProps {
  initialData: Doc<'teams'> | Doc<'projects'> | Doc<'classes'>;
  value: string;
  update: ReturnType<typeof useMutation>;
  category: string;
}

export const Title = ({ initialData, value, update, category }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(value || '未タイトル');
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(value);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    switch (category) {
      case 'team':
        update({
          id: initialData._id,
          title: event.target.value || '未タイトル',
        });
        break;
      case 'project':
        const thisInitialData = initialData as Doc<'projects'>;
        update({
          id: initialData._id,
          team_id: thisInitialData.team_id,
          project_name: event.target.value || '無名のプロジェクト',
          is_archived: initialData.is_archived!,
          is_open: thisInitialData.is_open,
          max_participant_count: thisInitialData.max_participant_count,
          max_class_num: thisInitialData.max_class_num,
        });
        break;
      case 'class':
        const thisInitialDataClass = initialData as Doc<'classes'>;
        update({
          id: thisInitialDataClass._id,
          project_id: thisInitialDataClass.project_id,
          class_name: event.target.value || '無名のクラス',
          is_open: thisInitialDataClass.is_open,
          is_archived: thisInitialDataClass.is_archived,
          max_participant_count: thisInitialDataClass.max_participant_count,
        });
        break;
      default:
        break;
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  return (
    <div className="flex items-center gap-x-1">
      {initialData && 'icon' in initialData && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={enableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{value}</span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className="h-9 w-20 rounded-md" />;
};
