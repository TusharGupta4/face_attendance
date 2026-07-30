import Webcam from "react-webcam";
import FaceGuide from "./faceguide";

function Camera({
  webcamRef,
  status,
}) {
  return (
    <div className="relative inline-block">

      <Webcam
        ref={webcamRef}
        mirrored
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-2xl"
      />

      <FaceGuide status={status} />

    </div>
  );
}

export default Camera;