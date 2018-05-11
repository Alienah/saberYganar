const app = (function (){
    let questions = [];
    let questionObtained;
    let btnNext;
    let btnSend;
    let seconds;
    let timer;
    let score;
    let inputValueOfAnswer;
    let correctAnswerId;

    const getQuestions = callback => {
        const serverData = [
            {
                question: 
                    { 
                        id: 1, text: '¿Capital de Honduras?' 
                    },
                answers: [
                            { 
                                id: 1, text: 'Tegucigalpa' 
                            }, 
                            { 
                                id: 2, text: 'Lima' 
                            }, 
                            { 
                                id: 3, text: 'Buenos Aires' 
                            }
                        ],
                correctAnswerId: 1
            },
            {
                question: 
                    {
                    id: 2, text: 'Rio que pasa por Toledo' 
                    },
                answers: [
                            { 
                                id: 4, text: 'Miño' 
                            }, 
                            { 
                                id: 5, text: 'Tajo' 
                            }, 
                            { 
                                id: 6, text: 'Duero' 
                            }
                        ],
                correctAnswerId: 5
            },
            {
                question: 
                    { 
                        id: 3, text: 'Color Bandera de Argentina' 
                    },
                answers: [
                            { 
                                id: 7, text: 'Rojo Blanco' 
                            }, 
                            { 
                                id: 8, text: 'Blanco y Verde' 
                            }, 
                            {
                                id: 9, text: 'Azul Blanco Azul' 
                                }
                        ],
                correctAnswerId: 9
            },
            {
                question: 
                    { 
                        id: 3, text: '¿Quién pintó la capilla sixtina?' 
                    },
                answers: [
                            { 
                                id: 7, text: 'Picasso' 
                            }, 
                            { 
                                id: 8, text: 'Velazquez' 
                            }, 
                            {
                                id: 9, text: 'Miguel Angel' 
                                }
                        ],
                correctAnswerId: 9
            },
        ];
        callback(serverData);
    };

    const getQuestionRamdon = () => {
        const randomPosition = Math.floor(Math.random()* questions.length);
        let questionToGet = questions[randomPosition];
        updateQuestionsArray(randomPosition);
        return questionToGet;
    };

    const giveQuestionObtained = () => {
        questionObtained = getQuestionRamdon();
        return questionObtained;
    };

    const updateQuestionsArray = (randomPosition) => {
        questions.splice(randomPosition, 1);
    };

    const paintQuestions = (questionObtained) => {
        const titleOfQuestionObtained = questionObtained.question.text;
        const answersOfQuestionObtained = questionObtained.answers;
        const idOfQuestionObtained = questionObtained.question.id;
        let listOfAnswersContainer = '';

        document.getElementById('question__title').innerHTML = titleOfQuestionObtained;
        for (var i = 0; i < answersOfQuestionObtained.length; i++) {
            var itemListDefinition = 
                `<li>
                    <input id="item-${i}" name="answers" type="radio" required value="${answersOfQuestionObtained[i].id}" >${answersOfQuestionObtained[i].text}
                </li>`;
            listOfAnswersContainer += itemListDefinition;
        
        }
        document.getElementById('answers-list').innerHTML = listOfAnswersContainer;
    
    };

    const changeUIWhenNoMoreQuestions = () => {
        document.querySelector('.trivial').classList.add('hide');
        document.querySelector('.btn--next').classList.add('hide');
    };

    const compareAnswers = (answerCorrect, answerOfUser) => {
        if (answerCorrect == answerOfUser) {
            return true;      
        }
        if (answerCorrect != answerOfUser) {            
            return false;
        }
    };

    const getValuesToCompare = (target) => {    
        inputValueOfAnswer = target.value;
        correctAnswerId = questionObtained.correctAnswerId;
    };

    const getResultOfComparation = () => {
        if(compareAnswers(inputValueOfAnswer, correctAnswerId)) {
            showMsgWhenIsCorrect();
            showScore(recalculateScoreWhenIsCorrect);
        } else if (!compareAnswers(inputValueOfAnswer, correctAnswerId)) {
            showMsgWhenIsIncorrect();
            showScore(recalculateScoreWhenIsIncorrect);
        }      
    };

    const preventNextQuestion = (targetRadio) => {
        if (targetRadio.checked) {
            btnNext.disabled = false;
        }
        else {
            btnNext.disabled = true;
        }
    };

    const handleEventsOfRadios = (event) => {
        const target = event.target;
        getValuesToCompare(target);
        preventNextQuestion(target);
    };

    //Mensajes que se mostrarán en la interfaz
    const showMsgWhenIsCorrect = () => console.log('Correcto!');     

    const showMsgWhenIsIncorrect = () => console.log('Incorrecto!'); 

    const recalculateScoreWhenIsCorrect = (score, seconds) => {
        if (seconds <= 2) {
            return score + 2;
        }
        if (seconds <= 10) {
            return score + 1;
        }
        if (seconds > 10) {
            return score;
        }
    };

    const recalculateScoreWhenIsIncorrect = (score, seconds) => {
        if (seconds > 10) {
            return score - 2;
        }
        if (seconds <= 10) {
            return score - 1;
        }
    };

    const recalculateScoreWhenNoAnswer = (score) => {
        return score - 3;
    };

    const showScore = (myRecalculateFunction) => {
        score = myRecalculateFunction(score, seconds);
        return console.log(`La puntuación es ${score}`);
    };

    const updateUI = () => {
        if (questions.length > 0) {
            paintQuestions(giveQuestionObtained());
        } else {
            changeUIWhenNoMoreQuestions();
            stopTimer();
        }
        btnNext.disabled = true;
        console.log(`Tiempo transcurrido ${seconds} segundos`);
    };

    const doBeforeNextQuestion = () => {
        getResultOfComparation();
        updateUI();
        resetAnswerTimer();
    };

    const goToNextQuestion = () => {
    doBeforeNextQuestion();
    };

    //Funciones de temporizador
    const startTimer = () => {
        if (!timer) {
            timer = setInterval(updateTimer, 1000);
        }
    };

    //Refactorizar
    //timer = setInterval(function () {setTimeAndConditions(paintQuestions);}, 1000);
    const updateTimer = () => {
        seconds++;
        console.log(seconds);            
            if (seconds > 5) {
                onNextQuestion();
                showScore(recalculateScoreWhenNoAnswer);
                // paintQuestions(giveQuestionObtained());
                resetAnswerTimer();
            }
            // else if (seconds > 5) {
            //     stopTimer();
            //     // changeUIWhenNoMoreQuestions();
            // }
        
    };

    const onNextQuestion = () => {
        updateUI();
    };

    // const ifNoAnswer = () => {
    //     updateUI();
    // };

    const updateCountdown = () => {
        seconds++;
        console.log(seconds);
    }

    const stopTimer = () => {
        if (timer) {
            clearInterval(timer);        
        }
        timer = null;
        resetAnswerTimer();
    };

    const resetAnswerTimer = () => {
        seconds = 0;
    };

    const startApp = () => {
        seconds = 0;
        timer = null;
        score = 0;
        btnNext = document.getElementById('btn-next');
        btnNext.disabled = true;
        btnNext.addEventListener('click', goToNextQuestion);
        btnSend = document.getElementById('btn-send');        
        btnSend.disabled = true;
        document.form__container.addEventListener('click', handleEventsOfRadios);
        
        getQuestions(function (data) {
            questions = data;
            startTimer();
        });
        
        paintQuestions(giveQuestionObtained());        
    };

    return {
        getQuestionRamdon: getQuestionRamdon,
        paintQuestions: paintQuestions,
        getInputValueAndCompare: getValuesToCompare,
        startApp       
    };
});


