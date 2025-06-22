import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useRef, useState } from "react";

function randomColor() {
  return `hsl(${Math.random() * 360}, 70%, 60%)`;
}

interface CanvasArtProps {
  width?: number;
  height?: number;
}

const CanvasArt: React.FC<CanvasArtProps> = ({ width = 512, height = 512 }) => {
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [numShapes, setNumShapes] = useState(20);
  const [numCurves, setNumCurves] = useState(8);
  const [curveThickness, setCurveThickness] = useState(5);
  const [noiseAmount, setNoiseAmount] = useState(0.08);
  const [overlayOpacity, setOverlayOpacity] = useState(0.12);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawCurves(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    for (let i = 0; i < numCurves; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      for (let j = 0; j < 2; j++) {
        const cp1x = Math.random() * width;
        const cp1y = Math.random() * height;
        const cp2x = Math.random() * width;
        const cp2y = Math.random() * height;
        const endx = Math.random() * width;
        const endy = Math.random() * height;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endx, endy);
      }
      ctx.strokeStyle = randomColor();
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;
      ctx.lineWidth = curveThickness;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(255,255,255,${overlayOpacity * 0.7})`);
    gradient.addColorStop(1, `rgba(0,0,0,${overlayOpacity})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawNoise(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    amount = 0.08
  ) {
    const imageData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 255 * amount;
      imageData.data[i] += noise;
      imageData.data[i + 1] += noise;
      imageData.data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);
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
    for (let i = 0; i < numShapes; i++) {
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
    drawCurves(ctx, width, height);
    drawOverlay(ctx, width, height);
    drawNoise(ctx, width, height, noiseAmount);
  }

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
  }, [
    canvasWidth,
    canvasHeight,
    bgColor,
    numShapes,
    numCurves,
    curveThickness,
    noiseAmount,
    overlayOpacity,
  ]);

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
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label>
          Width:
          <Input
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
          <Input
            type="number"
            min={64}
            max={4096}
            value={canvasHeight}
            onChange={(e) => setCanvasHeight(Number(e.target.value))}
            style={{ width: 80, margin: "0 8px" }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Background:
          <Input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ width: 40, height: 32 }}
          />
        </label>
      </div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ minWidth: 220 }}>
          <span>Abstract Shapes: {numShapes}</span>
          <Slider
            min={1}
            max={100}
            step={1}
            value={[numShapes]}
            onValueChange={([v]) => setNumShapes(v)}
          />
        </div>
        <div style={{ minWidth: 220 }}>
          <span>Waves/Curves: {numCurves}</span>
          <Slider
            min={0}
            max={32}
            step={1}
            value={[numCurves]}
            onValueChange={([v]) => setNumCurves(v)}
          />
        </div>
        <div style={{ minWidth: 220 }}>
          <span>Curve Thickness: {curveThickness}</span>
          <Slider
            min={1}
            max={32}
            step={1}
            value={[curveThickness]}
            onValueChange={([v]) => setCurveThickness(v)}
          />
        </div>
        <div style={{ minWidth: 220 }}>
          <span>Noise: {noiseAmount.toFixed(2)}</span>
          <Slider
            min={0}
            max={0.5}
            step={0.01}
            value={[noiseAmount]}
            onValueChange={([v]) => setNoiseAmount(v)}
          />
        </div>
        <div style={{ minWidth: 220 }}>
          <span>Overlay Opacity: {overlayOpacity.toFixed(2)}</span>
          <Slider
            min={0}
            max={0.5}
            step={0.01}
            value={[overlayOpacity]}
            onValueChange={([v]) => setOverlayOpacity(v)}
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid #ccc", marginBottom: 16 }}
      />
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <Button onClick={handleRegenerate} variant="outline">
          Regenerate
        </Button>
        <Button onClick={handleSave}>Save as PNG</Button>
      </div>
    </div>
  );
};

export default CanvasArt;
