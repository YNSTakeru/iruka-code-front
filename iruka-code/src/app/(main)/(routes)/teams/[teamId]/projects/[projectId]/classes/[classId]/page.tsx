'use client';

import { useEffect, useRef, useState } from 'react';

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rect, setRect] = useState({ x: 50, y: 50, width: 100, height: 100 });
  const [dragging, setDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }, [rect]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rectStart = { x: e.clientX - rect.x, y: e.clientY - rect.y };
    setStartDrag(rectStart);
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging) {
      const mouseX = e.clientX - startDrag.x;
      const mouseY = e.clientY - startDrag.y;
      setRect((prevRect) => ({ ...prevRect, x: mouseX, y: mouseY }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Page;
