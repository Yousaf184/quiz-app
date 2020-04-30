import { createSlickSlider } from './js/slick-carousel';
import Quiz from './js/quiz';
import quizImages from './js/images';
import Speech from './js/speechRecongition';
import {
    addEventListenersOnUiElements,
    displayImageOptions,
    showImageCountInDOM,
    quizImagesContainerClass,
    $restartQuizBtn,
    addQuizImagesInDOM,
} from './js/ui';

//css
import './css/quiz.css';
// audio
import correctAnswerSound from './assets/audio/correct-answer.mp3';
import incorrectAnswerSound from './assets/audio/incorrect-answer.mp3';

const quizImagesContainer = document.getElementsByClassName(quizImagesContainerClass)[0];

createSlickSlider({
    targetElementClass: quizImagesContainerClass,
    options: {
        arrows: false,
        draggable: false,
        touchMove: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: false
    }
});

function appInit() {
    // quizImages.length - 1
    // total images are 1 less then the length of the images array
    const quiz = new Quiz(quizImagesContainer, quizImages.length - 1, $restartQuizBtn);
    const speech = new Speech(quiz.speechSpeeds.medium, quiz);

    addEventListenersOnUiElements(quiz, speech);

    addQuizImagesInDOM();

    //display first image options
    displayImageOptions(quizImages[0]);

    showImageCountInDOM(quiz.quizInfo.currentImageCount, quiz.totalImages);
}

appInit();