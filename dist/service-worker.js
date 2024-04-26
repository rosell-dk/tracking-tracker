
import { trackerDb } from './trackerdb.js';

function getTracker(url) {
    var u = new URL(url);
    var hostPath = u.hostname + u.pathname;
    var domainNameNoSubdomain = u.hostname.split('.').slice(-2).join('.');

    var trackerName = trackerDb.domains[u.hostname] || trackerDb.domains[domainNameNoSubdomain];
    if (trackerName) {
        var tracker = trackerDb.patterns[trackerName];
        if (!tracker) {
            return null;
        }

        if (!tracker.filters || (tracker.filters.length == 0)) {
            return tracker;
        }
        for (var j=0; j<tracker.filters.length; j++) {
            var filter = tracker.filters[j];

            // If the filter is a regular expression, test it against the URL
            if (filter.startsWith('/') && filter.endsWith('/')) {
                var regex = new RegExp(filter.slice(1, -1));
                if (regex.test(hostPath)) {
                    return tracker;
                }
            } else if (filter.startsWith('||')) {
                // If the filter is a network filter rule, check if it matches the URL
                var networkFilter = filter.slice(2); // Remove the leading "||"
                if (networkFilter.endsWith("^$3p")) {
                    networkFilter = networkFilter.slice(0, -4); // Remove the trailing "^$3p"
                    // TODO: This filter should only be applied if third-party. So we should check against current domain
                    // and continue if the filter is the same as the domain of the current page
                }
                if (hostPath.indexOf(networkFilter) >= 0) {
                    return tracker;
                }
            }
        }
    }
    return null;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const tracker = getTracker(details.url);
        if (tracker) {
            // console.log(tracker.name + '(' + tracker.category + ')' + details.url);
            (async () => {
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, {details: details, tracker: tracker, category: trackerDb.categories[tracker.category]});
                } catch (e) {
                    // silently fail
                }
            })();    
        }        
    },
    { urls: ["<all_urls>"] },
    []
);
