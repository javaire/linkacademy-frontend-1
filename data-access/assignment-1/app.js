const quizUrl = 'quiz.json'
const quizStorage = {
    storageKey: 'quizAnswers',
    getAnswers: () => JSON.parse(localStorage.getItem(quizStorage.storageKey)) || {},
    saveAnswers: (answers) => localStorage.setItem(quizStorage.storageKey, JSON.stringify(answers))
};
const quizContainer = document.getElementById('quiz-container');

const loadQuizData = async () => {
    try {
        const response = await fetch(quizUrl);
        const data = await response.json();
        return data?.quiz || {}
    } catch (error) {
        console.error('Error loading quiz data:', error);
        quizContainer.textContent = 'Error loading quiz! Please retry later...';
        return;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
};

const generateQuizHTML = (quizData) => {
    Object.entries(quizData).forEach(([key, questionData], index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Question ${index + 1}: ${questionData.question}`;
        questionElement.appendChild(questionTitle);

        questionData.options.forEach(option => {
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = key;
            optionInput.value = option;

            const optionLabel = document.createElement('label');
            optionLabel.append(optionInput, document.createTextNode(option));
            questionElement.appendChild(optionLabel);

            optionInput.onclick = () => handleSaveAnswer(key, option);
        });

        quizContainer.appendChild(questionElement);
    });
};

const handleSaveAnswer = (questionKey, selectedOption) => {
    const updatedAnswers = {
        ...quizStorage.getAnswers(),
        [questionKey]: selectedOption
    };
    quizStorage.saveAnswers(updatedAnswers)
};

const loadSavedAnswers = () => {
    const savedAnswers = quizStorage.getAnswers();
    Object.keys(savedAnswers).forEach(key => {
        const answer = savedAnswers[key];
        const selectedOption = document.querySelector(`input[name="${key}"][value="${answer}"]`);
        if (selectedOption) {
            selectedOption.checked = true;
        }
    });
};

(async () => {
    const quizData = await loadQuizData();
    if (Object.keys(quizData).length > 0) {
      generateQuizHTML(quizData);
      loadSavedAnswers();
    } else {
      quizContainer.textContent = 'No quiz data were found!';
    }
})();
