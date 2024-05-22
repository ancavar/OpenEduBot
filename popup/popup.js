async function getCurrentTab() {
  let queryOptions = {active: true, lastFocusedWindow: true};
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function completeTests() {
    // todo: if url != ...
    const activeTab = await getCurrentTab();
    chrome.scripting.executeScript({
        target: {tabId: activeTab.id, allFrames: true},
        files: ["scripts/collect-all-tests.js"]
    })
}

document.getElementById('toggle').addEventListener("click", completeTests)
  