

function displayLogo(messageContent) {

    const {details, tracker, category, logo} = messageContent;

    var el = document.createElement('img');    
    if (logo) {
        el.src = chrome.runtime.getURL(logo);
    } else {
        el.src = chrome.runtime.getURL('images/agent.svg');
    }

    var top = Math.floor(Math.random() * 98) + 1;
    var left = Math.floor(Math.random() * 98) + 1;

    el.style.position = 'fixed';
    if (top < 50) {
        el.style.top = top + '%';
    } else {
        el.style.bottom = (100 - top) + '%';
    }

    if (left < 50) {
        el.style.left = left + '%';
    } else {
        el.style.right = (100 - left) + '%';
    }

    var w = Math.max(Math.floor(window.innerWidth / 25), 70) + 'px';

    el.style.opacity = '0';
    el.style.transition = 'opacity 1.5s, transform 3s';
    el.style.transitionTimingFunction = "ease-in-out";
    el.style.transformOrigin = 'center';
    el.style.zIndex = '999999';
    el.style.pointerEvents = 'none';
    el.style.width = w;
    el.style.height = w;
    el.style.transform = 'scale(0.7)';

    document.body.appendChild(el);

    // Trigger a reflow to ensure the transition effect works
    el.offsetWidth;

    // Fade in the element
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
    
    // Fade out and remove the element after a delay
    setTimeout(function() {
        el.style.opacity = '0';
        el.style.transform = 'scale(0.7)';
        setTimeout(function() {
            el.parentNode.removeChild(el);
        }, 3000);
    }, 2000);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var category = request.tracker.category;
        if ((category !== 'cdn') && (category !== 'hosting')) {           
            displayLogo(request);
        }
    }
);
