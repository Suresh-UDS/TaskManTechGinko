var config = require('./Config');
var express = require('express');
var _ = require('lodash');
var pushAssociations = require('./PushAssociations');
var push = require('./PushController');
var html = require('html');
var app = express();

// Middleware
app.use(express.compress());
app.use(express.bodyParser());

app.set('view engine', 'html');

app.use(express.static(__dirname + '/../public'));

app.use(function(err, req, res, next) {
    res.status(500);
    //res.render('error', { error: err });
    res.send();
});

app.post('/*', function (req, res, next) {
    if (req.is('application/json')) {
        next();
    } else {
        res.status(406).send();
    }
});

// Main API
app.post('/api/push/subscribe', function (req, res) {
    var deviceInfo = req.body;
    console.log('Call -/subscribe - Request - '+ JSON.stringify(deviceInfo));
    push.subscribe(deviceInfo);

    res.send();
});

app.post('/unsubscribe', function (req, res) {
    var data = req.body;
    console.log('Call -/unsubscribe - Request - '+ data);
    if (data.user) {
        push.unsubscribeUser(data.user);
    } else if (data.token) {
        push.unsubscribeDevice(data.token);
    } else {
        return res.status(503).send();
    }

    res.send();
});

app.post('/api/push/send', function (req, res) {
    var notifs = [req.body];
    console.log('Call -/send - Request - '+ JSON.stringify(notifs));    

    var notificationsValid = sendNotifications(notifs);

    res.status(notificationsValid ? 200 : 400).send();
});

app.post('/sendBatch', function (req, res) {
    var notifs = req.body.notifications;
    console.log('Call -/sendBatch - Request - '+ notifs);
    var notificationsValid = sendNotifications(notifs);

    res.status(notificationsValid ? 200 : 400).send();
});

// Utils API
app.get('/users/:user/associations', function (req, res) {
    console.log('Call -/associations - Request - '+ req.params.user);	
    pushAssociations.getForUser(req.params.user, function (err, items) {
        if (!err) {
            res.send({"associations": items});
        } else {
            res.status(503).send();
        }
    });
});

app.get('/users', function (req, res) {
    pushAssociations.getAll(function (err, pushAss) {
        if (!err) {
            var users = _(pushAss).map('user').value();
            res.send({
                "users": users
            });
        } else {
            res.status(503).send()
        }
    });
});

app.delete('/users/:user', function (req, res) {
    pushController.unsubscribeUser(req.params.user);
    res.send('ok');
});


// Helpers
function sendNotifications(notifs) {
    var areNotificationsValid = _(notifs).map(validateNotification).min();

    if (!areNotificationsValid) return false;

    notifs.forEach(function (notif) {
        var users = notif.users,
            androidPayload = notif.android,
            iosPayload = notif.ios,
            payload = notif.payload,
            target = 'all';

        if (androidPayload && iosPayload) {
            target = 'all'
        } else if (iosPayload) {
            target = 'ios'
        } else if (androidPayload) {
            target = 'android';
        }

        var fetchUsers = users ? pushAssociations.getForUsers : pushAssociations.getAll,
            callback = function (err, pushAssociations) {
                if (err) return;

                if (target !== 'all') {
                    // TODO: do it in mongo instead of here ...
                    pushAssociations = _.filter(pushAssociations, {'type': target});
                }

                push.send(pushAssociations, payload, target);
            },
            args = users ? [users, callback] : [callback];

        // TODO: optim. -> mutualise user fetching ?
        fetchUsers.apply(null, args);
    });

    return true;
}

function validateNotification(notif) {
    var valid = true;

    valid = valid && (!!notif.ios || !!notif.android);
    // TODO: validate content

    return valid;
}

exports.start = function () {
    app.listen(config.get('webPort'),"0.0.0.0");
    console.log('logging works');
    console.log('Listening on port ' + config.get('webPort') + "...");

};
