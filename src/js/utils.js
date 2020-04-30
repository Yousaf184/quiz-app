function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// returns random alternative wrong options
// chooses random options from the options array after excluding the correct option for a given array
export function getAltOptions(optionsArr, correctOption) {
    const randomOptionsArr = [];

    // filter options array to exclude correctOption so that randomly chosen options
    // don't include correct answer for given image
    const filteredOptionsArr = optionsArr.filter(option => {
        return option.toLowerCase() !== correctOption.toLowerCase();
    });

    // // chose random alt options from filteredOptionsArr
    let randomNum1 = getRandomNumber(0, filteredOptionsArr.length);
    const randomNum2 = getRandomNumber(0, filteredOptionsArr.length);

    while (randomNum1 === randomNum2) {
        randomNum1 = getRandomNumber(0, filteredOptionsArr.length);
    }

    randomOptionsArr.push(filteredOptionsArr[randomNum1]);
    randomOptionsArr.push(filteredOptionsArr[randomNum2]);

    return randomOptionsArr;
}

// returns li tags in an array
// li tags are used to display options
export function getOptionListItems(optionsContainer) {
    const liTagsArr = [];
    const childrenArr = Array.from(optionsContainer.children);

    childrenArr.forEach((child) => {
        if (child.tagName === 'LI') {
            liTagsArr.push(child);
        }
    });

    return liTagsArr;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export function playSoundEffect(isAnswerCorrect) {
    if (isAnswerCorrect) {
        document.getElementById('correct-answer-sound').play();
    } else {
        document.getElementById('wrong-answer-sound').play();
    }
}