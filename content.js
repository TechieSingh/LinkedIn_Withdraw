let count = 0;

function withdrawAllConnections() {
  function clickWithdrawButtons() {
    const buttons = document.querySelectorAll('button');
    let initialWithdrawn = false;

    buttons.forEach(button => {
      if (button.innerText.includes('Withdraw') && !button.disabled) {
        button.click();
        initialWithdrawn = true;
        console.log('Clicked withdraw button');

        setTimeout(() => {
          const confirmButtons = document.querySelectorAll('button');
          confirmButtons.forEach(confirmButton => {
            if (confirmButton.innerText.includes('Withdraw') && !confirmButton.disabled) {
              confirmButton.click();
              count++;
              console.log('Confirmed withdrawal');
              chrome.runtime.sendMessage({ action: 'updateCounter', count: count });
            }
          });

          setTimeout(clickWithdrawButtons, 2000); // Call clickWithdrawButtons again after a delay
        }, 2000); // Wait for the pop-up to appear and handle
      }
    });

    if (!initialWithdrawn) {
      console.log('No more Withdraw buttons found.');
      return;
    }
  }

  clickWithdrawButtons();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startWithdraw') {
    withdrawAllConnections();
  }
});
