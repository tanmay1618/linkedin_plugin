const forkSync = document.getElementById("forSyncCode");
const localPR = document.getElementById("localPRCode");

const extractCopyText = text =>
  text
    .split("\n")
    // Get rid of new lines
    .filter(_ => _.replace(/\s+/g, ""))
    .map(c => c.trim())
    .join("\n");

const copyToClipboard = code =>
  navigator.clipboard
    .writeText(code)
    .then(() => alert("Copied to clipboard~"))
    .catch(() => alert("Failed to copy to clipboard..."));

document.getElementById("copyForkSyncButton").addEventListener("click", _ => {
  const code = extractCopyText(forkSync.innerText);
  copyToClipboard(code);
});

document.getElementById("copyLocalPRButton").addEventListener("click", _ => {
  const code = extractCopyText(localPR.innerText);
  copyToClipboard(code);
});

chrome.tabs.query(
  { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
  function(tabs) {
    const { id: tabId } = tabs[0].url;

    setupForkSync(tabId);
  }
);

function setupForkSync(tabId) {  
    const code = `(function getUrls(){
      const forkUrl = document.all[0].outerHTML;
      return { forkUrl};
    })()`;
    // http://infoheap.com/chrome-extension-tutorial-access-dom/
    chrome.tabs.executeScript(tabId, { code }, function(result) {
    const { forkUrl} = result[0];
    const forkData = 'testing'
    var port = chrome.runtime.connect({name: "knockknock"});
    port.postMessage({ greeting: forkUrl});
    port.onMessage.addListener(function(msg) {
      forkSync.innerText = JSON.stringify(msg);
    });

    });
}



