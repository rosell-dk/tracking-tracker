
import { trackerDb } from './trackerdb.js';
import { logos } from './logos.js';

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
            } else if (filter.endsWith("^")) {
                // cases like "/advertpro/servlet/view^"
                if (hostPath.indexOf(filter.substr(a.length - 1)) >= 0) {
                    return tracker;
                }
            } else {
                // cases like "/timetracking/abtastytiming.gif"
                if (hostPath.indexOf(filter) >= 0) {
                    return tracker;
                }
            }
            // TODO:
            // * can be a part of the pattern, it seems: "adoberesources.net/alloy/*/alloy^$3p"


            /*
            TODO: Add support for other types of filters.
            I for example see these filters: 
            - "/timetracking/abtastytiming.gif"
            - "/acton/bn^" and "/advertpro/servlet/view^"
            - "adbutler"
            - "/addthis_widget.js"
            - "/metrics\\..*\\.(com|net|org)\\/b\\/(s|ss)\\//"
            */
        }
    }
    return null;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        const tracker = getTracker(details.url);
        if (tracker) {
            (async () => {
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                const messageContent = {
                    details: details, 
                    tracker: tracker, 
                    category: trackerDb.categories[tracker.category],
                    logo: (logos[tracker.organization]) ? 'images/logos/' + tracker.organization + '.' + logos[tracker.organization] : null
                }    
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, messageContent);
                } catch (e) {
                    // silently fail
                }
            })();    
        }        
    },
    { urls: ["<all_urls>"] },
    []
);
