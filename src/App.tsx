import React from "react";
import YT from "./components/players/YT";

const App: React.FC = () => {
  return (
    <div>
      <YT
        sourceUrl="https://res.cloudinary.com/duckchat/video/upload/v1643380625/samples/animals/wwe-post-CZP3D6WNfE9_iubony.mp4"
        createUrl={true}
        videoSeekerColor="#cc181e"
        controlColor="white"
      />
    </div>
  );
};

export default App;
