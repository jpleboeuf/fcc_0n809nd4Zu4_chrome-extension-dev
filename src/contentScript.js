//(() => {

console.log("content-script!");

let currentVideo = "";

let ytpVideo, ytpLeftControls;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, videoId } = request;
    if (type === "NEW") {
        currentVideo = videoId;
        newYouTubeVideoPage();
        sendResponse({type: "NEW-ok"});
    }      
});

const newYouTubeVideoPage = () => {
    console.group("newYouTubeVideoPage");
    console.log("currentVideo:= " + currentVideo);
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

const addBookmarkEventHandler = () => {
    console.group("addBookmarkEventHandler");
    let currentVideoTime = ytpVideo.currentTime;
    console.log("currentVideoTime:= " + currentVideoTime);
    console.groupEnd();
}

//})();
