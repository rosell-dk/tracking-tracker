
var regexs = [
    '.*clarity.ms',  // ie 'https://x.clarity.ms/collect' or 'https://c.clarity.ms/c.gif
    '.*v2/track', // ie https://dc.services.visualstudio.com/v2/track
    '.*.collect.js', // ie https://7237466.collect.igodigital.com/collect.js
    'fbevents', // https://connect.facebook.net/en_US/fbevents.js'
    'googletagmanager.*gtm', // https://www.googletagmanager.com/gtm.js?id=GTM-TPRSNTR&gtm_auth=w4ERo3HXKXOSNKX0IHeuSQ&gtm_preview=env-2&gtm_cookies_win=x
    'doubleclick\.net.*gpt\.js', // https://securepubads.g.doubleclick.net/tag/js/gpt.js
    '.*analytics.*insight', // https://snap.licdn.com/li.lms-analytics/insight.min.js
    '\.ads\.', // https://px.ads.linkedin.com/collect?v=2
    '.*facebook.com/tr/', // https://www.facebook.com/tr/?id=1445285039056800&
    'facebook.com.*trigger', // https://www.facebook.com/privacy_sandbox/pixel/register/trigger/?id=1445285039056800&ev=PageView&...
    'pol-statistics.com.*tb=event', // https://soma.pol-statistics.com/?tb=event
    'getflowbox.com/events', // https://a.getflowbox.com/events
]

function testURLAgainstRegexs(url) {
    for (var i = 0; i < regexs.length; i++) {
        var pattern = new RegExp(regexs[i]);
        if (pattern.test(url)) {
            return true;
        }
    }
    return false;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var url = new URL(details.url);

        if (testURLAgainstRegexs(url.hostname + url.pathname)) {            
            (async () => {
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, {details: details});
                } catch (e) {
                    // silently fail
                }
            })();    
        }        
    },
    { urls: ["<all_urls>"] },
    []
);

