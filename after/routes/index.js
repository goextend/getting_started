require('dotenv').config();

const extendContainer = process.env.EXTEND_CONTAINER;

let extendHost = 'https://sandbox.auth0-extend.com';
let extendURL = `https://${extendContainer}.sandbox.auth0-extend.com/`;

if(process.env.EXTEND_HOST) {
	extendHost = process.env.EXTEND_HOST;
	extendURL = extendHost.replace('https://', `https://${extendContainer}.`)+'/';
}

const extendToken = process.env.EXTEND_TOKEN;

const request = require('request');

module.exports = function(app) {

	app.get('/', (req, res) => {
		res.render('index', { nav:'home' });
	});

	
	app.get('/settings', (req, res) => {
		res.render('settings', { 
			nav:'settings',
			container:extendContainer,
			token:extendToken,
			host:extendHost
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
			console.log(body);
			if(error) throw new Error(error);
			res.json(body);
		});

	});

};