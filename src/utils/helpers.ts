export const throwPlayerPropsError = () => {
  throw new Error("sourceUrl prop must be passed into a player component.");
};

export const logger = (a: string) => {
  const mssg = "[react-video-players] error in fetching video - " + a;
  console.log(mssg);
};
