/**
 * Created with JetBrains WebStorm.
 * User: Vincent Lemeunier
 * Date: 06/06/13
 * Time: 15:41
 */

var _ = require('lodash'),
pushAssociations = require('./PushAssociations'),
apnPusher = require('./APNPusher'),
gcmPusher = require('./GCMPusher'),
oneSignal = require('./OneSignal'),
config = require('./Config');
var async = require('async');

var send = function (pushAssociations, payload, target) {
    var segments = 'All';
    var isAndroid = true;
    var isIOS = true;
    if(target == 'android') {
        isIOS = false;
    }else if(target == 'ios') {
        isAndroid = false;
    }
	console.log('pushcontroller - send method called' + pushAssociations);
	var androidUsers;
	var iosUsers;
    var users = [];
    var userType;
    async.waterfall([
        function(cb) {
        	if(pushAssociations && pushAssociations.length > 0) {
        	    userType = pushAssociations[0].userType;
        	}
        	if(isAndroid) {
                androidUsers = _.filter(pushAssociations,{type: 'android'}).map(function(item,index){
                                            return item.pushUserId;
                                    });
                users = users.concat(androidUsers);
        	}
            console.log('pushcontroller - send method androidUsers -' + androidUsers);
        	if(isIOS) {
                iosUsers = _.filter(pushAssociations,{type: 'ios'}).map(function(item,index){
                                        return item.pushUserId;
                                    });
                users = users.concat(iosUsers);
        	}
            console.log('pushcontroller - send method iosUsers -' + iosUsers);
            console.log('pushcontroller - send method users -' + users);
            cb();
        },

        function(cb) {

            var data = {
              message: payload.data.message,
              users : users,
              userType: userType,
              isIos : isIOS,
              isAndroid : isAndroid
            };
            oneSignal.sendNotification(data);

        }

    ])


};

var sendOld = function (pushAssociations, androidPayload, iosPayload) {
	console.log('pushcontroller - send method called');
    var androidTokens = _.filter(pushAssociations,{type: 'android'}).map(function(item,index){
    							return item.token;
    					});
    var iosTokens = _.filter(pushAssociations,{type: 'ios'}).map(function(item,index){
					    	return item.token;
					    });
    console.log('pushcontroller - send method androidTokens -' + androidTokens);
    if (androidPayload && androidTokens.length > 0) {
        var gcmPayload = gcmPusher.buildPayload(androidPayload);
        console.log('pushcontroller - send method gcmPayload -' + JSON.stringify(gcmPayload));
        gcmPusher.push(androidTokens, gcmPayload);
    }

    if (iosPayload && iosTokens.length > 0) {
        var apnPayload = apnPusher.buildPayload(iosPayload);
        apnPusher.push(iosTokens, apnPayload);
    }
};

var sendUsers = function (users, payload) {
    pushAssociations.getForUsers(users, function (err, pushAss) {
        if (err) return;
        send(pushAss, payload);
    });
};

var subscribe = function (deviceInfo) {
	console.log('pushcontroller - subscribe called -' + JSON.stringify(deviceInfo));
    pushAssociations.add(deviceInfo.user, deviceInfo.type, deviceInfo.token, deviceInfo.pushUserId, deviceInfo.userId, deviceInfo.userType);
};

var unsubscribeDevice = function (deviceToken) {
    pushAssociations.removeDevice(deviceToken);
};

var unsubscribeUser = function (user) {
    pushAssociations.removeForUser(user);
};

module.exports = {
    send: send,
    sendUsers: sendUsers,
    subscribe: subscribe,
    unsubscribeDevice: unsubscribeDevice,
    unsubscribeUser: unsubscribeUser
};
