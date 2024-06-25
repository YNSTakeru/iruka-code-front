'use client';

import { useEffect, useRef } from 'react';

const Page = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current! as HTMLCanvasElement;
    const context = canvas.getContext('2d')! as CanvasRenderingContext2D;

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      drawRectangle(context, x, y);
    });
  }, []);

  const drawRectangle = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) => {
    const width = 100;
    const height = 50;
    context.fillStyle = 'blue';
    context.fillRect(x - width / 2, y - height / 2, width, height);
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default Page;
