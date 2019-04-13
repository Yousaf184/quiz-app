(function () {

const correctAnswersCountElem = document.getElementsByClassName('correctAnswersCount')[0];
const wrongAnswersCountElem = document.getElementsByClassName('wrongAnswersCount')[0];
const currentImageCountElem = document.getElementsByClassName('totalImagesCount')[0];
const resultPercentageElem = document.getElementsByClassName('resultInPercentage')[0];
const infoText = document.getElementsByClassName('info-text')[0];
const restartQuizBtn = document.getElementsByClassName('restart-quiz-btn')[0];
const quizImagesContainer = document.getElementsByClassName('quiz-images-container')[0];
const optionsContainer = document.getElementsByClassName('options')[0];
const settingsBtn = document.getElementsByClassName('settings-btn')[0];
const modalContainer = document.getElementsByClassName('modal-container-backdrop')[0];
const radioBtnCompleteWord = document.getElementById('radio-btn-complete-word');
const speechspeedOptions = document.getElementsByTagName('select')[0];

const speechSpeeds = {
    slow: 0.6,
    medium: 1,
    fast: 1.5
};

let speechSpeed = speechSpeeds.slow;

// true when computer is speaking the word or its spellings
// will be used to block user from trying to listen to another option
// while computer is speaking
let currentlySpeaking = false;

let images = [
    {name: 'eagle.jpg', correctAnswer: 'Eagle'},
    {name: 'cat.jpg', correctAnswer: 'Cat'},
    {name: 'chimpanzee.jpg', correctAnswer: 'Chimpanzee'},
    {name: 'cow.jpg', correctAnswer: 'Cow'},
    {name: 'crocodile.jpg', correctAnswer: 'Crocodile'},
    {name: 'dolphin.jpg', correctAnswer: 'Dolphin'},
    {name: 'fox.jpg', correctAnswer: 'Fox'},
    {name: 'buffalo.jpg', correctAnswer: 'Buffalo'},
    {name: 'leopard.jpg', correctAnswer: 'Leopard'},
    {name: 'lion.jpg', correctAnswer: 'Lion'},
    {name: 'parrot.jpg', correctAnswer: 'Parrot'},
    {name: 'penguin.jpg', correctAnswer: 'Penguin'},
    {name: 'rabbit.jpg', correctAnswer: 'Rabbit'},
    {name: 'sheep.jpg', correctAnswer: 'Sheep'},
    {name: 'squirrel.jpg', correctAnswer: 'Squirrel'},
    {name: 'tiger.jpg', correctAnswer: 'Tiger'},
    {name: 'monkey.jpg', correctAnswer: 'Monkey'},
    {name: 'horse.jpg', correctAnswer: 'Horse'},
    {name: 'giraffe.jpg', correctAnswer: 'Giraffe'},
    {name: 'wolf.jpg', correctAnswer: 'Wolf'}
];

let allOptions = [];
images.forEach(image => allOptions.push(image.correctAnswer));

images = shuffleArray(images);

let divTag, imageTag;
images.forEach(image => {
    image.altOptions = getAltOptions(allOptions, image.correctAnswer);

    divTag = document.createElement('div');

    imageTag = document.createElement('img');
    imageTag.setAttribute('src', `./img/${image.name}`);

    divTag.appendChild(imageTag);
    quizImagesContainer.appendChild(divTag);
});

//display first image options
displayImageOptions(images[0]);

$(document).ready(function() {
    $('.quiz-images-container').slick({
        arrows: false,
        draggable: false,
        touchMove: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false
    });
});

restartQuizBtn.addEventListener('click', () => {
    window.location.reload();
});

optionsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG' && !currentlySpeaking) {
        // speak complete word
        if (radioBtnCompleteWord.checked) {
            speakWord(e.target.parentElement.textContent);
        } else {
            // speak spellings
            const letters = e.target.parentElement.textContent.replace(' ', '').split('');
            speakWord(letters);
        }
    }
});

settingsBtn.addEventListener('click', () => {
    modalContainer.classList.add('display-modal');
});

modalContainer.addEventListener('click', hideModal);

speechspeedOptions.addEventListener('change', (e) => {
    speechSpeed = speechSpeeds[e.target.value];
});

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const totalNumberOfImages = images.length;

let shouldStopListening = false;

let countCorrectAnswers = 0;
let countWrongAnswers = 0;
let countCurrentImage = 1;
let currentImageIndex = 0;
let wrongTries = 0;

// regex to test whether complete word was spoken
// or word spellings were spoken
// if spellings are spoken, speech recognition will
// return result with space added between each letter
const regex = /^[A-Za-z](\s[A-Za-z])+$/;

let recognition = null;

currentImageCountElem.textContent = `Image: ${countCurrentImage}/${totalNumberOfImages}`;

if ('SpeechRecognition' in window) {

    recognition = new window.SpeechRecognition();
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        if (event.results[0].isFinal) {
            let speechToText = event.results[0][0].transcript;

            // if regex matches, spellings were spoken instead of complete word
            if (regex.test(speechToText) && radioBtnCompleteWord.checked) {
                displayInfoText('speak complete word');
                return;
            } else if (!regex.test(speechToText) && !radioBtnCompleteWord.checked) {
                displayInfoText('speak word spellings');
                return;
            }

            hideInfoText();

            // remove spaces between letters if spellings were spoken
            if (regex.test(speechToText) && !radioBtnCompleteWord.checked) {
                speechToText = speechToText.replace(/\s+/g, '').toLowerCase().trim();
            }

            const areEqual = speechToText === images[currentImageIndex].correctAnswer.toLowerCase().trim();

            if (areEqual) {
                $('.quiz-images-container').slick('slickNext');

                correctAnswersCountElem.textContent = `Correct Answers = ${++countCorrectAnswers}`;
                currentImageCountElem.textContent = `Image: ${++countCurrentImage}/${totalNumberOfImages}`;

                currentImageIndex++;
                wrongTries = 0;

                hideInfoText();
            }
            else if (!areEqual) {
                wrongTries++;

                if (wrongTries === 3) {
                    hideInfoText();

                    alert('Correct answer: ' + images[currentImageIndex].correctAnswer);

                    $('.quiz-images-container').slick('slickNext');

                    wrongAnswersCountElem.textContent = `Wrong Answers = ${++countWrongAnswers}`;
                    currentImageCountElem.textContent = `Image: ${++countCurrentImage}/${totalNumberOfImages}`;

                    wrongTries = 0;
                    currentImageIndex++;
                } else {
                    displayInfoText('try again')
                }
            }

            shouldQuizEnd();

            if (currentImageIndex < images.length) {
                displayImageOptions(images[currentImageIndex]);
            }
        }
    }

    recognition.onend = (event) => {
        // restart speech recognition service in case it ends
        // to prevent it from stop listening
        if (!shouldStopListening) {
            recognition.start();
        }
    };

    recognition.start();
} else {
    alert('Speech recognition not supported in your browser');
}

function hideModal(e) {
    if (e.target === modalContainer || e.target.classList.contains('modal-close-btn')) {
        modalContainer.classList.remove('display-modal');
    }
}

function shouldQuizEnd() {
    if (currentImageIndex === totalNumberOfImages) {
        $('quiz-container').slick('unslick');

        currentImageCountElem.style.display = 'none';
        quizImagesContainer.style.display = 'none';
        optionsContainer.style.display = 'none';

        resultPercentageElem.textContent = `Result = ${(countCorrectAnswers / totalNumberOfImages) * 100}%`;
        resultPercentageElem.style.display = 'inline-block';

        restartQuizBtn.style.display = 'inline-block';

        shouldStopListening = true;
        recognition.stop();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function displayImageOptions(image) {
    const options = shuffleArray([image.correctAnswer, ...image.altOptions]);

    getOptionListItems().forEach((liItem, index) => {
        liItem.innerHTML = options[index] + '<img src="./ic_speak.png" alt="speaker icon">';
    });
}

// returns li tags in an array
// li tags are used to display options
function getOptionListItems() {
    const liTagsArr = [];
    const childrenArr = Array.from(optionsContainer.children);

    childrenArr.forEach((child) => {
        if (child.tagName === 'LI') {
            liTagsArr.push(child);
        }
    });

    return liTagsArr;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function displayInfoText(text) {
    infoText.textContent = text;
    infoText.style.display = 'block';
}

function hideInfoText() {
    infoText.style.display = 'none';
}

// returns random alternative wrong options
// chooses random options from the options array after excluding the correct option for a given array
function getAltOptions(optionsArr, correctOption) {
    const randomOptionsArr = [];

    // filter options array to exclude correctOption so that randomly chosen options
    // don't include correct answer for given image
    const filteredOptionsArr = optionsArr.filter(option => option.toLowerCase() !== correctOption.toLowerCase());

    // chose random alt options from filteredOptionsArr
    const randomNum1 = getRandomNumber(0, filteredOptionsArr.length);
    let randomNum2 = getRandomNumber(0, filteredOptionsArr.length);

    while (randomNum2 === randomNum1) {
        randomNum2 = getRandomNumber(0, filteredOptionsArr.length);
    }

    randomOptionsArr.push(filteredOptionsArr[randomNum1]);
    randomOptionsArr.push(filteredOptionsArr[randomNum2]);

    return randomOptionsArr;
}

const textToSpeech = new SpeechSynthesisUtterance();
textToSpeech.lang = 'en-US';
textToSpeech.addEventListener('end', () => {
    // when text to speech is done, restart the
    // speech recognition api
    shouldStopListening = false;

    // if start method is called when recognition is already
    // started, exception is thrown
    // try-catch block is added to prevent website from not
    // working correctly when exception is thrown
    try {
        recognition.start();
    } catch (ex) {
        console.log(ex.message);
    }

    currentlySpeaking = false;
});

// if word is an array, its spellings will be spoken, letter by letter
// instead of speaking complete word
// if word is a string, complete word will be spoken
function speakWord(word) {
    currentlySpeaking = true;

    // speech recognition should stop listening when
    // text is being spoken as speech by the computer
    shouldStopListening = true;
    recognition.stop();

    textToSpeech.text = word;
    textToSpeech.rate = speechSpeed;

    window.speechSynthesis.speak(textToSpeech);
}

})();