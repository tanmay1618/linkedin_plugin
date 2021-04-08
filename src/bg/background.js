
chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "resdex.naukri.com" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);

    // Set the Branch name to use
    const defaultBranchName = "DEFAULT_BRANCHNAME";
    const isEmptyObject = target =>
      Object.keys(target).length === 0 && target.constructor === Object;
    chrome.storage.sync.get("branchName", function(branchName) {
      if (!isEmptyObject(branchName)) return;

      chrome.storage.sync.set({ branchName: defaultBranchName }, function() {
        console.log(`set the branch name to ${branchName}`);
      });
    });

  });
});

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    console.log('testing',msg.greeting)
        const data = {"data":msg.greeting}
        $.ajax({
          type: "POST",
          data: data,
          url: 'https://app.pragti.in/api/employer/parse_data/', // That's a relative URL!
          success: function(data) {
              var res = jQuery.parseJSON(data);
              console.log("result",res)
              port.postMessage({result: res});
          },
          error: function(e) {
              //alert("error");
          }
      });
      
  });
});

