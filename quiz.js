(function () {

const currentImageCountElem = document.getElementsByClassName('totalImagesCount')[0];
const infoText = document.getElementsByClassName('info-text')[0];
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const quizImagesContainer = document.getElementsByClassName('quiz-images-container')[0];
const optionsContainer = document.getElementsByClassName('options')[0];
const settingsBtn = document.getElementsByClassName('settings-btn')[0];
const modalContainer = document.getElementsByClassName('modal-container-backdrop')[0];
const speechspeedOptions = document.getElementsByTagName('select')[0];
const userAnswer = document.getElementById('user-answer');

const speechSpeeds = {
    slow: 0.6,
    medium: 1,
    fast: 1.5
};

const quizInfo = {
    currentImageCount: 1,
    correctAnswersCount: 0,
    wrongAnswersCount: 0
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
        speakWord(e.target.parentElement.textContent);
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
let currentImageIndex = 0;
let wrongTries = 0;

let recognition = null;

currentImageCountElem.textContent = `Image: ${quizInfo.currentImageCount}/${totalNumberOfImages}`;

if ('SpeechRecognition' in window) {

    recognition = new window.SpeechRecognition();

    recognition.onresult = (event) => {
        if (event.results[0].isFinal) {
            let speechToText = event.results[0][0].transcript.toLowerCase().trim();
            const areEqual = speechToText === images[currentImageIndex].correctAnswer.toLowerCase().trim();

            userAnswer.innerHTML = `<img src="./icons/ic_speech.png" alt="speech icon"> ${speechToText}`;

            if (areEqual) {
                hideInfoText();
                userAnswer.classList.add('display-user-answer');
                correctUserAnswer();

                setTimeout(() => {
                    userAnswer.classList.remove('display-user-answer');
                    $('.quiz-images-container').slick('slickNext');
                    incrementImagCount();

                    quizInfo.correctAnswersCount += 1;

                    currentImageIndex++;

                    if (currentImageIndex < images.length) {
                        displayImageOptions(images[currentImageIndex]);
                    }

                    wrongTries = 0;
                    shouldQuizEnd();
                }, 2000);
            }
            else if (!areEqual) {
                wrongUserAnswer();
                userAnswer.classList.add('display-user-answer');
                wrongTries++;

                if (wrongTries === 3) {
                    hideInfoText();
                    userAnswer.classList.remove('display-user-answer');

                    alert('Correct answer: ' + images[currentImageIndex].correctAnswer);

                    $('.quiz-images-container').slick('slickNext');
                    incrementImagCount();

                    quizInfo.wrongAnswersCount += 1;

                    wrongTries = 0;
                    currentImageIndex++;
                } else {
                    displayInfoText('try again')
                }

                if (currentImageIndex < images.length) {
                    displayImageOptions(images[currentImageIndex]);
                }

                shouldQuizEnd();
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

function incrementImagCount() {
    quizInfo.currentImageCount += 1;
    currentImageCountElem.textContent = `Image: ${quizInfo.currentImageCount}/${totalNumberOfImages}`;
}

function shouldQuizEnd() {
    if (currentImageIndex === totalNumberOfImages) {
        $('quiz-container').slick('unslick');

        currentImageCountElem.style.display = 'none';
        quizImagesContainer.style.display = 'none';
        optionsContainer.style.display = 'none';

        displayQuizResult();

        shouldStopListening = true;
        recognition.stop();
    }
}

function displayQuizResult() {
    document.getElementById('correctAnswersCount').textContent = 'Correct Answers: ' + quizInfo.correctAnswersCount;
    document.getElementById('wrongAnswersCount').textContent = 'Wrong Answers: ' + quizInfo.wrongAnswersCount;

    let percentage = (quizInfo.correctAnswersCount / totalNumberOfImages) * 100;

    // if there's a decimal in percentage, format it to
    // 2 decimal places
    if (percentage.toString().includes('.')) {
        percentage = percentage.toFixed(2);
    }

    const resultPercentage = document.getElementById('resultInPercentage');
    resultPercentage.textContent = `Result = ${percentage}%`;
    resultPercentage.style.display = 'inline-block';

    restartQuizBtn.style.display = 'inline-block';

    document.getElementById('info-container').classList.add('show-info-container');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function correctUserAnswer() {
    userAnswer.classList.remove('wrong-user-answer');
    userAnswer.classList.add('correct-user-answer');
}

function wrongUserAnswer() {
    userAnswer.classList.add('wrong-user-answer');
    userAnswer.classList.remove('correct-user-answer');
}

function displayImageOptions(image) {
    const options = shuffleArray([image.correctAnswer, ...image.altOptions]);

    getOptionListItems().forEach((liItem, index) => {
        liItem.innerHTML = options[index] + '<img src="./icons/ic_speak.png">';
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