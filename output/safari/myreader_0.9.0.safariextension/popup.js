var addArticleUrl = 'http://myreader.sridhar.co/api/articles/';

var userLoginUrlMyReader = 'http://myreader.sridhar.co/api/users/login';

var ApiCall = {
    init: function() {
        $('#xhr-get-login').click(function(event) {
            ApiCall.login();
        });

        $('#xhr-get-add-article').click(function(event) {
            ApiCall.addArticle();
        });
    },

    login: function() {
        var details = {
            url: userLoginUrlMyReader,
            method: 'POST',
            async: true,
            contentType: 'text',
            params: {
                emailId: $('#xhr-uid').val(),
                password: $('#xhr-upwd').val(),
            }
        };
        kango.xhr.send(details, function(data) {
            var token = '';
            if (typeof data != 'undefined' && data.status == 200 && data.response !== null) {
                gotData = JSON.parse(data.response);
                kango.console.log('parsedJson');
                kango.console.log(gotData);
                token = gotData.token;
                saveTokens(token);

                checkIfLoggedIn.hideLoginInputs();
            }
        });
    },

    addArticle: function() {
        var details = {
            url: addArticleUrl,
            method: 'POST',
            async: true,
            contentType: 'text',
            headers: {
                authorization: kango.storage.getItem('my_reader_token'),
            },
            params: {
                url: $('#xhr-url').val(),
            }
        };
        kango.xhr.send(details, function(data) {
            $('#xhr-result').val((data.status == 200 && data.response !== null) ? data.response : 'Error. Status=' + data.status);
            if (typeof data != 'undefined' && data.status == 200 && data.response !== null) {
                gotData = JSON.parse(data.response);
                kango.console.log('parsedJson');
                kango.console.log(gotData);

                $('#success-label-mr').show();
            }
        });
    }
};

function saveTokens(token) {
    if (typeof token != 'undefined' && token) {
        kango.console.log('token');
        kango.console.log(token);
        kango.storage.setItem('my_reader_token', token);
    }
}

var checkIfLoggedIn = {
    init: function() {
        var oldToken = kango.storage.getItem('my_reader_token');
        if (typeof oldToken != 'undefined' && oldToken) {
            checkIfLoggedIn.hideLoginInputs();
            return true;
        }
        return false;
    },

    hideLoginInputs: function() {
        $(".login-inputs-mr").hide();
        $("#xhr-url").focus();
    }
};

var loadUrlToTextBox = {
    init: function() {
        kango.browser.tabs.getCurrent(function(tab) {
            var currentTabUrl = tab.getUrl();

            kango.console.log('currentTabUrl');
            kango.console.log(currentTabUrl);

            $('#xhr-url').val(currentTabUrl);
        });
    }
};

var WindowTest = {
    close: function() {
        KangoAPI.closeWindow();
    },
};

KangoAPI.onReady(function() {
    console.log('OK');

    $('#form').submit(function() {
        return false;
    });

    $('#popup-close').click(function(event) {
        WindowTest.close();
    });

    $('#login-inputs-mr').keypress(function(e) {
        var key = e.which;
        kango.console.log(key);
        console.log(key);
        if (key == 13) {
            if ($('#xhr-get-login').is(':visible')) {
                $('#xhr-get-login').click();
            }
            return false;
        }
    });

    $('#xhr-url').keypress(function(e) {
        var key = e.which;
        kango.console.log(key);
        console.log(key);
        if (key == 13) {
            if ($('#xhr-get-add-article').is(':visible')) {
                $('#xhr-get-add-article').click();
            }
            return false;
        }
    });

    kango.ui.contextMenuItem.addEventListener(kango.ui.contextMenuItem.event.CLICK, function() {
        kango.console.log('Context menu item click');
        ApiCall.addArticle();
        kango.browser.tabs.getCurrent(function(tab) {
            tab.dispatchMessage('ContextMenuItemClick');
        });
    });

    kango.addMessageListener('PageInfo', function(event) {
        // is message from active tab?

        kango.console.log(event.data);
        if (event.target.isActive()) {
            kango.console.log(event.data);
        }
    });

    checkIfLoggedIn.init();
    loadUrlToTextBox.init();
    ApiCall.init();
});
