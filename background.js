/*

let counter = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(tab);
  if (tab.status == "loading" && tab.url.includes("sys_update_set")) {
    console.log("test");

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: "id"//urlParameters.get("v"),
    });
  }
});

*/