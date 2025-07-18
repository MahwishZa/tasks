const textInput = document.getElementById('text-input');
const speakBtn = document.getElementById('speak-btn');
const voiceSelect = document.getElementById('voice-select');

let voices = [];

function populateVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name}`;
    voiceSelect.appendChild(option);
  });
}

// Load voices when available
speechSynthesis.onvoiceschanged = populateVoices;

speakBtn.addEventListener('click', () => {
  const text = textInput.value.trim();
  if (!text) {
    alert('Please enter some text to speak.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  speechSynthesis.speak(utterance);
})