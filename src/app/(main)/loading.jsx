import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-4 text-lg">Loading portfolio...</p>
      </div>
    </div>
  );
};

export default Loading;
