export function captureImage(webcamRef) {
  return new Promise((resolve) => {
    const image = webcamRef.current.getScreenshot();
    resolve(image);
  });
}