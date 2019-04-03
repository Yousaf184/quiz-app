(function () {

const correctAnswersCountElem = document.getElementsByClassName('correctAnswersCount')[0];
const wrongAnswersCountElem = document.getElementsByClassName('wrongAnswersCount')[0];
const currentImageCountElem = document.getElementsByClassName('totalImagesCount')[0];
const resultPercentageElem = document.getElementsByClassName('resultInPercentage')[0];
const tryAgainText = document.getElementsByClassName('tryAgainText')[0];
const restartQuizBtn = document.getElementsByTagName('button')[0];
const quizImagesContainer = document.getElementsByClassName('quiz-images-container')[0];
const optionsContainer = document.getElementsByClassName('options')[0];

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
    if (e.target.tagName === 'IMG') {
        speakWord(e.target.parentElement.textContent);
    }
});

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const totalNumberOfImages = images.length;

let shouldStopListening = false;

let countCorrectAnswers = 0;
let countWrongAnswers = 0;
let countCurrentImage = 1;
let currentImageIndex = 0;
let speechArrayIndex = 0;
let wrongTries = 0;

let recognition = null;

currentImageCountElem.textContent = `Image: ${countCurrentImage}/${totalNumberOfImages}`;

if ('SpeechRecognition' in window) {

    recognition = new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        const speechToText = event.results[speechArrayIndex][0].transcript;
        const areEqual = speechToText.toLowerCase().trim() === images[currentImageIndex].correctAnswer.toLowerCase().trim();

        if (areEqual) {
            $('.quiz-images-container').slick('slickNext');

            correctAnswersCountElem.textContent = `Correct Answers = ${++countCorrectAnswers}`;
            currentImageCountElem.textContent = `Image: ${++countCurrentImage}/${totalNumberOfImages}`;

            currentImageIndex++;
            wrongTries = 0;

            tryAgainText.style.display = 'none';

        }
        else if (!areEqual) {
            wrongTries++;

            if (wrongTries === 3) {
                tryAgainText.style.display = 'none';

                alert('Correct answer: ' + images[currentImageIndex].correctAnswer);

                $('.quiz-images-container').slick('slickNext');

                wrongAnswersCountElem.textContent = `Wrong Answers = ${++countWrongAnswers}`;
                currentImageCountElem.textContent = `Image: ${++countCurrentImage}/${totalNumberOfImages}`;

                wrongTries = 0;
                currentImageIndex++;
            } else {
                tryAgainText.style.display = 'block';
            }
        }

        speechArrayIndex++;
        shouldQuizEnd();

        if (currentImageIndex < images.length) {
            displayImageOptions(images[currentImageIndex]);
        }
    }

    recognition.onstart = (event) => {
        // in case speech rcognition service starts again after end event call,
        // set reset the "speechArrayIndex" to zero again
        speechArrayIndex = 0;
    };

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
    const childrenArr = Array.from(optionsContainer.children);

    childrenArr.forEach((child, index) => {
        if (child.tagName === 'LI') {
            child.innerHTML = options[index - 1] + '<img src="./ic_speak.png" alt="speaker icon">';
        }
    });
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
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

function speakWord(text) {
    const message = new SpeechSynthesisUtterance(text);
    message.lang = 'en-US';
    window.speechSynthesis.speak(message);
}

})();