module.exports = {

	db:{
		url : "mongodb://10.1.2.132:27017,10.1.2.187:27017/quotation_svc?replicaSet=rs0",
		schema : '/../app/schema',
		user : "nodedbuser",
        password : "T#nC0s"
	},

	server:{
    		port:8001,
    		logs : {
    			folder: __dirname+'./../logs'
    		}
    	},

    	mailer : {
    		service : 'gmail',
    		smtp: {
    			host: "smtp.gmail.com",
    			secureConnection: true,
    			port: 465
    		},
    		username :'timesheettestuser1@gmail.com',
    		password :'Test123#',
            from:'UDS <no-reply@uds.com>'
    	},

    	pushService : {
    		 baseUrl:'http://localhost:8001'
    	},
    	oneSignal : {
    	    customer: {
    	        app_id: '7de11221-460c-4640-a30b-84f2ba0cee5f',
                gcm_id: 935098247956
    	    }

    	},
		url : {
			quotation_view: 'https://taskmanadmin.uds.in/#/view-quotation'
		}

};
