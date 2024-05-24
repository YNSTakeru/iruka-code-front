import Image from 'next/image';

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center gap-x-4">
        <div className="relative w-[250px] h-[250px]">
          <Image
            src="/documents.jpg"
            fill
            className="object-fill rounded-full md:rounded-lg dark:hidden"
            alt="Documents"
          />
          <Image
            src="/documents-dark.jpg"
            fill
            className="object-fill rounded-full md:rounded-lg hidden dark:block"
            alt="Documents"
          />
        </div>
        <div className="relative h-[250px] w-[250px] hidden md:block">
          <Image
            src="/reading.jpg"
            fill
            className="object-fill rounded-lg dark:hidden"
            alt="Reading"
          />
          <Image
            src="/reading-dark.jpg"
            fill
            className="object-fill rounded-lg hidden dark:block"
            alt="Reading"
          />
        </div>
      </div>
    </div>
  );
};
