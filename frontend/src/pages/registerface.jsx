import { useRef, useState } from "react";
import Camera from "../components/camera";
import FaceValidator from "../components/faceValidator";
function RegisterFace() {
  const webcamRef = useRef(null);

  const [status, setStatus] = useState("Waiting to start...");
  const [progress, setProgress] = useState(0);
const [scanning, setScanning] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-center mb-2">
          Register Face
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Follow the instructions on the screen.
        </p>

        <div className="flex justify-center mb-8">
          <Camera
  webcamRef={webcamRef}
  status={status}
/>
        </div>

        <FaceValidator
    webcamRef={webcamRef}
    scanning={scanning}
    onStatusChange={setStatus}
    onProgressChange={setProgress}
    onScanComplete={() => setScanning(false)}
/>

        <div className="bg-slate-100 rounded-xl p-5 mb-6">

          <h2 className="font-semibold text-lg">
            Status
          </h2>

          <p className="text-blue-600 mt-2">
            {status}
          </p>

        </div>

        <div className="mb-8">

          <div className="flex justify-between mb-2">

            <span className="font-medium">
              Progress
            </span>

            <span>
              {progress}/5
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">

            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(progress / 5) * 100}%`,
              }}
            />

          </div>

        </div>

        <button
  onClick={() => {
    setScanning(true);
    setStatus("Loading AI Model...");
    setScanning(true);
  }}
  disabled={scanning}
  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition"
>
  {scanning ? "Scanning..." : "Start Face Scan"}
</button>

      </div>

    </div>
  );
}

export default RegisterFace;