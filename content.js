console.log('Content script loaded');

let count = 0;

function withdrawAllConnections(days) {
  const dateStr = convertDaysToDateStr(days);

  function convertDaysToDateStr(days) {
    if (days === 0) {
      return 'Sent today';
    } else if (days === 1) {
      return 'Sent yesterday';
    } else if (days < 7) {
      return `Sent ${days} days ago`;
    } else if (days >= 7) {
      return 'Sent 1 week ago';
    } else if (days < 30) {
      return `Sent ${days} days ago`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `Sent ${months} ${months > 1 ? 'months' : 'month'} ago`;
    } else {
      const years = Math.floor(days / 365);
      return `Sent ${years} ${years > 1 ? 'years' : 'year'} ago`;
    }
  }

  function clickWithdrawButtons() {
    const invitationCards = document.querySelectorAll('.invitation-card');
    let initialWithdrawn = false;

    invitationCards.forEach(card => {
      const sentStatus = card.querySelector('.time-badge')?.innerText.trim();
      const withdrawButton = card.querySelector('.invitation-card__action-btn');

      if (sentStatus && sentStatus.includes(dateStr) && withdrawButton && !withdrawButton.disabled) {
        withdrawButton.click();
        initialWithdrawn = true;
        console.log(`Clicked withdraw button for invitation ${dateStr}.`);

        setTimeout(() => {
          const confirmButtons = document.querySelectorAll('button');
          confirmButtons.forEach(confirmButton => {
            if (confirmButton.innerText.includes('Withdraw') && !confirmButton.disabled) {
              confirmButton.click();
              count++;
              console.log('Confirmed withdrawal');
              try {
                chrome.runtime.sendMessage({ action: 'updateCounter', count: count }, response => {
                  if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError.message);
                  } else {
                    console.log('Message sent successfully:', response);
                  }
                });
              } catch (error) {
                console.error('Error sending message:', error);
              }
            }
          });

          setTimeout(clickWithdrawButtons, 2000); // Call clickWithdrawButtons again after a delay
        }, 2000); // Wait for the pop-up to appear and handle
      }
    });

    if (!initialWithdrawn) {
      console.log(`No more Withdraw buttons found for invitations ${dateStr}.`);
      return;
    }
  }

  clickWithdrawButtons();
}

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startWithdraw') {
    console.log('Received startWithdraw message');
    withdrawAllConnections(message.days);
    sendResponse({ status: 'started' });
  }
  return true; // Keeps the message channel open for sendResponse
});
