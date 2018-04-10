require('dotenv').config();

const auth0Container = process.env.AUTH0_CONTAINER;
const auth0ExtendURL = `https://${auth0Container}.run.webtask.io/`;
const auth0Token = process.env.AUTH0_TOKEN;

const request = require('request');

module.exports = function(app) {

	app.get('/', (req, res) => {
		res.render('index', { nav:'home' });
	});

	
	app.get('/settings', (req, res) => {
		res.render('settings', { 
			nav:'settings',
			container:auth0Container,
			token:auth0Token
		});
	});
	
	app.post('/api/leads',  (req, res) => {
		let data = req.body;
		// this is where - normally - a process of somesort would persist the value
		// data.created is simply demonstrating a server-side change
		data.created = new Date();

		let options = {
			method:'POST',
			url:auth0ExtendURL +'saveLead',
			headers:{'Authorization':`Bearer ${auth0Token}`},
			json:data
		};

		request(options, (error, response, body) => {
			if(error) throw new Error(error);
			res.json(body);
		});

	});

};