module.exports = {

	db:{
		url:'mongodb://localhost:27017/quotation_svc'
		schema : '/../app/schema'
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
    		username :'karthickkumararajak@gmail.com',
    		password :'0838010059',
    		from:'UDS TaskMan'
    	},

    	pushService : {
    		 baseUrl:'http://localhost:8001'
    	},
    	oneSignal : {
    	    customer: {
    	        app_id: '7de11221-460c-4640-a30b-84f2ba0cee5f',
                gcm_id: 935098247956
    	    }

    	}

};