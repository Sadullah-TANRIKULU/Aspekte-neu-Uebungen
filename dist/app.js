"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
}
const apiBase = "https://685888b2138a18086dfb2d6f.mockapi.io";
const lessonDropdown = document.getElementById('lesson-dropdown');
const roundBtn = document.getElementById('round-btn');
const hintBtn = document.getElementById('hint-btn');
const hintBalloon = document.getElementById('hint-balloon');
const wordSummary = document.getElementById('german-word');
const wordDetails = document.getElementById('word-details');
const meaningDiv = document.getElementById('meaning');
const exampleDiv = document.getElementById('example-sentence');
let allWords = [];
let words = [];
let currentWordIndex = 0;
let hintTimeout;
// Fetch all lessons and populate dropdown
function fetchLessons() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${apiBase}/lessons`);
            allWords = yield res.json();
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
        }
        catch (err) {
            console.error("Error fetching lessons:", err);
        }
    });
}
function loadLesson(lessonID) {
    roundBtn.disabled = true;
    words = allWords.filter(word => word.lessonID === lessonID);
    currentWordIndex = 0;
    roundBtn.style.backgroundColor = '#fffbe7';
    showWord();
    roundBtn.disabled = false;
    roundBtn.style.backgroundColor = '#F57D1F';
}
function showWord() {
    if (!words.length)
        return;
    const word = words[currentWordIndex];
    wordSummary.textContent = word.germanWord;
    exampleDiv.textContent = word.example;
    meaningDiv.textContent = word.meaning;
    wordDetails.open = false;
    meaningDiv.style.display = 'none';
}
function showHint() {
    if (!words.length)
        return;
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
    if (!words.length)
        return;
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
