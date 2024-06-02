function checkAnswers() {
    let problemWrappers = document.querySelectorAll('.wrapper-problem-response');
    let legends = document.querySelectorAll('legend');
    let questionTexts;

    if (legends.length > 0) {
        questionTexts = Array.from(legends, legend => legend.textContent.trim());
    } else {
        // horrible edge case when the question is in <p>
        questionTexts = Array.from(problemWrappers, wrapper => {
            return wrapper.previousElementSibling.textContent.trim();
        })
    }

    let checkedAnswers = 0
    let totalQuestions = 0

    questionTexts.forEach((question, index) => {
        totalQuestions++
        chrome.storage.local.get(question, (obj) => {
            let answers = obj[question];
            if (answers) {

                let fieldset = problemWrappers[index].querySelector('fieldset');

                answers.forEach(answerText => {
                    let label = Array.from(fieldset.querySelectorAll('label')).find(label => label.textContent.trim() === answerText);
                    if (label && label.htmlFor) {
                        checkedAnswers++
                        let input = fieldset.querySelector(`#${label.htmlFor}`);
                        if (input) {
                            input.checked = true;
                        }
                    }
                });
            } else {
                console.log(`❗ ОТСУТСТВУЕТ: ${question}`);
            }
        });
    });
    //todo: response
    chrome.runtime.sendMessage({done: true, checkedAnswers, totalQuestions })
}

function submitAnswers() {
    let button = document.querySelector('.submit.btn-brand');
    button.click()
}

checkAnswers()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.loaded === true) {
        checkAnswers()
    }
});
