var mongoose = require('mongoose');
var config = require('./Config');
var _ = require('lodash');

// Init
var PushAssociation;

var initialize = _.once(function () {
    //var db = mongoose.connect(config.get('mongodbUrl'));
    //mongoose.connection.on('error', errorHandler);
    var dbConfig = config.get('db');
    console.log('dbConfig - ' + JSON.stringify(dbConfig));
    var db = mongoose.connect(dbConfig.url, {server:{auto_reconnect:true}, user:dbConfig.user,pass:dbConfig.password});
    var dbConn = mongoose.connection;

    dbConn.on('error', function (err) {
        console.error('MongoDB connection error:', err);
    });
    dbConn.once('open', function callback() {
        console.info('MongoDB connection is established');
    });
    dbConn.on('disconnected', function() {
        console.error('MongoDB disconnected!');
        db = mongoose.connect(config.url, {server:{auto_reconnect:true}, user:config.user,pass:config.password});
    });
    dbConn.on('reconnected', function () {
        console.info('MongoDB reconnected!');
    });


    var pushAssociationSchema = new db.Schema({
        user: {
            type: 'String',
            required: true
        },
        type: {
            type: 'String',
            required: true,
            enum: ['ios', 'android'],
            lowercase: true
        },
        token: {
            type: 'String',
            required: true
        },
        pushUserId: {
            type: 'String',
            required: true
        },
        userId: {
            type: 'String',
            required: true
        },
        userType: {
            type: 'String',
            required: true
        }
    });

    // I must ensure uniqueness accross the two properties because two users can have the same token (ex: in apn, 1 token === 1 device)
    pushAssociationSchema.index({ user: 1, token: 1 , userId: 1}, { unique: true });

    PushAssociation = db.model('PushAssociation', pushAssociationSchema);

    return module.exports;
});

var add = function (user, deviceType, token, pushUserId,userId,userType) {
    var pushItem = new PushAssociation({user: user, type: deviceType, token: token, pushUserId: pushUserId,userId : userId,userType: userType});
    pushItem.save(function(err,result){
        console.log('pushAssociation err - ' + err);
        console.log('pushAssociation result - ' + result);
    });
};

var updateTokens = function (fromToArray) {
    fromToArray.forEach(function (tokenUpdate) {
        PushAssociation.findOneAndUpdate({token: tokenUpdate.from}, {token: tokenUpdate.to}, function (err) {
            if (err) console.error(err);
        });
    });
};

var getAll = function (callback) {
    var wrappedCallback = outputFilterWrapper(callback);

    PushAssociation.find(wrappedCallback);
};

var getForUser = function (user, callback) {
    var wrappedCallback = outputFilterWrapper(callback);

    PushAssociation.find({userId: user}, wrappedCallback);
};

var getForUsers = function (users, callback) {
    var wrappedCallback = outputFilterWrapper(callback);

    PushAssociation.where('userId')
        .in(users)
        .exec(wrappedCallback);
};

var removeForUser = function (user) {
    PushAssociation.remove({userId: user}, function (err) {
        if (err) console.dir(err);
    });
};

var removeDevice = function (token) {
    PushAssociation.remove({token: token}, function (err) {
        if (err) console.log(err);
    });
};

var removeDevices = function (tokens) {
    PushAssociation.remove({token: {$in: tokens}}, function (err) {
        if (err) console.log(err);
    });
};

var outputFilterWrapper = function (callback) {
    return function (err, pushItems) {
        if (err) return callback(err, null);

        var items = _.map(pushItems, function (pushItem) {
            return _.pick(pushItem, ['user', 'userId', 'type', 'token', 'pushUserId', 'userType'])
        });

        return callback(null, items);
    }
};

var initWrapper = function (object) {
    return _.transform(object, function (newObject, func, funcName) {
        if(!_.isFunction(func)) return newObject[funcName] = func;

        newObject[funcName] = function () {
            if (_.isUndefined(PushAssociation)) {
                initialize();
            }

            return func.apply(null, arguments);
        };
    });
};

var errorHandler = function(error) {
    console.error('ERROR: ' + error);
};

module.exports = initWrapper({
    add: add,
    updateTokens: updateTokens,
    getAll: getAll,
    getForUser: getForUser,
    getForUsers: getForUsers,
    removeForUser: removeForUser,
    removeDevice: removeDevice,
    removeDevices: removeDevices
});