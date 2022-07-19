import { getCurrentTab } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentTab = await getCurrentTab();
    /* --- TODO: factor these blocks of code with background.js & contentScript.js. */
    const urlQueryString = currentTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(urlQueryString);
    console.log("urlParameters:= " + urlParameters);
    /* --- */
    const videoId = urlParameters.get("v");
    if (videoId && currentTab.url.includes("youtube.com/watch")) {
        /* --- */
        chrome.storage.local.get(videoId, (currentVideoBookmarksKVFromStor) => {
            const currentVideoBookmarksFromStor =
                (currentVideoBookmarksKVFromStor[videoId] ?
                    JSON.parse(currentVideoBookmarksKVFromStor[videoId]) : []);
            console.log("Bookmarks fetched from storage for the current video: ", currentVideoBookmarksFromStor);
            viewBookmarks(currentVideoBookmarksFromStor);
        });
        /* --- */
    } else {
        const container = document.getElementsByClassName('container')[0];
        container.innerHTML = '<div><div class="title">Not a YouTube video page.</div></div>';
    }
    /* --- */
});

const viewBookmarks = (currentVideoBookmarks=[]) => {
    const bookmarksElement = document.getElementById('bookmarks');
    bookmarksElement.innerHTML = '';
    if (currentVideoBookmarks.length > 0) {
        for (let i = 0; i < currentVideoBookmarks.length; i++) {
            const bookmark = currentVideoBookmarks[i];
            addBookmarkToView(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<em class="bookmark-row">No bookmarks to show.</em>';
    }
};

const addBookmarkToView = (bookmarksElement, bookmark) => {
    const bookMarkTitleElement = document.createElement('div');
    const newBookmarkElement = document.createElement('div');
    bookMarkTitleElement.textContent = bookmark.desc;
    bookMarkTitleElement.className = 'bookmark-title';
    newBookmarkElement.id = 'bookmark-' + bookmark.time;
    newBookmarkElement.className = 'bookmark';
    newBookmarkElement.setAttribute('timestamp', bookmark.time);
    newBookmarkElement.appendChild(bookMarkTitleElement);

    bookmarksElement.appendChild(newBookmarkElement);
};
