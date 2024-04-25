function displayText(text) {
    // Create a text element
    var textElement = document.createElement('div');
    textElement.innerText = text;

    // Apply styles to the text element
    var top = Math.floor(Math.random() * 100);
    var left = Math.floor(Math.random() * 100);

    textElement.style.position = 'fixed';
    if (top < 50) {
        textElement.style.top = top + '%';
    } else {
        textElement.style.bottom = (100 - top) + '%';
    }

    if (left < 50) {
        textElement.style.left = left + '%';
    } else {
        textElement.style.right = (100 - left) + '%';
    }

    textElement.style.fontSize = '24px';
    textElement.style.fontWeight = 'bold';
    textElement.style.color = 'white';
    textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
    textElement.style.padding = '20px';
    textElement.style.borderRadius = '10px';
    textElement.style.opacity = '0';
    textElement.style.transition = 'opacity 0.5s';
    textElement.style.zIndex = '999999';
    textElement.style.pointerEvents = 'none';
    textElement.style.maxWidth = '50%';
    textElement.style.wordBreak = 'break-word';

    document.body.appendChild(textElement);

    // Trigger a reflow to ensure the transition effect works
    textElement.offsetWidth;

    // Fade in the text element
    textElement.style.opacity = '1';

    // Fade out and remove the text element after a delay
    setTimeout(function() {
        textElement.style.opacity = '0';
        setTimeout(function() {
            textElement.parentNode.removeChild(textElement);
        }, 500);
    }, 2500);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var url = new URL(request.details.url);
        displayText(url.hostname + url.pathname);
    }
);
