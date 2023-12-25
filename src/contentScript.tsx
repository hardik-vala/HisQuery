enum AppMessageType {
  SHOW_TOAST = "showToast",
}

interface AppMessage {
  type: AppMessageType;
  payload: ShowToastPayload;
}

interface ShowToastPayload {
  message: string;
}

const TOAST_LIFETIME_MS = 2000;

chrome.runtime.onMessage.addListener(
  (msg: AppMessage, sender, sendResponse) => {
    if (
      msg.type === "showToast" &&
      typeof msg.payload.message !== "undefined"
    ) {
      showToast(msg.payload.message);
    }
    return true;
  }
);

function showToast(message: string) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.padding = "15px 25px";
  toast.style.color = "#EFF2FD"; // Based on whiteAlpha.900
  toast.style.backgroundColor = "#152536"; // Based on gray.900
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.1)";
  toast.style.fontFamily =
    'Schibsted Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  toast.style.fontSize = "16px";
  toast.style.zIndex = "10000";
  toast.style.opacity = "0"; // Start with opacity 0 for fade in
  toast.style.transition = "opacity 0.25s ease-in-out"; // Transition for fade in/out
  toast.textContent = message;
  document.body.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 100); // Small delay before starting the fade in

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = "0";
    // Remove the element after the transition ends
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 250); // Match this delay with the duration of the transition
  }, TOAST_LIFETIME_MS);
}
