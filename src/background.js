chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.group("chrome.tabs.onUpdated")
    console.log("tab.url:= " + tab.url);
    if (tab.url && tab.url.includes("youtube.com/watch")) {
        const urlQueryString = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(urlQueryString);
        console.log("urlParameters:= " + urlParameters);            
    }
    console.groupEnd();
    }
);
