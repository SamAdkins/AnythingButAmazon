var stat = 'off';

// Function that cycles through the links in the tab, and removes any that are amazon links
function removeAmazonLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (link.href.includes('amazon')) {
            link.remove();
        }
    });

    // popular products
    const boxes1 = document.querySelectorAll('div.Ez5pwe');
    // more products (also popular, but catches the more products list)
    const boxes2 = document.querySelectorAll('div.MtXiu mZ9c3d wYFOId M919M W5CKGc wTrwWd');
    // supposed to catch the images, but doesn't work due to an inner div having aria-hidden=true
    const boxes3 = document.querySelectorAll('div.vCUuC m3LIae');

    // the actual links that don't include images
    const mainLinks = document.querySelectorAll('div.g Ww4FFb vt6azd tF2Cxc asEBEc');

    // sponsored content
    const sponsored = document.querySelectorAll('[data-dtld="amazon.com"]');

    // Images on the image tab
    const imagePage = document.querySelectorAll('div.eA0Zlc WghbWd FnEtTd mkpRId m3LIae RLdvSe qyKxnc ivg-i PZPZlf GMCzAd');

    // should remove sponsored content
    sponsored.forEach(spon => {
        spon.innerHTML = '';
        spon.remove();
    });

    // list item in the popular products (maybe check which of these is actually doing the work, lol)
    const listItems = document.querySelectorAll('li.I8iMf');

    listItems.forEach(item => {
        // if the item contains a span with class "WJMUdc rw5ecc" and the span contains the text "Amazon", remove the item
        let span = item.querySelector('.WJMUdc.rw5ecc');
        if (span && span.innerText.includes('Amazon')) {
            item.innerHTML = '';
            item.remove();
        }

        // print to console the class of the item
        console.log(item.className);
    });

    mainLinks.forEach(link => {
        const citation = link.querySelector('.qLRx3b.tjvcx.GvPZzd.cHaqb');
        if (citation && citation.innerText.includes('Amazon')) {
            link.innerHTML = '';
            link.remove();
        }
    });

    
    imagePage.forEach(image => {
        if (image.data-lpage.includes('Amazon')) {
            image.innerHTML = '';
            image.remove();
        }
    });

    

    // if the div has a class "gXGikb", there should be a span with class "WJMUdc rw5ecc" inside it
    // if the span with class "WJMUdc rw5ecc" contains the text "Amazon", remove the div
    boxes1.forEach(box => {
        // if the box contains a span called "WJMUdc rw5ecc" and the span contains the text "Amazon", remove the box
        const span = box.querySelector('.WJMUdc.rw5ecc');
        if (span && span.innerText.includes('Amazon')) {
            box.innerHTML = '';
            box.remove();
        }

        // print to console the class of the div
        console.log(box.className);
    });

    boxes2.forEach(box => {
        // if the box contains a span called "WJMUdc rw5ecc" and the span contains the text "Amazon", remove the box
        const span = box.querySelector('.WJMUdc.rw5ecc');
        if (span && span.innerText.includes('Amazon')) {
            box.innerHTML = '';
            box.remove();
        }

        // print to console the class of the div
        console.log(box.className);
    });

    // This one doesn't quite work yet, because the box it is in has aria-hidden=true, so my extension can't
    // see the boxes nested inside it, meaning it can't find the text. Need to figure out a way around that.
    // Check link: https://stackoverflow.com/questions/66947723/aria-hidden-true-elements-contain-focusable-descendents-best-way-to-fix-t
    boxes3.forEach(box => {
        // set nested div with class "wep10b vDF3Oc jIrdcd" aria-hidden attribute to false
        const hidden = box.querySelector('.wep10b.vDF3Oc.jIrdcd');
        hidden.ariaHidden = false;

        // if the box contains a span called "WJMUdc rw5ecc" and the span contains the text "Amazon", remove the box
        const div = box.querySelector('.R8BTeb.q8U8x.LJEGod.du278d.i0Rdmd');
        if (div && div.textContent.includes('Amazon')) {
            box.innerHTML = '';
            box.remove();
        }

        // print to console the class of the div
        console.log(box.className);
    });

}

chrome.action.onClicked.addListener((tab) => {
    if (stat == 'on') {
        stat = 'off';
    } else {
        stat = 'on';
    }

    // set badge text
    chrome.action.setBadgeText({ text: stat });
    
    // Run the function to remove all amazon links from the page if the status is set to on.
    if (!tab.url.includes('chrome://') && stat == 'on') {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: removeAmazonLinks
        });
    }

    // if the tab is set to off, reload the page so that the amazon results are returned.
    if (!tab.url.includes('chrome://') && stat == 'off') {
        chrome.tabs.reload();
    }
});

// Listen for the page to be updated, and if the extension is on, run the function
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (stat == 'on') {
        if (changeInfo.status === 'complete' && !tab.url
            .includes('chrome://')) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: removeAmazonLinks
            });
        }  
    }
});

// Listen for the webrequest to be completed, and if the extension is on, run the function
chrome.webRequest.onCompleted.addListener(function(details) {
    if (stat == 'on'){
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            function: removeAmazonLinks
        });
    }
}, {urls: ["<all_urls>"]});