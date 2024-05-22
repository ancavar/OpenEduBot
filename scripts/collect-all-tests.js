const buttonQueue = [];

function myMain (evt) {
    // пиздец
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
            // start
            buttonQueue.shift().click()
            chrome.runtime.sendMessage({loaded: true})

        }
    }
}


function getSequentialBlockId(url) {
    const regex = /block@([a-f0-9]{32})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

let currentSequentialBlockId = getSequentialBlockId(window.location.href);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.done === true) {
        if (buttonQueue.length > 0) {
            buttonQueue.shift().click()
            console.log(currentSequentialBlockId)

            console.log(buttonQueue.length)
        } else {
            let newSequentialBlockId = getSequentialBlockId(window.location.href);
            while (newSequentialBlockId === currentSequentialBlockId) {
                let button = document.querySelector('.next-btn.btn.btn-link');
                if (button.disabled) {
                    return
                }
                button.click()
                newSequentialBlockId = getSequentialBlockId(window.location.href);
            }
            currentSequentialBlockId = newSequentialBlockId;
            myMain();
        }
    }
});

myMain()