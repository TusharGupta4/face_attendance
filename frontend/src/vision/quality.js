export function analyzeFace(detection, video) {

    if (!detection) {
        return {
            ready: false,
            message: "No Face Detected ❌"
        };
    }

    const box = detection.boundingBox;

    const faceWidth = box.width;
    const faceHeight = box.height;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // -------- Face Size --------

    if (faceWidth < videoWidth * 0.25) {

        return {
            ready: false,
            message: "Move Closer 📷"
        };

    }

    // -------- Face Position --------

    const centerX = box.originX + faceWidth / 2;
    const centerY = box.originY + faceHeight / 2;

    const imageCenterX = videoWidth / 2;
    const imageCenterY = videoHeight / 2;

    const toleranceX = videoWidth * 0.15;
    const toleranceY = videoHeight * 0.15;

    if (
        Math.abs(centerX - imageCenterX) > toleranceX ||
        Math.abs(centerY - imageCenterY) > toleranceY
    ) {

        return {
            ready: false,
            message: "Center Your Face 🎯"
        };

    }

    return {
        ready: true,
        message: "Face Ready ✅"
    };

}