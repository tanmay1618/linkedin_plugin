// chrome.storage.sync.get("forSyncCode", function(url) {
//   document.getElementById("forSyncCode").innerText = `
//   git remote add upstream ${url}
//   git fetch upstream
//   git branch --set-upstream-to=upstream/master master`;
// });

// chrome.storage.sync.get("forSyncCode", function(url) {
//   console.log(`url`, url);
//   document.getElementById("forSyncCode").innerText = url;
// });

// const forkSyncContainer = document.getElementById("forkSync");
// const localPRContainer = document.getElementById("localPR");

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
    setupLocalPR(tabId);
  }
);

function setupForkSync(tabId) {
  // @TODO: use "octolytics-dimension-repository_is_fork" to check if repo is a fork later
  const code = `(function getUrls(){
      const forkUrl = document.querySelector('.exp') 
        ? document.querySelector('.exp').textContent
        : undefined;


      return { forkUrl};
    })()`;

  // http://infoheap.com/chrome-extension-tutorial-access-dom/
  chrome.tabs.executeScript(tabId, { code }, function(result) {
    const { forkUrl} = result[0];

      forkSync.innerText = `Test2 : ${forkUrl}`;
      chrome.runtime.sendMessage({ message: 'save_text',forkUrl });
    // forkSync.innerText = JSON.stringify(result);
  });
}



function setupLocalPR(tabId) {
  // <meta property="og:url" content="https://github.com/dance2die/calendar-dates/pull/62">
  const code = `(function getPRId() {
    const url = document.querySelector('a[class="userName name"]')
      ? document.querySelector('a[class="userName name"]').textContent
      : undefined;
    return {url}; 
  })()`;

  chrome.tabs.executeScript(tabId, { code }, function(result) {
    const {prId} = result[0];

    //const isPR = !isNaN(parseInt(prId));

    chrome.storage.sync.get("branchName", function({ branchName }) {
      // // @ToDo: Get this from user's preference


        localPR.innerText = `Test${prId}`;
    });
  });
}
