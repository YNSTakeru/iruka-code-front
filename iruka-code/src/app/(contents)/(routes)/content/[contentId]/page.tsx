'use client';

import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '600', '700'],
});

export default function Page() {
  return (
    <main
      className={`${workSans.className}  bg-primary-grey-200 h-screen overflow-hidden`}
    >
      <Navbar />

      <section className="flex h-full flex-row">
        <Live />
      </section>
    </main>
  );
}
