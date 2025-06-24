//app.ts
import { clearPWAData } from './sw-stopper';

const logoElement = document.querySelector<HTMLImageElement>('.logo');

if (logoElement) {
  logoElement.addEventListener('click', () => {
    const confirmClear = window.confirm('Cache und Service Worker wirklich löschen?');
    if (confirmClear) {
      clearPWAData().catch(err => console.error('Fehler beim Löschen des Caches:', err));
    }
  });
} else {
  console.warn('Logo-Element wurde nicht gefunden!');
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}

type Word = {
  id: string;
  lessonID: string;
  germanWord: string;
  example: string;
  synonym: string;
  meaning: string;
};


const apiBase = "https://685888b2138a18086dfb2d6f.mockapi.io";
const lessonDropdown = document.getElementById('lesson-dropdown') as HTMLSelectElement;
const roundBtn = document.getElementById('round-btn') as HTMLButtonElement;
const hintBtn = document.getElementById('hint-btn') as HTMLButtonElement;
const hintBalloon = document.getElementById('hint-balloon') as HTMLDivElement;
const wordSummary = document.getElementById('german-word') as HTMLElement;
const wordDetails = document.getElementById('word-details') as HTMLDetailsElement;
const meaningDiv = document.getElementById('meaning') as HTMLDivElement;
const exampleDiv = document.getElementById('example-sentence') as HTMLDivElement;

let allWords: Word[] = [];
let words: Word[] = [];
let currentWordIndex = 0;
let hintTimeout: number | undefined;

// Fetch all lessons and populate dropdown
async function fetchLessons() {
  try {
    const res = await fetch(`${apiBase}/lessons`);
    allWords = await res.json();

    // Extract unique lessonIDs
    const lessonIDs = Array.from(new Set(allWords.map(word => word.lessonID)));

    // Populate dropdown
    lessonDropdown.innerHTML = '';
    lessonIDs.forEach(lessonID => {
      const opt = document.createElement('option');
      opt.value = lessonID;
      opt.textContent = lessonID;
      lessonDropdown.appendChild(opt);
    });

    // Load first lesson by default
    if (lessonIDs.length > 0) {
      loadLesson(lessonIDs[0]);
    }
  } catch (err) {
    console.error("Error fetching lessons:", err);
  }
}

function loadLesson(lessonID: string) {
  roundBtn.disabled = true;
  words = allWords.filter(word => word.lessonID === lessonID);
  currentWordIndex = 0;
  roundBtn.style.backgroundColor = '#fffbe7';
  showWord();
  roundBtn.disabled = false;
  roundBtn.style.backgroundColor = '#F57D1F';

}

function showWord() {
  if (!words.length) return;
  const word = words[currentWordIndex];
  wordSummary.textContent = word.germanWord;
  exampleDiv.textContent = word.example;
  meaningDiv.textContent = word.meaning;
  wordDetails.open = false;
  meaningDiv.style.display = 'none';
}

function showHint() {
  if (!words.length) return;
  const word = words[currentWordIndex];
  hintBalloon.textContent = word.synonym;
  hintBalloon.hidden = false;
  clearTimeout(hintTimeout);
  hintTimeout = window.setTimeout(() => {
    hintBalloon.hidden = true;
  }, 2500);
}

function showMeaning() {
  meaningDiv.style.display = 'block';
}

function nextWord() {
  if (!words.length) return;
  currentWordIndex = (currentWordIndex + 1) % words.length;
  showWord();
}

// Event Listeners
lessonDropdown.addEventListener('change', () => {
  loadLesson(lessonDropdown.value);
});

roundBtn.addEventListener('click', () => {
  nextWord(); // <--- CHANGED: show next word in the lesson
});

hintBtn.addEventListener('click', () => {
  showHint();
});

wordSummary.addEventListener('click', () => {
  showMeaning();
});

// On load
fetchLessons();
