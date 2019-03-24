const correctAnswersCountElem = document.getElementsByClassName('correctAnswersCount')[0];
const wrongAnswersCountElem = document.getElementsByClassName('wrongAnswersCount')[0];
const currentImageCountElem = document.getElementsByClassName('totalImagesCount')[0];
const resultPercentageElem = document.getElementsByClassName('resultInPercentage')[0];
const tryAgainText = document.getElementsByClassName('tryAgainText')[0];
const restartQuizBtn = document.getElementsByTagName('button')[0];

let countCorrectAnswers = 0;
let countWrongAnswers = 0;
let countCurrentImage = 1;

const totalNumberOfImages = 4;
let currentImageIndex = 0;
let images = ['elephant', 'horse', 'giraffe', 'dog'];
images = shuffleArray(images);

const imageTags = document.querySelectorAll('img');

imageTags.forEach(imgTag => {
    imgTag.setAttribute('src', `./img/${images[currentImageIndex]}.jpg`);
    currentImageIndex++;
});

currentImageIndex = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

$(document).ready(function(){
    $('.quiz-container').slick({
        arrows: false,
        draggable: false,
        touchMove: false,
        slidesToShow: 1,
        slidesToScroll: 1
    });
});

restartQuizBtn.addEventListener('click', () => {
    window.location.reload();
});

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

let speechArrayIndex = 0;
let wrongTries = 0;
let recognition = null;

if ('SpeechRecognition' in window) {

    recognition = new window.SpeechRecognition();

    recognition.continuous = true;

    recognition.onresult = (event) => {
        const speechToText = event.results[speechArrayIndex][0].transcript;

        if (speechToText.toLowerCase().trim() === images[currentImageIndex].toLowerCase().trim()) {
            $('.quiz-container').slick('slickNext');

            correctAnswersCountElem.textContent = `Correct Answers = ${++countCorrectAnswers}`;

            if (countCurrentImage < totalNumberOfImages) {
                currentImageCountElem.textContent = `Image: ${++countCurrentImage}/${totalNumberOfImages}`;
            }

            currentImageIndex++;
            wrongTries = 0;

            tryAgainText.style.display = 'none';
        }
        else {
            wrongTries++;

            if (wrongTries === 3) {
                alert('Correct answer: ' + images[currentImageIndex]);
                $('.quiz-container').slick('slickNext');
                wrongAnswersCountElem.textContent = `Wrong Answers = ${++countWrongAnswers}`;
                wrongTries = 0;
                currentImageIndex++;
                tryAgainText.style.display = 'none';
            } else {
                tryAgainText.style.display = 'block';
            }
        }

        speechArrayIndex++;
        shouldQuizEnd();
    }

    recognition.start();
} else {
    alert('Speech recognition not supported in your browser');
}

function shouldQuizEnd() {
    if (currentImageIndex === totalNumberOfImages) {
        $('quiz-container').slick('unslick');

        currentImageCountElem.style.display = 'none';
        document.getElementsByClassName('quiz-container')[0].style.display = 'none';

        resultPercentageElem.textContent = `Result = ${(countCorrectAnswers / totalNumberOfImages) * 100}%`;
        resultPercentageElem.style.display = 'inline-block';

        restartQuizBtn.style.display = 'inline-block';

        recognition.stop()
    }
}