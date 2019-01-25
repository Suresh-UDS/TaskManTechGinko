var config = require('./Config');

//var restify = require('restify');
var https = require('https');

//const OneSignalClient = require('node-onesignal');

var oneSignalConfig = config.get('oneSignal');
//const client = new OneSignalClient(oneSignalConfig.appId, oneSignalConfig.apiKey);

/*
var client = restify.createJsonClient({
   url: 'https://' + oneSignalConfig.host,
   version: '*'
});
*/


var sendNotification = function(data) {

   //send notification
   /*
   client.sendNotification(data.contents, {
       included_segments: 'all',
       isIos: data.isIos,
       isAndroid: data.isAndroid,
       include_player_ids: data.include_player_ids
   });
   */
    console.log('usertype = '+ data.userType);
    var oneSignalUserTypeConfig = (data.userType == 'customer' ? oneSignalConfig.customer : oneSignalConfig.driver);

    console.log(oneSignalUserTypeConfig.appId);

//    var groupMessage = 'AMD_MSG';

    var notifyData = {
      app_id: oneSignalUserTypeConfig.appId,
      contents: {"en": data.message},
      include_player_ids: data.users,
      large_icon: "",
      small_icon: "",
      data:{"bookingId": data.bookingId,
      "stateId": data.stateId,
      "event": data.event},
//    android_group: groupMessage,
      isIos : data.isIos,
      isAndroid : data.isAndroid
    };

     var headers = {
       "Content-Type": "application/json",
       "Authorization": "Basic " + oneSignalUserTypeConfig.apiKey
     };


     var options = {
       host: oneSignalUserTypeConfig.host,
       port: oneSignalUserTypeConfig.port,
       path: oneSignalUserTypeConfig.path,
       method: oneSignalUserTypeConfig.method,
       headers: headers
     };

     var req = https.request(options, function(res) {
       res.on('data', function(data) {
         console.log("Response:");
         console.log(JSON.parse(data));
       });
     });

     req.on('error', function(e) {
       console.log("ERROR:");
       console.log(e);
     });

     console.log('notifyData - '+ JSON.stringify(notifyData));
     req.write(JSON.stringify(notifyData));
     req.end();


}

module.exports = {
  sendNotification :  sendNotification
}

