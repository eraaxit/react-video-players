import YT from "./components/players/YT";

function App() {
  return (
    <div>
      <YT
        sourceUrl="https://res.cloudinary.com/duckchat/video/upload/v1637597453/samples/sea-turtle.mp4"
        createObjectUrl={true}
      />
    </div>
  );
}

export default App;

//TODO: Do setup EsLint & Prettier
