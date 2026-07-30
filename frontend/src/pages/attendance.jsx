import { useRef, useState } from "react";
import Camera from "../components/Camera";
import { checkIn, checkOut } from "../services/attendance";
import { base64ToFile } from "../utils/base64ToFile";

function Attendance() {
  const webcamRef = useRef(null);

  const [status, setStatus] = useState("Ready");
  const [similarity, setSimilarity] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setStatus("Capturing Image...");

      const image = webcamRef.current?.getScreenshot();

      if (!image) {
        setStatus("Failed to capture image.");
        return;
      }

      const file = base64ToFile(image, "attendance.jpg");

      setStatus("Verifying Face...");

      const response = await checkIn(file);

      setSimilarity(response.similarity);
      setStatus(response.message);

    } catch (error) {
      console.error(error);

      setStatus(
        error.response?.data?.detail ||
        "Check In Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      setStatus("Capturing Image...");

      const image = webcamRef.current?.getScreenshot();

      if (!image) {
        setStatus("Failed to capture image.");
        return;
      }

      const file = base64ToFile(image, "attendance.jpg");

      setStatus("Verifying Face...");

      const response = await checkOut(file);

      setSimilarity(response.similarity);
      setStatus(response.message);

    } catch (error) {
      console.error(error);

      setStatus(
        error.response?.data?.detail ||
        "Check Out Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-center mb-2">
          Face Attendance
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Verify your face to mark attendance.
        </p>

        <div className="flex justify-center mb-8">
          <Camera webcamRef={webcamRef} />
        </div>

        <div className="bg-slate-100 rounded-xl p-5 mb-6">

          <h2 className="font-semibold text-lg">
            Status
          </h2>

          <p className="text-blue-600 mt-2">
            {status}
          </p>

          {similarity !== null && (
            <p className="mt-2 font-medium">
              Similarity : {(similarity * 100).toFixed(2)}%
            </p>
          )}

        </div>

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Processing..." : "Check In"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Processing..." : "Check Out"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Attendance;