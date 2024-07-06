document.getElementById('withdrawButton').addEventListener('click', () => {
  const days = parseInt(document.getElementById('daysInput').value);
  if (isNaN(days) || days < 0) {
    alert('Please enter a valid number of days');
    return;
  }

  // Display the entered value on the screen
  document.getElementById('enteredValue').innerText = `Withdrawing connections sent ${days} days ago`;
  console.log(`Sent ${days} days ago`);

  // Query the active tab and send a message to the content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "startWithdraw", days: days }, response => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError.message);
      } else {
        console.log('Message sent successfully:', response);
      }
    });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateCounter') {
    document.getElementById('counter').innerText = `Successful withdrawals: ${message.count}`;
  }
});
