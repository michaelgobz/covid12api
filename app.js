const express = require('express')
const fs = require('fs');
const js2xmlparser = require('js2xmlparser');
const morgan = require('morgan')
const path = require('path')
const covid19ImpactEstimator = require('./estimator');
const bodyParser = require('body-parser');

const port = process.env.PORT;
const app = express();

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

// body-perser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup the logger
const logger = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res),'ms'
    ].join('\t\t')
},
 { stream: accessLogStream, })
app.use(logger)

//app.get('/', (req, res, next) => {
    //res.send('welcome to Covid-19 API')
//});

const post_data = { region: {}, };

app.post('/api/v1/on-covid-19', (req, res, next) => {
    post_data.region.name = req.body.region.name;
    post_data.region.avgAge = req.body.region.avgAge;
    post_data.region.avgDailyIncomeInUSD = req.body.region.avgDailyIncomeInUSD ;
    post_data.region.avgDailyIncomePopulation = req.body.region.avgDailyIncomePopulation;
    post_data.periodType = req.body.periodType;
    post_data.timeToElapse = req.body.timeToElapse;
    post_data.reportedCases = req.body.reportedCases;
    post_data.population = req.body.population;
    post_data.totalHospitalBeds = req.body.totalHospitalBeds;
    console.log(post_data);
    res.json(covid19ImpactEstimator(post_data))
});

app.post('/api/v1/on-covid-19/json', (req, res, next) => {
    res.set('content-Type', 'application/json');
    post_data.region.name = req.body.region.name;
    post_data.region.avgAge = req.body.region.avgAge;
    post_data.region.avgDailyIncomeInUSD = req.body.region.avgDailyIncomeInUSD;
    post_data.region.avgDailyIncomePopulation = req.body.region.avgDailyIncomePopulation;
    post_data.periodType = req.body.periodType;
    post_data.timeToElapse = req.body.timeToElapse;
    post_data.reportedCases = req.body.reportedCases;
    post_data.population = req.body.population;
    post_data.totalHospitalBeds = req.body.totalHospitalBeds;
    console.log(post_data);
    res.json(covid19ImpactEstimator(post_data))
});

app.post('/api/v1/on-covid-19/xml', (req, res, next) => {
    res.set('Content-Type', 'application/xml');
    post_data.region.name = req.body.region.name;
    post_data.region.avgAge = req.body.region.avgAge;
    post_data.region.avgDailyIncomeInUSD = req.body.region.avgDailyIncomeInUSD;
    post_data.region.avgDailyIncomePopulation = req.body.region.avgDailyIncomePopulation;
    post_data.periodType = req.body.periodType;
    post_data.timeToElapse = req.body.timeToElapse;
    post_data.reportedCases = req.body.reportedCases;
    post_data.population = req.body.population;
    post_data.totalHospitalBeds = req.body.totalHospitalBeds;
    console.log(js2xmlparser.parse('postData',post_data));
    res.send(js2xmlparser.parse('response', covid19ImpactEstimator(post_data)));
});
app.get('/api/v1/on-covid19/logs', (req, res, next) => {
    res.set('Content-Type', 'text/data');
    res.sendFile(path.join(__dirname , 'access.log'))
})
//server listening
app.listen(port, () => {
    console.log(`api is running at port ${port}`)
})