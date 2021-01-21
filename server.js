const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const container = require('./container');
const router = require("express").Router();
const compression = require('compression');

require("dotenv").config();

//credentials
const MONGO_SERVER = process.env.MONGO_SERVER;
const MONGO_DATABASE = process.env.MONGO_DATABASE;

//Import resources
container.resolve(function (_, index, user) {


    //Connecting mongo database
    mongoose.Promise = global.Promise;
    mongoose.connect(
        `mongodb://${MONGO_SERVER}:27017/${MONGO_DATABASE}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    //Setup Express
    const app = SetupExpress();
    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(8080, function () {
            console.log('Listening on port 8080');
        });
        ConfigureExpress(app);


        //Setup router
        index.setRouting(router);
        user.setRouting(router);
        app.use(router);

        //Route default
        app.use(function (req, res) {
            res.redirect("./api");
        });
    }




    function ConfigureExpress(app) {
        app.use(compression());
        app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
        app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
        app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, './app/view'))
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');      
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);       
            // Pass to next layer of middleware
            next();
        });

        app.locals._ = _;
    }

});