const loadQuizData = async () => {
    try {
        const response = await fetch('https://github.com/javaire/linkacademy-frontend-1/quiz.json');
        const data = await response.json();
        return data.quiz;
    } catch (error) {
        console.error('Error loading quiz data:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
};

const generateQuizHTML = (quizData) => {
    const quizContainer = document.getElementById('quiz-container');
    Object.keys(quizData).forEach((key) => {
        const questionData = quizData[key];
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = questionData.question;
        questionElement.appendChild(questionTitle);

        questionData.options.forEach((option, index) => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = key;
            optionInput.value = option;
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(option));
            questionElement.appendChild(optionLabel);
        });

        quizContainer.appendChild(questionElement);
    });
};

const saveAnswers = () => {
    const answers = {};
    document.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
        answers[input.name] = input.value;
    });
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
};

const loadSavedAnswers = () => {
    const savedAnswers = JSON.parse(localStorage.getItem('quizAnswers'));
    if (savedAnswers) {
        Object.keys(savedAnswers).forEach((key) => {
            const answer = savedAnswers[key];
            const selectedOption = document.querySelector(`input[name="${key}"][value="${answer}"]`);
            if (selectedOption) {
                selectedOption.checked = true;
            }
        });
    }
};

(async () => {
    const quizData = await loadQuizData();
    generateQuizHTML(quizData);
    loadSavedAnswers();
})();

document.getElementById('submit-btn').addEventListener('click', saveAnswers);
