import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '600', '700'],
});

export default function Page() {
  return (
    <h1
      className={`${workSans.className} h-[100vh] w-full flex justify-center items-center text-center bg-primary-grey-200`}
    >
      <h1 className="text-2xl text-white">Liveblocks Figma Clone</h1>
    </h1>
  );
}
