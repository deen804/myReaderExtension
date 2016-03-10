var helloMyReader = '';

function handleContextMenuClickMr() {
    kango.console.log('clickedElement');
    var clickedElement = null;

    if ('addEventListener' in document) {
        document.addEventListener('mousedown', function(event) {
            if (event.button == 2) {
                clickedElement = event.target;
            }
        }, true);
    } else {
        document.attachEvent('onmousedown', function(event) {
            event = event || window.event;
            if (event.button == 2) {
                clickedElement = event.srcElement;
            }
        });
    }

    kango.addMessageListener('ContextMenuItemClick', function(event) {
        alert(clickedElement);
        kango.console.log(clickedElement);
        var this_url = clickedElement.getAttribute('href');
        kango.console.log(this_url);
		postPageInfoMessage(this_url);
    });
}

function postPageInfoMessage(this_url) {
    var pageInfo = {
        right_click_url: this_url
    };

    kango.console.log('Sending page info...');

    // dispatch messsage to background script
    kango.dispatchMessage('PageInfo', pageInfo);
}


handleContextMenuClickMr();