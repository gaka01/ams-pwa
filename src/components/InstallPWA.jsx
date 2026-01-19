import { useState, useEffect } from "react";
import './InstallPWA.css';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [hidePWA, setHidePWA] = useState(localStorage.getItem("hide-pwa-cta") === "true");

  useEffect(() => {
    const handler = event => {
      event.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(event);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function onClick(event) {
    event.preventDefault();
    if (!promptInstall) {
      return;
    }
    setHidePWA(true);
    promptInstall.prompt();
  };

  function onHideCTAClick() {
    setHidePWA(true);
    localStorage.setItem("hide-pwa-cta", "true");
  }

  return <>
    {!hidePWA && supportsPWA && <>
        <div className="install-cta inline-block-container">
            <p onClick={onClick}>Инсталирай като приложение 📥</p><span onClick={onHideCTAClick}>✕</span>
        </div>
    </>}
  </>;
};

export default InstallPWA;