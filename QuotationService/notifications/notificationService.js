var mongoose = require('mongoose');
var moment = require('moment');
var OneSignal = require('onesignal-node');
var notificationSchema = mongoose.model('Notification')

// create an export function to encapsulate the controller's methods
// create a new Client for a single app
var myClient = new OneSignal.Client({
    userAuthKey: 'N2Y1NWE4YmYtODMzMy00MWQ3LThiMTQtMGQwN2IxYzFjOTVj',
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: 'Y2Q0ZDQwMmItMjQzNi00YmQ3LWFjNTgtMDZlZGY3MmQ5ZWE4', appId: '647127c6-f890-4aad-b4e2-52379805f26c' }
});
module.exports = {

    subscribe: function(userId, userType, oneSignalId){
        console.log("Subscribe for push notification");

        var notificationSchema = new notificationSchema();
        notificationSchema.userId = userId;
        notificationSchema.userType= userType;
        notificationSchema.oneSignalId = oneSignalId;
        notificationSchema.save(function(err, notificationSchema){
            if(err){
                console.log("Error");
                console.log(err);
            }else{
                console.log("Notification schema result");
                console.log(notificationSchema);
            }
        })
    },

    sendNotification: function(senderId, message){
        var notification = new OneSignal.Notification({
            contents:{
                en:message
            }
        });

        notification.setIncludedSegments(['All']);

        myClient.sendNotification(notification, function(err,httpResponse,data){
            if(err){
                console.log('Something went wrong..');
            }else{
                console.log(data,httpResponse.statusCode);
            }
        })
    }


};
