const correctAnswersCountElem = document.getElementsByClassName('correctAnswersCount')[0];
const wrongAnswersCountElem = document.getElementsByClassName('wrongAnswersCount')[0];
const currentImageCountElem = document.getElementsByClassName('totalImagesCount')[0];
const resultPercentageElem = document.getElementsByClassName('resultInPercentage')[0];
const tryAgainText = document.getElementsByClassName('tryAgainText')[0];
const restartQuizBtn = document.getElementsByTagName('button')[0];
const quizImagesContainer = document.getElementsByClassName('quiz-images-container')[0];

let images = ['elephant', 'horse', 'giraffe', 'dog'];
images = shuffleArray(images);

let divTag, imageTag;

images.forEach(img => {
    divTag = document.createElement('div');

    imageTag = document.createElement('img');
    imageTag.setAttribute('src', `./img/${img}.jpg`);

    divTag.appendChild(imageTag);
    quizImagesContainer.appendChild(divTag);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

$(document).ready(function(){
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

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

let shouldStopListening = false;

const totalNumberOfImages = images.length;

let countCorrectAnswers = 0;
let countWrongAnswers = 0;
let countCurrentImage = 1;
let currentImageIndex = 0;
let speechArrayIndex = 0;
let wrongTries = 0;

let recognition = null;

if ('SpeechRecognition' in window) {

    recognition = new window.SpeechRecognition();
    recognition.continuous = true;

    recognition.onresult = (event) => {
        const speechToText = event.results[speechArrayIndex][0].transcript;

        const areEqual = speechToText.toLowerCase().trim() === images[currentImageIndex].toLowerCase().trim();

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

                alert('Correct answer: ' + images[currentImageIndex]);

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
    }

    recognition.onstart = (event) => {
        // in case speech rcognition service starts again after end event call,
        // set reset the "speechArrayIndex" to zero again
        speechArrayIndex = 0;
    };

    recognition.onnomatch = (event) => {
        console.log('no match event fired');
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

        resultPercentageElem.textContent = `Result = ${(countCorrectAnswers / totalNumberOfImages) * 100}%`;
        resultPercentageElem.style.display = 'inline-block';

        restartQuizBtn.style.display = 'inline-block';

        shouldStopListening = true;
        recognition.stop();
    }
}