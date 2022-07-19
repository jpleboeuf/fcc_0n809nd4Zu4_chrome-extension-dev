//(() => {

console.log("content-script!");

let currentVideo = "";
let currentVideoBookmarks = [];

let ytpVideo, ytpLeftControls;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, value, videoId } = request;
    if (type === "NEW") {
        currentVideo = videoId;
        newYouTubeVideoPage();
        sendResponse({type: "NEW-ok"});
    } else if (type === "PLAY") {
        ytpVideo.currentTime = value;
    } else if (type === "DELETE") {
        currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
        /* TODO: factor this block of code. */
        chrome.storage.local.set(
            {[currentVideo]: JSON.stringify(currentVideoBookmarks)},  // `[currentVideo]` is a computed property name.
            () => {
                console.log("Bookmark removed from storage!");
                chrome.storage.local.get(null, function(stor) {
                    console.log("Bookmarks currently in storage for the current video: ", stor[currentVideo]);
                });
            }
        );
        /* --- */
        sendResponse(currentVideoBookmarks);
    }
});

const newYouTubeVideoPage = async () => {
    console.group("newYouTubeVideoPage");
    console.log("currentVideo:= " + currentVideo);
    /* Load the list of stored bookmarks for the current video: */
    currentVideoBookmarks = await fetchBookmarks();
    document.addEventListener("DOMContentLoaded", newYouTubeVideoPageReadyEventHandler, false);
    console.groupEnd();
};

const newYouTubeVideoPageReadyEventHandler = () => {
    console.group("newYouTubeVideoPageReadyEventHandler");

    ytpVideo = document.getElementsByClassName("video-stream")[0];
    //console.log(ytpVideo);

    const bookmarkBtn = document.createElement("img");
    bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
    bookmarkBtn.className = "ytp-button" /* base class for YT buttons */ + " " + "bookmark-btn";
    bookmarkBtn.title = "Bookmark current timestamp";
    //console.log(bookmarkBtn)

    ytpLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    //console.log(ytpLeftControls);

    ytpLeftControls.appendChild(bookmarkBtn);

    bookmarkBtn.addEventListener("click", addBookmarkEventHandler);
    console.groupEnd();
}

const convSecondsToDHMS = (seconds) => {
    console.group("convSecondsToDHMS");

    const SECONDS_IN_1_MIN = 60;
    const SECONDS_IN_1_HOUR = SECONDS_IN_1_MIN * 60;
    const SECONDS_IN_1_DAY = SECONDS_IN_1_HOUR * 24;

    let d = Math.floor(seconds/SECONDS_IN_1_DAY);
    //console.log("d:= " + d);
    seconds -= d*SECONDS_IN_1_DAY;
    let h = Math.floor(seconds/SECONDS_IN_1_HOUR);
    //console.log("h:= " + h);
    seconds -= h*SECONDS_IN_1_HOUR;
    let m = Math.floor(seconds/SECONDS_IN_1_MIN);
    //console.log("m:= " + m);
    seconds -= m*SECONDS_IN_1_MIN;
    let s = Math.floor(seconds);
    //console.log("s:= " + s);

    let dhmsStr = d.toString().padStart(2, "0")
          + ":" + h.toString().padStart(2, "0")
          + ":" + m.toString().padStart(2, "0")
          + ":" + s.toString().padStart(2, "0");
    //console.log("dhmsStr:= " + dhmsStr);

    /* The YouTube player displays only the h- and m- parts, when the other parts can be discarded: */
    let c = 2
    while (dhmsStr.substring(0,3) === "00:" && c > 0) {
        dhmsStr = dhmsStr.substring(3);
        c -= 1;
    }
    //console.log("dhmsStr:= " + dhmsStr);

    /* The YouTube player does not display the leading zero: */
    dhmsStr = (dhmsStr.substring(0,1) === "0") ? dhmsStr.substring(1) : dhmsStr;
    //console.log("dhmsStr:= " + dhmsStr);

    console.groupEnd();
    return dhmsStr;
}

const addBookmarkEventHandler = async () => {
    console.group("addBookmarkEventHandler");
    let currentVideoDHMSTime = convSecondsToDHMS(ytpVideo.currentTime);
    console.log("currentVideoDHMSTime:= " + currentVideoDHMSTime);

    /* Refresh the list of bookmarks before adding a new one: */
    currentVideoBookmarks = await fetchBookmarks();

    console.log("Adding a new bookmark...")
    const newBookmark = {
        time: ytpVideo.currentTime,
        desc: "Bookmark at " + currentVideoDHMSTime
    };
    currentVideoBookmarks = [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time-b.time)
    console.log("currentVideoBookmarks:= ", currentVideoBookmarks);
    chrome.storage.local.set(
        {[currentVideo]: JSON.stringify(currentVideoBookmarks)},  // `[currentVideo]` is a computed property name.
        () => {
            console.log("New bookmark added to storage!");
            chrome.storage.local.get(null, function(stor) {
                console.log("Bookmarks currently in storage for the current video: ", stor[currentVideo]);
            });
        }
    );

    console.groupEnd();
}

const fetchBookmarks = () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(currentVideo, (currentVideoBookmarksKVFromStor) => {
            const currentVideoBookmarksFromStor =
                (currentVideoBookmarksKVFromStor[currentVideo] ?
                    JSON.parse(currentVideoBookmarksKVFromStor[currentVideo]) : []);
            console.log("Bookmarks fetched from storage for the current video: ", currentVideoBookmarksFromStor);
            resolve(currentVideoBookmarksFromStor);
        })
    });
}

//})();
