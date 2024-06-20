document.getElementById('withdrawButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: withdrawAllConnections
      });
    });
  });
  
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
                console.log('Confirmed withdrawal');
              }
            });
  
            setTimeout(clickWithdrawButtons, 500); // Call clickWithdrawButtons again after a delay
          }, 500); // Wait for the pop-up to appear and handle
        }
      });
  
      if (!initialWithdrawn) {
        console.log('No more Withdraw buttons found.');
        return;
      }
    }
  
    clickWithdrawButtons();
  }
  