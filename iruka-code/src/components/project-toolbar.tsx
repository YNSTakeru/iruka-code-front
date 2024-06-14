'use client';

import { api } from '@convex/_generated/api';
import { Doc, Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { ElementRef, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface ProjectToolbarProps {
  initialData: Doc<'projects'>;
  teamId: Id<'teams'>;
  preview?: boolean;
}

export const ProjectToolbar = ({
  initialData,
  teamId,
  preview,
}: ProjectToolbarProps) => {
  const inputRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.project_name);

  const update = useMutation(api.projects.update);

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.project_name);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      team_id: teamId,
      project_name: value || '無名のプロジェクト',
      is_archived: initialData.is_archived!,
      is_open: initialData.is_open,
      max_participant_count: initialData.max_participant_count,
      max_class_num: initialData.max_class_num,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };

  return (
    <div className="pl-[54px] group relative">
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4"></div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none pt-6"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] pt-6"
        >
          {initialData.project_name}
        </div>
      )}
    </div>
  );
};
