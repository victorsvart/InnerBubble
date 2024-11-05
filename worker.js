chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes("x.com")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: modifyPageContent
        });
    }
});

function modifyPageContent() {
    const reactroot = document.getElementById("react-root");
    if (!reactroot) {
        return; // Not ready yet, keep observing
    }

    const root = reactroot.getElementsByClassName("css-175oi2r r-13awgt0 r-12vffkv");
    if (!root || root.length === 0) {
        return; // Not ready yet, keep observing
    }

    const content = root[0].getElementsByClassName("css-175oi2r r-1f2l425 r-13qz1uu r-417010 r-18u37iz");
    if (!content || content.length === 0) {
        return; // Not ready yet, keep observing
    }

    let debounceTimeout;
    const observer = new MutationObserver(() => {
        // Clear the previous timeout to restart the debounce
        clearTimeout(debounceTimeout);

        // Set a timeout to execute the logic after the DOM has stopped changing
        debounceTimeout = setTimeout(() => {
            const main = content[0].children[3];
            if (!main) {
                console.error("Main element (children[3]) not found in content[0].");
                return;
            }

            const mainContent = main.children[0];
            if (!mainContent) {
                console.error("MainContent element (children[0]) not found in main.");
                return;
            }

            const innerMainContent = mainContent.children[0]?.children[0];
            if (!innerMainContent) {
                console.error("innerMainContent element (children[0].children[0]) not found in MainContent.");
                return;
            }

            const timeLine = innerMainContent.children[0]?.children[0]?.children[4]?.children[0].children[0];
            if (!timeLine) {
                console.error("timeLine element not found.");
                return;
            }

            // Check if the timeLine is still the loading spinner
            if (timeLine.className === "css-175oi2r r-1awozwy r-1777fci") {
                return; // Keep observing
            }

            // Now that the spinner is gone, proceed to update the timeline content
            const timeLineContent = timeLine.children[1]?.children[0]?.children[1].children[0];

            if (!timeLineContent) {
                console.error("timeLineContent element not found in MainContent.");
                return;
            }
            console.log(timeLineContent.children.length);
            for (let index = 0; index < timeLineContent.children.length; index++) {
                const element = timeLineContent.children[index];
                element.children[0].children[0].children[0].children[0].children[0].children[1].children[1].children[1].innerText = "i wish i could suck own dick"
            }
            
            observer.disconnect();
        }, 2000); 
    });

    observer.observe(content[0], {
        childList: true,
        subtree: true
    });
}
