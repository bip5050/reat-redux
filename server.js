'use strict';

const PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();
const path = require('path');

const {createProxyMiddleware } = require('http-proxy-middleware');

// redirect all http request to https    
const yes = require('appengine-express-https');
app.use(yes());

const TP_SERVICE_URL = process.env.TP_SERVICE_URL || 'http://tp-api.dev.foodjets.com';//https://beta-tp-api.foodjets.com //http://tp-api.dev.foodjets.com //http://localhost:4737 http://192.168.0.67:5656
//const FLEET_SERVICE_URL = process.env.FLEET_SERVICE_URL || 'https://onfleet.com/';//http://localhost:4737 http://192.168.0.67:5656

// file serve
app.use(express.static(__dirname + '/build'));

// http proxy
/*
app.use('/api', Proxy({
  target: process.env.TP_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/v1/merchant'
    }
}));
*/
// health check
app.use('/liveness_check',function(req, res){
	res.status(200).send(`healthy`);
});

// health check
app.use('/readiness_check',function(req, res){
	res.status(200).send(`healthy`);
});

app.use('/api', createProxyMiddleware({
  target: TP_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/v1/merchant'
    }
}));


app.use('/api2', createProxyMiddleware({
  target: TP_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api2': '/v2/merchant'
    }
}));


/* app.use('/fleet', createProxyMiddleware({
  target: FLEET_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/fleet': '/api'
    }
})); */


// health check
app.get('/_ah/health',function(req, res){
	res.status(200).send(`healthy`);
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});

// Create server
app.listen(PORT, function listen() {
  console.log('Server listening on port ' + PORT + '!');
});


module.exports = app;
