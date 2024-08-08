'use client';

import Live from '@/components/Live';
import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '600', '700'],
});

export default function Page() {
  return (
    <div className={`${workSans.className}  bg-primary-grey-200`}>
      <Live />
    </div>
  );
}
