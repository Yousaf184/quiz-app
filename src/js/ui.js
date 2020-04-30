import { shuffleArray, getAltOptions, getOptionListItems } from './utils';
import quizImages from './images';

export const quizImagesContainerClass = 'quiz-images-container';

export const $currentImageCountElem = document.getElementsByClassName('totalImagesCount')[0];
export const $restartQuizBtn = document.getElementById('restart-quiz-btn');
export const $quizImagesContainer = document.getElementsByClassName('quiz-images-container')[0];
export const $optionsContainer = document.getElementsByClassName('options')[0];
export const $settingsBtn = document.getElementsByClassName('settings-btn')[0];
export const $modalContainer = document.getElementsByClassName('modal-container-backdrop')[0];
export const $speechspeedOptions = document.getElementsByTagName('select')[0];
export const $infoText = document.getElementsByClassName('info-text')[0];
export const $userAnswer = document.getElementById('user-answer');
const $quizStartBtn = document.getElementById('start-quiz-btn');
const $startupModalContainer = document.getElementsByClassName('startup-modal-backdrop')[0];

// icon
import iconSpeak from '../assets/icons/ic_speak.png';
// images
import buffalo from '../assets/img/buffalo.jpg';
import cat from '../assets/img/cat.jpg';
import chimpanzee from '../assets/img/chimpanzee.jpg';
import cow from '../assets/img/cow.jpg';
import crocodile from '../assets/img/crocodile.jpg';
import dolphin from '../assets/img/dolphin.jpg';
import eagle from '../assets/img/eagle.jpg';
import fox from '../assets/img/fox.jpg';
import giraffe from '../assets/img/giraffe.jpg';
import horse from '../assets/img/horse.jpg';
import leopard from '../assets/img/leopard.jpg';
import lion from '../assets/img/lion.jpg';
import monkey from '../assets/img/monkey.jpg';
import parrot from '../assets/img/parrot.jpg';
import penguin from '../assets/img/penguin.jpg';
import rabbit from '../assets/img/rabbit.jpg';
import sheep from '../assets/img/sheep.jpg';
import squirrel from '../assets/img/squirrel.jpg';
import tiger from '../assets/img/tiger.jpg';
import wolf from '../assets/img/wolf.jpg';

// event listeners
export function addEventListenersOnUiElements(quiz, speech) {
    $quizStartBtn.addEventListener('click', () => {
        $startupModalContainer.classList.add('hide-startup-modal');
    });

    $modalContainer.addEventListener('click', hideModal);

    $speechspeedOptions.addEventListener('change', (e) => {
        speech.speechSpeed = quiz.speechSpeeds[e.target.value];
    });

    $optionsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && !speech.currentlySpeaking) {
            speech.speakWord(e.target.parentElement.textContent);
        }
    });

    $settingsBtn.addEventListener('click', () => {
        $modalContainer.classList.add('display-modal');
    });

    $restartQuizBtn.addEventListener('click', () => {
        window.location.reload();
    });
}

export function addQuizImagesInDOM() {
    let allOptions = [];
    quizImages.forEach(image => allOptions.push(image.correctAnswer));

    const shuffledQuizImages = shuffleArray(quizImages);

    // add 3 options with each image and add that markup in the DOM
    let divTag, imageTag;
    shuffledQuizImages.forEach(image => {
        image.altOptions = getAltOptions(allOptions, image.correctAnswer);

        divTag = document.createElement('div');

        imageTag = document.createElement('img');
        imageTag.setAttribute('src', `/dist/assets/img/${image.name}`);

        divTag.appendChild(imageTag);
        $quizImagesContainer.appendChild(divTag);
    });
}

export function displayInfoText(text) {
    $infoText.textContent = text;
    $infoText.style.display = 'block';
}

export function hideInfoText() {
    $infoText.style.display = 'none';
}

export function correctUserAnswer() {
    $userAnswer.classList.remove('wrong-user-answer');
    $userAnswer.classList.add('correct-user-answer');
}

export function wrongUserAnswer() {
    $userAnswer.classList.add('wrong-user-answer');
    $userAnswer.classList.remove('correct-user-answer');
}

export function incrementImageCount(quiz, totalImages) {
    quiz.incrementCurrentImageCount();
    updateImageCountInDOM(quiz.quizInfo.currentImageCount, totalImages);
}

function updateImageCountInDOM(currentImageCount, totalImages) {
    $currentImageCountElem.textContent = `Image: ${currentImageCount} / ${totalImages}`;
}

export function showImageCountInDOM(currentImageCount, totalImages) {
    updateImageCountInDOM(currentImageCount, totalImages);
}

function hideModal(e) {
    if (e.target === $modalContainer || e.target.classList.contains('modal-close-btn')) {
        $modalContainer.classList.remove('display-modal');
    }
}

export function displayImageOptions(image) {
    const options = shuffleArray([image.correctAnswer, ...image.altOptions]);

    getOptionListItems($optionsContainer).forEach((liItem, index) => {
        liItem.innerHTML = options[index] + `<img src=${iconSpeak}>`;
    });
}

