document.getElementById('withdrawButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "startWithdraw" });
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateCounter') {
      document.getElementById('counter').innerText = `Successful withdrawals: ${message.count}`;
    }
  });
  