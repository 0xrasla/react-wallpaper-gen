import { createFileRoute } from "@tanstack/react-router";
import CanvasArt from "../components/CanvasArt";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 32,
      }}
    >
      <h1>Abstract Wallpaper Generator</h1>
      <CanvasArt width={512} height={512} />
    </div>
  );
}
