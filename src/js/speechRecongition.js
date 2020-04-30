import { slickNextImage } from './slick-carousel';
import quizImages from './images';
import { playSoundEffect } from './utils';
import {
    $userAnswer,
    $currentImageCountElem,
    $optionsContainer,
    hideInfoText,
    correctUserAnswer,
    wrongUserAnswer,
    quizImagesContainerClass,
    incrementImageCount,
    displayImageOptions,
    displayInfoText
} from './ui';

// icon
import iconSpeech from '../assets/icons/ic_speech.png';

class Speech {
    constructor(speechSpeed, quiz) {
        window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

        this.quiz = quiz;
        this.recognition = null;
        this.shouldStopListening = false;
        this.currentImageIndex = 0;
        this.speechSpeed = speechSpeed;
        this.wrongTries = 0;
        this.textToSpeech = null;
        // true when computer is speaking the word or its spellings
        // will be used to block user from trying to listen to another option
        // while computer is speaking
        this.currentlySpeaking = false;

        this.checkSpeechRecognitionSupport();

        this.speechSynthesisUtteranceInit();
    }

    checkSpeechRecognitionSupport() {
        if ('SpeechRecognition' in window)
            this.speechRecognitionInit();
        else
            alert('Speech recognition not supported in your browser');
    }

    speechRecognitionInit() {
        this.recognition = new window.SpeechRecognition();

        this.recognition.onresult = (event) => {
            if (event.results[0].isFinal) {
                let speechToText = event.results[0][0].transcript.toLowerCase().trim();
                const areEqual = speechToText ===
                        quizImages[this.currentImageIndex].correctAnswer.toLowerCase().trim();

                $userAnswer.innerHTML = `<img src=${iconSpeech} alt="speech icon"> ${speechToText}`;

                if (areEqual)
                    this.processCorrectAnswer();
                else if (!areEqual)
                    this.processWrongAnswer();
            }
        }

        this.recognition.onend = (event) => {
            // restart speech recognition service in case it ends
            // to prevent it from stop listening
            if (!this.shouldStopListening) {
                this.recognition.start();
            }
        };

        this.recognition.start();
    }

    processCorrectAnswer() {
        playSoundEffect(true);
        hideInfoText();
        $userAnswer.classList.add('display-user-answer');
        correctUserAnswer();

        setTimeout(() => {
            $userAnswer.classList.remove('display-user-answer');
            slickNextImage(quizImagesContainerClass);
            incrementImageCount(this.quiz, this.quiz.totalImages);

            this.quiz.incrementCorrectAnswersCount();

            this.currentImageIndex++;

            if (this.currentImageIndex < quizImages.length) {
                displayImageOptions(quizImages[this.currentImageIndex]);
            }

            this.wrongTries = 0;
            this.checkIfQuizShouldEnd();
        }, 3000);
    }

    processWrongAnswer() {
        playSoundEffect(false);
        wrongUserAnswer();
        $userAnswer.classList.add('display-user-answer');
        this.wrongTries++;

        if (this.wrongTries === 3) {
            hideInfoText();
            $userAnswer.classList.remove('display-user-answer');

            alert('Correct answer: ' + quizImages[this.currentImageIndex].correctAnswer);

            slickNextImage(quizImagesContainerClass);
            incrementImageCount(this.quiz, this.quiz.totalImages);

            this.quiz.incrementWrongAnswersCount();

            this.wrongTries = 0;
            this.currentImageIndex++;
        } else {
            displayInfoText('try again')
        }

        if (this.currentImageIndex < quizImages.length) {
            displayImageOptions(quizImages[this.currentImageIndex]);
        }

        this.checkIfQuizShouldEnd();
    }

    checkIfQuizShouldEnd() {
        this.quiz.shouldQuizEnd(
            this.currentImageIndex,
            quizImagesContainerClass,
            $currentImageCountElem,
            $optionsContainer,
            this
        );
    }

    speechSynthesisUtteranceInit() {
        this.textToSpeech = new SpeechSynthesisUtterance();
        this.textToSpeech.lang = 'en-US';

        this.textToSpeech.addEventListener('end', () => {
            // when text to speech is done, restart the
            // speech recognition api
            this.shouldStopListening = false;

            // if start method is called when recognition is already
            // started, exception is thrown
            // try-catch block is added to prevent website from not
            // working correctly when exception is thrown
            try {
                this.recognition.start();
            } catch (ex) {
                console.log(ex.message);
            }

            this.currentlySpeaking = false;
        });
    }

    speakWord(word) {
        this.currentlySpeaking = true;

        // speech recognition should stop listening when
        // text is being spoken as speech by the computer
        this.shouldStopListening = true;
        this.recognition.stop();

        this.textToSpeech.text = word;
        this.textToSpeech.rate = this.speechSpeed;

        window.speechSynthesis.speak(this.textToSpeech);
    }
}

export default Speech;