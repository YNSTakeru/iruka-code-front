import { Button } from '@/components/ui/button';
import { Logo } from './logo';

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50">
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          プライバシーポリシー
        </Button>
        <Button variant="ghost" size="sm">
          利用規約
        </Button>
      </div>
    </div>
  );
};
