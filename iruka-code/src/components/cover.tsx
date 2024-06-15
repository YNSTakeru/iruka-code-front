'use client';

import { useCoverImage } from '@/hooks/use-cover-image';
import { cn } from '@/lib/utils';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.teams.removeCoverImage);

  const onRemove = () => {
    removeCoverImage({
      id: params.teamId as Id<'teams'>,
    });
  };

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted',
      )}
    >
      {!!url && <Image src={url} fill alt="Cover" className="object-cover" />};
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            画像を変更
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            画像を削除
          </Button>
        </div>
      )}
    </div>
  );
};
