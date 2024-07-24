import React from "react";

const ImageMessage = ({ imageData }: { imageData: string }): JSX.Element => {
  return (
    <>
      {/* Render the image using an img tag */}
      <img src={`data:image/png;base64,${imageData}`} alt="Image" />
    </>
  );
};

export default ImageMessage;
