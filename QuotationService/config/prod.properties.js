module.exports = {

	db:{
		//url:'mongodb://localhost:27017/delivery',
		url:'mongodb://ec2-54-254-131-235.ap-southeast-1.compute.amazonaws.com:27017,ec2-54-179-132-59.ap-southeast-1.compute.amazonaws.com:27017/delivery?replicaSet=amd1',
		schema : '/../app/schema',
        user:'askmedrivers', 
        password:'AmdUser123#'
	},

	server:{
		port:8000,
		logs : {
			folder: __dirname+'./../logs'
		}
	},

	mailer : {
			service : 'Godaddy',
			smtp: {
					host: "smtpout.asia.secureserver.net",
					secureConnection: true,
					port:465
			},
			username :'info@askmedrivers.com',
			password :'askmedrivers',
			from:'AskMeDrivers <no-reply@askmedrivers.com>'
	}

};