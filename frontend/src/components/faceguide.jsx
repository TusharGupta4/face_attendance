function FaceGuide({ status }) {
  const isReady = status === "Face Ready ✅";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className={`
          w-64
          h-80
          rounded-full
          border-4
          transition-all
          duration-300
          ${
            isReady
              ? "border-green-500"
              : "border-red-500"
          }
        `}
      />
    </div>
  );
}

export default FaceGuide;