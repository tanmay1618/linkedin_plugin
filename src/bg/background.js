
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

chrome.runtime.onMessage.addListener(
  (request, sender, senderResponse) => {

        console.log('testing',request.greeting)
        const data = {"data":request.greeting}
        /*var xhr = new XMLHttpRequest();
        const urlParams = `data=${request.greeting}`;
        //xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
        xhr.open("POST", 'https://app.pragti.in/api/employer/parse_data/', true); //request.greeting);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(urlParams);*/
        //senderResponse({type: "test"});
        //return true
        $.ajax({
          type: "POST",
          data: data,
          url: 'https://app.pragti.in/api/employer/parse_data/', // That's a relative URL!
          success: function(data) {
              var res = jQuery.parseJSON(data);
              console.log("result",res)
              //senderResponse({type: "test"});
              localStorage["data_ext"] = JSON.stringify(res);
              //return true
              // to send back your response  to the current tab
              /*
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
            });*/
            //return true
              //alert("success");
          },
          error: function(e) {
              //alert("error");
          }
      });

    
  }
);
