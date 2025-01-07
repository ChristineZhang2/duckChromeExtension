// Create the duck element
const duck = document.createElement('img');
duck.src = chrome.runtime.getURL('duck.png');
duck.style.position = 'fixed';
duck.style.zIndex = '9999';
duck.style.width = '50px';
duck.style.height = 'auto';
duck.style.transition = 'left 0.5s, top 0.5s';

// Create the quack sound
const quack = new Audio(chrome.runtime.getURL('quack.mp3'));

// Create typing sounds
const typingSounds = [
  new Audio(chrome.runtime.getURL('type1.mp3')),
  new Audio(chrome.runtime.getURL('type2.mp3')),
  new Audio(chrome.runtime.getURL('type3.mp3'))
];

// Add the duck to the page
document.body.appendChild(duck);

// Function to move the duck
function moveDuck(x, y) {
  duck.style.left = `${x}px`;
  duck.style.top = `${y}px`;
}

// Function to make the duck follow the cursor
function followCursor(e) {
  moveDuck(e.clientX, e.clientY);
}

// Function to start following the cursor
function startFollowing() {
  document.addEventListener('mousemove', followCursor);
  setTimeout(stopFollowing, 3000); // Follow for 3 seconds
}

// Function to stop following the cursor
function stopFollowing() {
  document.removeEventListener('mousemove', followCursor);
}

// Function to manipulate the screen
function manipulateScreen() {
  const effect = Math.floor(Math.random() * 3);
  switch(effect) {
    case 0:
      document.body.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
      setTimeout(() => document.body.style.transform = '', 2000);
      break;
    case 1:
      document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
      setTimeout(() => document.body.style.filter = '', 2000);
      break;
    case 2:
      document.body.style.transition = 'all 1s';
      document.body.style.transform = 'scale(0.95)';
      setTimeout(() => {
        document.body.style.transform = '';
        setTimeout(() => document.body.style.transition = '', 1000);
      }, 1000);
      break;
  }
}

// Function to play typing sound
function playTypingSound() {
  const sound = typingSounds[Math.floor(Math.random() * typingSounds.length)];
  sound.currentTime = 0;
  sound.play();
}

// Function to type random messages
function typeRandomMessage() {
  const messages = [
    "Quack quack!",
    "Christine is amazing1",
    "I'm a duck, not a chicken!",
    "Ella Mcritchie is so Cute",
    "Duck and cover!",
    "Got any grapes?",
    "Waddle waddle",
    "Christine rules, Ella drools",
    "Feather weather",
    "Just keep swimming"
  ];
  const message = messages[Math.floor(Math.random() * messages.length)];

  // Find search input
  const searchInputs = document.querySelectorAll('input[type="search"], input[type="text"][name*="search"], input[type="text"][id*="search"]');
  let targetInput = searchInputs[0];

  // If no search input found, try to find any text input
  if (!targetInput) {
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    targetInput = textInputs[0];
  }

  // If an input is found, type the message
  if (targetInput) {
    targetInput.focus();
    // Move duck to input
    const rect = targetInput.getBoundingClientRect();
    moveDuck(rect.left + rect.width / 2, rect.top - 60);

    // Type the message with sound
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < message.length) {
        targetInput.value += message[i];
        playTypingSound();
        i++;
      } else {
        clearInterval(typeInterval);
        // Trigger input event to simulate user typing
        const inputEvent = new Event('input', { bubbles: true });
        targetInput.dispatchEvent(inputEvent);
      }
    }, 100);
  } else {
    // If no input found, copy to clipboard
    const textArea = document.createElement('textarea');
    textArea.value = message;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

// Duck behavior function
function duckBehavior() {
  const action = Math.random();
  if (action < 0.4) { // 40% chance to type a message
    typeRandomMessage();
  } else if (action < 0.7) { // 30% chance to manipulate the screen
    manipulateScreen();
  } else if (action < 0.9) { // 20% chance to follow the cursor
    startFollowing();
  } else { // 10% chance to move randomly
    moveDuck(Math.random() * (window.innerWidth - 50), Math.random() * (window.innerHeight - 50));
  }
}

// Execute duck behavior every 5 seconds
setInterval(duckBehavior, 5000);

// Make the duck quack when clicked
duck.addEventListener('click', () => {
  quack.play();
});
