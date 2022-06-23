chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.group("chrome.tabs.onUpdated")
    console.log("tab.url:= " + tab.url);
    if (tab.url && tab.url.includes("youtube.com/watch")) {

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
