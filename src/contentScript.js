//(() => {

console.log("content-script!");

let currentVideo = "";

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
    console.groupEnd();
};

//})();
