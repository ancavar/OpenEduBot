chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.checkedAnswers >= 0 && request.done === undefined) {
        notifyResultsToUser(request)
    }
    chrome.tabs.sendMessage(sender.tab.id, request);
});

function notifyResultsToUser(results){
    const checked = results.checkedAnswers
    const total = results.totalQuestions
    chrome.notifications.create(
        "completed-course",
        {
            type: "basic",
            title: "Курс пройден",
            iconUrl: chrome.runtime.getURL("images/icon128.png"),
            message: `Всего проставленных ответов: ${checked} из ${total} `
        })

}