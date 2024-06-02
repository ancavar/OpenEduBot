const buttonQueue = [];
let checkedAnswers = 0;
let totalQuestions = 0;

async function main(evt) {
    const jsInitChecktimer = setInterval(getAllTests, 500);

    function getAllTests() {
        const container = document.querySelector('.sequence-navigation-tabs-container');
        if (container) {
            clearInterval(jsInitChecktimer);
            const buttons = container.querySelectorAll('button');

            buttons.forEach(button => {
                const editIcon = button.querySelector('svg[data-icon="edit"]');
                if (editIcon) {
                    buttonQueue.push(button);
                }
            });

            handleButtonQueue();
        }
    }

    async function handleButtonQueue() {
        while (buttonQueue.length > 0) {
            buttonQueue.shift().click();
            await sendMessage({ loaded: true });
            const response = await waitForMessage('done');
            if (!response.done) {
                break;
            }
            checkedAnswers += response.checkedAnswers;
            totalQuestions += response.totalQuestions;
        }
        navigateToNextBlock();
    }

    function getSequentialBlockId(url) {
        const regex = /block@([a-f0-9]{32})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    let currentSequentialBlockId = getSequentialBlockId(window.location.href);

    async function navigateToNextBlock() {
        let newSequentialBlockId = getSequentialBlockId(window.location.href);
        while (newSequentialBlockId === currentSequentialBlockId) {
            let button = document.querySelector('.next-btn.btn.btn-link');
            if (button.disabled) {
                await sendMessage({ checkedAnswers, totalQuestions });
                return;
            }
            button.click();
            newSequentialBlockId = getSequentialBlockId(window.location.href);
        }
        currentSequentialBlockId = newSequentialBlockId;
        await main();
    }

    function sendMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (response) => {
                resolve(response);
            });
        });
    }

    function waitForMessage(expectedType) {
        return new Promise((resolve) => {
            chrome.runtime.onMessage.addListener(function listener(request, sender, sendResponse) {
                if (request[expectedType] !== undefined) {
                    chrome.runtime.onMessage.removeListener(listener);
                    resolve(request);
                }
            });
        });
    }
}

main();
