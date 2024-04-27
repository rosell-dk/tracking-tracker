

function displayLogo(messageContent) {

    const {details, tracker, category, logo} = messageContent;

    var el = document.createElement('img');
    if (logo) {
        el.src = chrome.runtime.getURL(logo);
    } else {
        //el.src = chrome.runtime.getURL('images/anon.svg');
        el.src = chrome.runtime.getURL('images/the-eye.png');
    }

    var top = Math.floor(Math.random() * 100);
    var left = Math.floor(Math.random() * 100);

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

    el.style.opacity = '0';
    el.style.transition = 'opacity 3s, transform 2s';
    el.style.transitionTimingFunction = "ease-in-out";
    el.style.transformOrigin = 'center';
    el.style.zIndex = '999999';
    el.style.pointerEvents = 'none';
    el.style.width = '100px';
    el.style.height = '100px';
    el.style.transform = 'scale(0.3)';

    document.body.appendChild(el);

    // Trigger a reflow to ensure the transition effect works
    el.offsetWidth;

    // Fade in the element
    el.style.transform = 'scale(1)';
    el.style.opacity = '1';
    
    // Fade out and remove the element after a delay
    setTimeout(function() {
        el.style.opacity = '0';
        el.style.transform = 'scale(0)';
        setTimeout(function() {
            el.parentNode.removeChild(el);
        }, 3000);
    }, 2400);
}


function displayText(details, tracker, category) {

    // chrome.runtime.getURL("images/")

    var el = document.createElement('div');
    el.innerText = tracker.name + ' (' + category.name + ')';

    var top = Math.floor(Math.random() * 100);
    var left = Math.floor(Math.random() * 100);

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

    el.style.backgroundColor = category.color;
    el.style.padding = '20px';
    el.style.borderRadius = '10px';

    el.style.fontSize = '24px';
    el.style.fontWeight = 'bold';
    el.style.color = 'white';
    el.style.wordBreak = 'break-word';

    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s';
    el.style.zIndex = '999999';
    el.style.pointerEvents = 'none';
    el.style.maxWidth = '50%';

    document.body.appendChild(el);

    // Trigger a reflow to ensure the transition effect works
    el.offsetWidth;

    // Fade in the element
    el.style.opacity = '1';

    // Fade out and remove the element after a delay
    setTimeout(function() {
        el.style.opacity = '0';
        setTimeout(function() {
            el.parentNode.removeChild(el);
        }, 500);
    }, 2500);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = new URL(request.details.url);

        var category = request.tracker.category;
        if ((category !== 'cdn') && (category !== 'hosting')) {
            //displayText(request.details, request.tracker, request.category);
            displayLogo(request);
        }
    }
);
