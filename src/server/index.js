/*
  * @file-description : this file is the index file of the API
  * @author{Slimane AKALIA} slimaneakalia@gmail.com
*/

// Import the required modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const http = require('http');
const appRoot = require('app-root-path');
const path = require('path');

const citizensRoutes = require('./routes/citizens/index');
const hospitalsRoutes = require('./routes/hospitals/index');
const alarmsRoutes = require('./routes/alarms/index');
const driversRoutes = require('./routes/drivers/index');
const partnersRoutes = require('./routes/partners/index');
const ambulancesRoutes = require('./routes/ambulances/index');
const webSockets = require('./web-sockets/index');
const config = require('../../config/database');

// Create the express app
const app = express();
const server = http.Server(app);
webSockets.init(server);

// create the logger middleware

// Initialize the API port
const PORT = (process.env.PORT) ? process.env.PORT : 9090;

// Create the API router
const apiRouter = express.Router();

// Add promise to mongoose
mongoose.Promise = Promise;

// Initialize routers
apiRouter.use('/citizens', citizensRoutes.router);
apiRouter.use('/hospitals', hospitalsRoutes.router);
apiRouter.use('/ambulances', ambulancesRoutes.router);
apiRouter.use('/alarms', alarmsRoutes.router);
apiRouter.use('/drivers', driversRoutes.router);
apiRouter.use('/partners', partnersRoutes.router);

// Add the logger to express app
// Use plugins to parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Initialize the API entering point
app.use('/api', apiRouter);

// Test pages path
const productionTestsPath = path.resolve(appRoot.toString(), 'Test', 'Production_tests');
app.use('/tests', express.static(productionTestsPath));

// Add the authentication module
app.use(passport.initialize());

// Add a linstener on mongoose connection
mongoose.connection.on('connected', () => {
  // Listen to a specific port
  server.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
});


// Connect mongoose to database
mongoose.connect(config.database, { useNewUrlParser: true });
