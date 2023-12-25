enum AppMessageType {
  SHOW_TOAST = 'showToast',
}

interface AppMessage {
  type: AppMessageType;
  payload: ShowToastPayload;
}

interface ShowToastPayload {
  message: string;
}

const TOAST_LIFETIME_MS = 3000;

chrome.runtime.onMessage.addListener((msg: AppMessage, sender, sendResponse) => {
  if (msg.type === 'showToast' && typeof msg.payload.message !== 'undefined') {
    showToast(msg.payload.message);
  }
  return true;
});

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.padding = '15px 25px'; // Increased padding
  toast.style.color = '#fff'; // White text
  toast.style.backgroundColor = '#323232'; // Dark grey background
  toast.style.borderRadius = '5px'; // Rounded corners
  toast.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)'; // Shadow for depth
  toast.style.fontFamily = 'Arial, sans-serif'; // Font family
  toast.style.fontSize = '16px'; // Font size
  toast.style.zIndex = '10000'; // Ensure it appears above other elements
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, TOAST_LIFETIME_MS);
}
