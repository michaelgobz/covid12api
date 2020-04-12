const express = require('express')
const fs = require('fs');
const xml = require('xml');
const morgan = require('morgan')
const path = require('path')
const port = process.env.PORT || 7000;
const app = express()
const covid19ImpactEstimator = require('./estimator');
const bodyParser = require('body-parser');

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// data
const data = {
    region: {
        name: "Africa",
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
    },
    periodType: "days",
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
} 
// setup the logger
// body-perser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logger = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res),'ms'
    ].join('\t')
},
 { stream: accessLogStream, })
app.use(logger)

app.get('/', (req, res) => {
    res.send('welcome to Covid-19 API')
});
app.get('/api/v1/on-covid-19', (req, res) => {
    res.json(
     covid19ImpactEstimator(data)
    )
});

app.post('/api/v1/on-covid-19', (req, res) => {
    res.status(201).json(req.body);
});

app.get('/api/v1/on-covid-19/json', (req, res) => {
    res.json(
        covid19ImpactEstimator(data)
    );
});
app.get('/api/v1/on-covid-19/xml', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.status(200).send(xml(data));
})
//server listening
app.listen(port, () => {
    console.log(`api is running at port ${port}`)
})