require('dotenv').config();

const extendContainer = process.env.EXTEND_CONTAINER;
let extendHost = 'https://sandbox.auth0-extend.com';
let extendURL = `https://${extendContainer}.sandbox.auth0-extend.com/`;
let extendToken = process.env.EXTEND_TOKEN;

/*
If you define process.env.EXTEND_HOST, you are a starter account, 
otherwise you are freemium, which is still cool!
*/
if(process.env.EXTEND_HOST) {
	extendHost = process.env.EXTEND_HOST;
	extendURL = extendHost.replace('https://', `https://${extendContainer}.`)+'/';
}

const request = require('request');

module.exports = function(app) {

	app.get('/', (req, res) => {
		res.render('index', { nav:'home' });
	});

	
	app.get('/settings', (req, res) => {
		res.render('settings', { 
			nav:'settings',
			container:extendContainer,
			host:extendHost,
			token:extendToken
		});
	});
	
	app.post('/api/leads',  (req, res) => {
		let data = req.body;
		// this is where - normally - a process of somesort would persist the value
		// data.created is simply demonstrating a server-side change
		data.created = new Date();

		let options = {
			method:'POST',
			url:extendURL +'saveLead',
			headers:{'Authorization':`Bearer ${extendToken}`},
			json:data
		};

		request(options, (error, response, body) => {
			if(error) throw new Error(error);
			res.json(body);
		});

	});

};