import { hideSlickSlider } from './slick-carousel';

class Quiz {
    constructor(targetElement, totalImages, restartQuizBtn) {
        this.$quizImagesContainer = targetElement;
        this.totalImages = totalImages;
        this.$restartQuizBtn = restartQuizBtn;

        this.speechSpeeds = {
            slow: 0.6,
            medium: 1,
            fast: 1.5
        };

        this.quizInfo = {
            currentImageCount: 1,
            correctAnswersCount: 0,
            wrongAnswersCount: 0
        };
    }

    incrementWrongAnswersCount() {
        this.quizInfo.wrongAnswersCount++;
    }

    incrementCorrectAnswersCount() {
        this.quizInfo.correctAnswersCount++;
    }

    incrementCurrentImageCount() {
        this.quizInfo.currentImageCount++;
    }

    shouldQuizEnd(
        currentImageIndex,
        targetElementClass,
        $currentImageCountElem,
        $optionsContainer,
        speech
    ) {
        if (currentImageIndex === this.totalImages) {
            // $('quiz-container').slick('unslick');
            hideSlickSlider(targetElementClass);

            $currentImageCountElem.style.display = 'none';
            // quizImagesContainer.style.display = 'none';
            this.$quizImagesContainer.style.display = 'none';
            $optionsContainer.style.display = 'none';

            this.displayQuizResult();

            speech.shouldStopListening = true;
            speech.recognition.stop();
        }
    }

    displayQuizResult() {
        const $correctAnswerCount = document.getElementById('correctAnswersCount');
        const $wrongAnswerCount = document.getElementById('wrongAnswersCount');

        $correctAnswerCount.textContent = `Correct Answers: ${this.quizInfo.correctAnswersCount}`;
        $wrongAnswerCount.textContent = `Wrong Answers: ${this.quizInfo.wrongAnswersCount}`;

        let percentage = (this.quizInfo.correctAnswersCount / this.totalImages) * 100;

        // if there's a decimal in percentage, format it to
        // 2 decimal places
        if (percentage.toString().includes('.')) {
            percentage = percentage.toFixed(2);
        }

        const resultPercentage = document.getElementById('resultInPercentage');
        resultPercentage.textContent = `Result = ${percentage}%`;
        resultPercentage.style.display = 'inline-block';

        this.$restartQuizBtn.style.display = 'inline-block';

        document.getElementById('info-container').classList.add('show-info-container');
    }
}

export default Quiz;