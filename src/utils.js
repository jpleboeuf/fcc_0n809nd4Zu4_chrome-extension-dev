export async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);  // `[tab]` destructures the received array.
    return tab;
}
