chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateCounter') {
      console.log(`Withdrawn count: ${message.count}`);
      sendResponse({status: 'success'});
    }
    return true; // Keeps the message channel open for sendResponse
  });
  