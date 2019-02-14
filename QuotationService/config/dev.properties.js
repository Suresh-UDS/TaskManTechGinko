module.exports = {

	db:{
		url:'mongodb://localhost:27017/quotation_svc',
		//url:'mongodb://ec2-52-221-245-74.ap-southeast-1.compute.amazonaws.com:27017/delivery',
		schema : '/../app/schema',
		user:'clssmongo',
		password:'i0ps2gal'
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
        password :'Task@2018',
        from:'taskmanfms@uds.in'
    },

	pushService : {
		  baseUrl:'http://ec2-52-76-59-180.ap-southeast-1.compute.amazonaws.com:9000'
		 //baseUrl:'http://192.168.1.6:9000'
	},
	oneSignal : {
	    customer: {
	        app_id: '7de11221-460c-4640-a30b-84f2ba0cee5f',
            gcm_id: 935098247956
	    },
        driver:{
            app_id: 'c2d56465-31bf-4307-b875-a4ded8589123',
            gcm_id: 110710812821
        }

	},
	url : {
		quotation_view: 'http://ec2-54-169-225-123.ap-southeast-1.compute.amazonaws.com:8088/#/view-quotation'
	}

};