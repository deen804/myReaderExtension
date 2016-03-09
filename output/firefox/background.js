function sendReqMyReader(obj) {
    var url_to_fetch = 'http://dark.dev.com/guzzle/demo-api/blah.php';

    var qryObj = obj;

    var details = {
        method: 'POST',
        url: url_to_fetch,
        async: true,
        contentType: 'text',
        params: obj
    };

    kango.xhr.send(details, function(data) {
        if (data.status == 200 && data.response != null) {
            var text = data.response;
            kango.console.log(text);
        } else { // something went wrong
            kango.console.log('something went wrong');
        }
    });
}

kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
    kango.console.log('Button clicked!');
    // output current tab url to console
    kango.browser.tabs.getCurrent(function(tab) {
        // tab is KangoBrowserTab object
        var currentTabUrl = tab.getUrl();
        sendReqMyReader({
            currentTabUrl: currentTabUrl,
        });
    });
});
