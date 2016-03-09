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
            kango.console.log('data');
            kango.console.log(data);
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
        kango.console.log('oldToken');
        kango.console.log(oldToken);
        if (typeof oldToken != 'undefined' && oldToken) {
            checkIfLoggedIn.hideLoginInputs();
            return true;
        }
        return false;
    },

    hideLoginInputs: function() {
        $(".login-inputs-mr").hide();
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
    $('#form').submit(function() {
        return false;
    });

    $('#popup-close').click(function(event) {
        WindowTest.close();
    });

    kango.console.log('Yo man gonnna call text to url');

    checkIfLoggedIn.init();
    loadUrlToTextBox.init();
    ApiCall.init();
});
