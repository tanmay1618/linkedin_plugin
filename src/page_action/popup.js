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
      var i = 0;
      var html =  "<ul>"
      for(i= 0; i < msg["result"].length; i++){
          html = html + "<li>" + msg["result"][i][0] + " - " + msg["result"][i]["company_info"] +"</li>"
      }
      html = html + "</ul>"
      forkSync.innerHTML = html;
    });

    });
}



