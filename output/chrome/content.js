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
        //alert(clickedElement);
        kango.console.log(clickedElement);
        var this_url = clickedElement.getAttribute('href');
        kango.console.log(this_url);
		postPageInfoMessage(this_url);
    });
}

function postPageInfoMessage(this_url) {
    if(typeof this_url == 'undefined' || !this_url || (this_url.indexOf("http:") !== 0)){
        return false;
    }
    var pageInfo = {
        right_click_url: this_url
    };

    kango.console.log('Sending page info...');
    kango.console.log(pageInfo);

    // dispatch messsage to background script
    kango.dispatchMessage('RightClickURlMr', pageInfo);
}


handleContextMenuClickMr();