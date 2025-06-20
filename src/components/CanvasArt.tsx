import React, { useEffect, useRef, useState } from "react";

function randomColor() {
  return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

function drawAbstractArt(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgColor: string
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    for (let j = 0; j < 5; j++) {
      ctx.lineTo(Math.random() * width, Math.random() * height);
    }
    ctx.closePath();
    ctx.fillStyle = randomColor();
    ctx.globalAlpha = 0.5 + Math.random() * 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

interface CanvasArtProps {
  width?: number;
  height?: number;
}

const CanvasArt: React.FC<CanvasArtProps> = ({ width = 512, height = 512 }) => {
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) drawAbstractArt(ctx, canvasWidth, canvasHeight, bgColor);
    }
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [canvasWidth, canvasHeight, bgColor]);

  const handleRegenerate = () => {
    draw();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "abstract-wallpaper.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: 16 }}>
        <label>
          Width:
          <input
            type="number"
            min={64}
            max={4096}
            value={canvasWidth}
            onChange={(e) => setCanvasWidth(Number(e.target.value))}
            style={{ width: 80, margin: "0 8px" }}
          />
        </label>
        <label>
          Height:
          <input
            type="number"
            min={64}
            max={4096}
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            style={{ width: 80, margin: "0 8px" }}
          />
        </label>
        <label>
          Background:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid #ccc", marginBottom: 16 }}
      />
      <div>
        <button onClick={handleRegenerate} style={{ marginRight: 8 }}>
          Regenerate
        </button>
        <button onClick={handleSave}>Save as PNG</button>
      </div>
    </div>
  );
};

export default CanvasArt;
