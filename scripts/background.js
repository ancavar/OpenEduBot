chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.checked === 0) {
        notifyResultsToUser(request)
    }
    chrome.tabs.sendMessage(sender.tab.id, request);
});

function notifyResultsToUser(results){
    const checked = results.checked
    const total = results.total
    chrome.notifications.create(
        "completed-course",
        {
            type: "basic",
            title: "Курс пройден",
            iconUrl: chrome.runtime.getURL("images/icon128.png"),
            message: `Всего проставленных ответов: ${checked} из ${total} `
        })

}