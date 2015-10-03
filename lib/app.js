var express = require('express');
var csv = require('csv');
var async = require('async');
var fs = require('fs');
var _ = require('lodash');
var debug = require('debug')('app');
var app = express();
var port = process.env.PORT || 3366;



async.series([
  loadData,
  createServer
], function(err) {
  // Start server
  app.listen(port);
  debug('------- web server -------');
  debug('server starts listening to port ' + port + ' ...');
  debug('press Ctrl+C to stop');
});



/**
 * Load necessary data
 */
function loadData(cb) {
  cb();
  /*
  // Load bangkok districts
  csv.parse(fs.readFileSync(__dirname + '/../public/data/something.csv', 'utf-8'), {columns: true}, function(err, output){
    var data = output
      .filter(function(d) {
        return d.provinceCode === '10';
      })
      .map(function(d) {
        return [ d.districtCode, d.districtName ];
      });
    app.set('location', _.zipObject(data));
    app.set('locationList', _.sortBy(data, 1));
    cb();
  });
  */
}

function createServer(cb) {
  // Render engine
  app.engine('jade', require('jade').__express);
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/../src/jade');

  // Parser
  app.use(express.compress());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.favicon(__dirname + '/../public/favicon.ico'));
  app.use('/public', express.staticCache());
  app.use('/public', express.static(__dirname + '/../public', { maxAge: 7*86400000 }));

  // Route
  app.get('/', function(req, res) {
    res.locals.select_year = req.query.year || '2008';
    res.render('map');
  });

  // A's route
  app.get('/a', function(req, res) {
    debug('No!');
    res.render('a');
  });

  cb();
}
