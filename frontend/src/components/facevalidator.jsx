import { useEffect, useRef } from "react";
import { analyzeFace } from "../vision/quality";
import { loadDetector, detectFace } from "../vision/detector";
import { registerFace } from "../services/face";
import { base64ToFile } from "../utils/base64ToFile";

function FaceValidator({ webcamRef, scanning, onStatusChange , onProgressChange, onScanComplete }) {
  const capturedImages = useRef([]);
  const isCapturing = useRef(false);
  const isUploading = useRef(false);

  useEffect(() => {
    if (!scanning) return;
    let interval;

    async function initialize() {
      try {
        onStatusChange("Loading AI Model...");

        await loadDetector();

        onStatusChange("Looking for face...");

        interval = setInterval(async () => {
          if (!webcamRef.current) return;

          const video = webcamRef.current.video;

          if (!video || video.readyState !== 4) return;

          const result = await detectFace(video);

          // No face
          if (!result || result.detections.length === 0) {
            onStatusChange("No Face Detected ❌");
            return;
          }

          // Multiple faces
          if (result.detections.length > 1) {
            onStatusChange("Only One Face Allowed 🚫");
            return;
          }

          // Analyze face
          const analysis = analyzeFace(
            result.detections[0],
            video
          );

        if (!isCapturing.current && !isUploading.current) {
  onStatusChange(analysis.message);
}

          // Don't capture if face isn't ready
          if (!analysis.ready) return;

          // Prevent duplicate captures
          if (
            isCapturing.current ||
            isUploading.current ||
            capturedImages.current.length >= 5
          ) {
            return;
          }

          isCapturing.current = true;

          setTimeout(async () => {
            try {
              const image = webcamRef.current?.getScreenshot();

              if (!image) {
                isCapturing.current = false;
                return;
              }

              capturedImages.current.push(image);

              const total = capturedImages.current.length;

              onProgressChange(total);

              onStatusChange(`Captured ${total}/5 📸`);

              // Upload after 5 images
              if (total === 5) {
                isUploading.current = true;

                onStatusChange("Uploading Face...");

                const files = capturedImages.current.map(
                  (img, index) =>
                    base64ToFile(img, `face_${index + 1}.jpg`)
                );

                await registerFace(files);

                clearInterval(interval);

                onProgressChange(5);

                onStatusChange(
                  "Face Registered Successfully 🎉"
                );

                // Reset for future registrations
                capturedImages.current = [];

                onScanComplete();
              }
            } catch (error) {
              console.error(error);

              onStatusChange(
                "Face Registration Failed ❌"
              );

              // Allow retry
              capturedImages.current = [];
            } finally {
              isCapturing.current = false;
              isUploading.current = false;
            }
          }, 1500);
        }, 200);
      } catch (error) {
        console.error(error);
        onStatusChange("Failed to load AI Model ❌");
      }
    }

    initialize();

    return () => {
      if (interval) clearInterval(interval);
    };
}, [scanning, webcamRef, onStatusChange, onProgressChange]);

  return null;
}

export default FaceValidator;