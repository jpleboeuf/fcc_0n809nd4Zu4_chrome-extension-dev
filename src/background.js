chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    /*
      + `changeInfo.url` / `tab.url`:
        - if `changeInfo.url` is `undefined`, it means that the URL did not change,
           the current URL is still the one in `tab.url`;
        - if `changeInfo.url` is a URL, it means that the URL did change,
           as reflected in `tab.url`.
      + `changeInfo.status` / `tab.status`:
        - if `changeInfo.status` is `undefined`, it means that the status did not change,
           the current status is still the one in `tab.status`;
        - if `changeInfo.url` is a status, it means that the status did change,
           as reflected in `tab.status`.
    */
    console.group("chrome.tabs.onUpdated");

    let tabURLChangedIndicator;
    changeInfo.url !== undefined ? (tabURLChangedIndicator = "*") : (tabURLChangedIndicator = "");
    let tabStatusChangedIndicator;
    changeInfo.status !== undefined ? (tabStatusChangedIndicator = "*") : (tabStatusChangedIndicator= "");
    console.log("tab.url (tab.status) {changed values prefixed with *}:= "
        + tabURLChangedIndicator + tab.url + " (" + tabStatusChangedIndicator + tab.status + ")");

    if (changeInfo.status === "loading" && tab.url.includes("youtube.com/watch")) {
        /* Loading or reloading a YouTube video page changes `changeInfo.status` to `loading`. */

        const urlQueryString = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(urlQueryString);
        console.log("urlParameters:= " + urlParameters);

        chrome.tabs.sendMessage(tabId,
            message = {type: "NEW", videoId: urlParameters.get("v")},
            callback = (response) => {
                if (chrome.runtime.lastError) {
                    var errorMsg = chrome.runtime.lastError.message
                    if (errorMsg === "Could not establish connection. Receiving end does not exist.") {
                        // (in the manifest, "run_at" for `contentScript.js` set to "document_idle" instead of "document_start")
                        errorMsg = "ERROR: " + errorMsg
                            + "\n" + "=> No listener, most probably the content script was loaded too late.";
                    } else if (errorMsg === "The message port closed before a response was received.") {
                        errorMsg = "WARNING: " + errorMsg
                            + "\n" + "=> No response, most probably the listener did not send a response.";
                    }
                    console.log(errorMsg);
                } else {
                    if (response.type === "NEW-ok") {
                        console.log("ALL GOOD: 'NEW' message received, and reception confirmed with 'NEW-ok'.");
                    }
                }
            }
        );

    }

    console.groupEnd();
});
