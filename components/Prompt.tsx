"use client";

import { useEffect, useState } from "react";

const Prompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobileDevice) {
      setShowPrompt(true);
    }
  }, []);

  const openApp = () => {
    const androidAppLink = "https://tr.ee/yoehiCxFLQ";
    const iosAppLink = "https://apps.apple.com/us/app/aio-events/id6475737908";


    window.location.href = navigator.userAgent.match(/iPhone|iPad|iPod/i)
      ? iosAppLink
      : androidAppLink;


    setTimeout(() => {
      window.location.href = navigator.userAgent.match(/iPhone|iPad|iPod/i)
        ? "https://apps.apple.com/us/app/aio-events/id6475737908" 
        : "https://play.google.com/store/apps/details?id=com.aio.aioevents&hl=en"; 
    }, 500);
  };

  const continueOnBrowser = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-md flex justify-center items-end p-4">
      <div className="bg-background rounded-2xl shadow-lg p-6 text-center w-full max-w-sm">
        <p className="text-lg font-semibold text-foreground mb-4">
          Would you like to open the app for better experience ?
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={openApp}
            className="bg-main text-foreground px-4 py-2 rounded-lg w-full hover:bg-main/90 transition"
          >
            Open App
          </button>
          <button
            onClick={continueOnBrowser}
            className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg w-full hover:bg-gray-300 transition"
          >
            Continue on Browser
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
