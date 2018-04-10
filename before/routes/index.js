//in memory var for cheap/simple storage
var webhookUrl = 'http://localhost:3000/webhook';

const request = require('request');

module.exports = function(app) {

	app.get('/', (req, res) => {
		res.render('index', { nav:'home' });
	});

	app.post('/api/leads',  (req, res) => {
		let data = req.body;
		// this is where - normally - a process of somesort would persist the value
		// data.created is simply demonstrating a server-side change
		data.created = new Date();

		if(webhookUrl != '') {

			let options = {
				method:'POST',
				url:webhookUrl,
				json:data
			};

			request(options, (error, response, body) => {
				if(error) throw new Error(error);
				res.json(body);
			});

		} else {
			res.json(data);
		}
	});

	app.post('/webhook', (req, res) => {
		let lead = req.body;

		if(lead.value > 1000) lead.vip = true;
		res.json(lead);
	});

	app.get('/settings', (req, res) => {
		res.render('settings', { 
			nav:'settings',
			webhookUrl:webhookUrl
		});
	});

	app.post('/settings', (req, res) => {
		webhookUrl = req.body.webhookUrl;
		res.redirect('/settings');
	});

};