module.exports = {

	db:{
		url:'mongodb://172.31.28.83:27017,172.31.26.106:27017,172.31.23.89:27017/quotation_svc?replicaSet=fms',
		schema : '/../app/schema',
        user:'nodedbuser',
        password:'T#nC0s'
	},

	server:{
    		port:8001,
    		logs : {
    			folder: __dirname+'./../logs'
    		}
    	},

    	mailer : {
    		service : 'outlook365',
    		smtp: {
    			host: "smtp.office365.com",
    			secureConnection: false,
    			port: 587
    		},
			tls:{ciphers:'SSLv3'},
    		username :'taskmanfms@uds.in',
    		password :'Nov@2018',
            from:'taskmanfms@uds.in'
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
			quotation_view: 'https://taskmanadmin.uds.in/#/view-quotation/'
		}

};
