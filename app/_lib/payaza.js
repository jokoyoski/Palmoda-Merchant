const PAYAZA_SCRIPT_ID = "payaza-checkout-sdk";

const getPayazaScriptCandidates = () => {
  const envUrl = process.env.NEXT_PUBLIC_PAYAZA_SDK_URL;
  const candidates = [
    envUrl,
    "https://payaza.africa/js/v1/bundle.js",
    "https://dev.payaza.africa/js/v1/bundle.js",
  ].filter(Boolean);

  // Ensure unique URLs
  return Array.from(new Set(candidates));
};

export const loadPayazaSdk = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Payaza SDK can only be loaded in the browser"));
      return;
    }

    if (window.PayazaCheckout) {
      resolve(window.PayazaCheckout);
      return;
    }

    const tryLoad = (urls, idx) => {
      if (idx >= urls.length) {
        reject(
          new Error(
            "Failed to load Payaza SDK. Set NEXT_PUBLIC_PAYAZA_SDK_URL to a working bundle.js URL."
          )
        );
        return;
      }

      const url = urls[idx];
      const existing = document.getElementById(PAYAZA_SCRIPT_ID);
      if (existing) {
        existing.remove();
      }

      const script = document.createElement("script");
      script.id = PAYAZA_SCRIPT_ID;
      script.src = url;
      script.defer = true;
      script.onload = () => {
        if (window.PayazaCheckout) {
          resolve(window.PayazaCheckout);
        } else {
          script.remove();
          tryLoad(urls, idx + 1);
        }
      };
      script.onerror = () => {
        script.remove();
        tryLoad(urls, idx + 1);
      };

      document.head.appendChild(script);
    };

    const candidates = getPayazaScriptCandidates();
    if (candidates.length === 0) {
      reject(new Error("No Payaza SDK URL candidates configured"));
      return;
    }

    tryLoad(candidates, 0);
  });
};
