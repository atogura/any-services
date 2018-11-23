(function () {
	console.log("*** Ionic Training RestApi ***");

	var express = require("express");
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	var cors = require('cors');

	var port = process.env.REST_PORT || 8085;
	var dbHost = process.env.MONGO_HOST || "localhost";
	var dbUrl = "mongodb://" + dbHost + ":27017/ionic-training-backend";

	var app = express();
	var appServer;

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json({ limit: '10mb' }));
	app.use(cors());

	mongoose.connect(dbUrl, { reconnectTries: Number.MAX_VALUE, autoReconnect: true, useNewUrlParser: true });

	mongoose.Promise = require('bluebird');

	mongoose.connection.on("error", (e) => {
		console.error(e);
		process.exit(-1);
	});

	mongoose.connection.on("disconnected", () => console.info("MongoDB connection disconnected"));

	mongoose.connection.on("reconnected", () => console.info("MongoDB connection reconnected"));
	mongoose.connection.on("open", () => {

		if (appServer) {
			appServer.close();
		}

		//public routes
		app.use('/', require('./api/api'));

		app.all('*', function (req, res, next) {
			console.log("   response");
			console.log("       path not found");
			res.status(404);
			return res.send('Not found');
		});

		appServer = app.listen(port, function () {
			console.log('Up and running on port ' + port);
			if (process.send) {
				process.send('server_started');
			}
		});

		process.on('message', (msg) => {
			console.log('Message from parent:', msg);
			if (msg.exit) {
				if (appServer) {
					appServer.close();
				}
				process.exit();
			}
		});

	});

	module.exports = app;

})();