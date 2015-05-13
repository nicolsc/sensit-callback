'use strict';
require('./loadConfig');

const debug = require('debug')('sensit-callback:app');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

/* init */
const app = express();
const port = process.env.PORT || 34002;
const server = http.createServer(app);
const db = require('./modules/db');

const requestLogger = require('./middlewares/requestLogger');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.locals.moment = require('moment');



db.connect()
.then(function(){
  server.listen(port);
})
.catch(function(err){
  debug('Unable to connect to DB');
  debug(err);
  process.exit(1);
});
app.get('/', function(req, res, next){
  db.db.query('select * from sensit_data order by date desc')
  .then(function(entries){
    res.format({
      /* JSON first */
      json: function(){
          res.json(entries);
      },
      html: function(){
          res.render('sensor-data', {title:'Sens\'it data', entries:entries});        
      },
      default:function(){
        let err = new Error('Invalid Accept header. This method only handles html & json');
        err.status=406;
        next(err);
      }
    });
  })
  .catch(next);
});
app.post('/', requestLogger, function(req, res, next){
  if (!req.body || !req.body.sensors || !req.body.sensors.length){
    let err = new Error();
    err.status = 400;
    err.message = 'Invalid data';
    return next(err);
  }
  req.body.sensors.forEach(function(sensor){
    sensor.history.forEach(function(entry){
      db.insertOne('sensit_data', {
        receivedat:new Date().toISOString(),
        date: entry.date,
        deviceid: parseInt(req.body.id, 10),
        sensorid: parseInt(sensor.id, 10),
        type: sensor.sensor_type,
        value: entry.data
      })
      .then(function(data){
        debug('Saved entry %o', data);
      })
      .catch(function(err){
        debug(err);
        debug('Error while saving data log — %s', err);
        
      });
    });
  });
  res.json({result:'♡'});
});

app.get('/logs', function(req, res, next){
  db.db.query('select * from sensit_request_logs order by date desc')
  .then(function(entries){
     res.format({
        /* JSON first */
        json: function(){
            res.json(entries);
        },
        html: function(){
            res.render('logs', {title:'Sens\'it messages', entries:entries});        
        },
        default:function(){
          let err = new Error('Invalid Accept header. This method only handles html & json');
          err.status=406;
          next(err);
        }
      });
  })
  .catch(next);
});

//404 handling
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.format({
    json:function(){
      return res.json({err:err});
    },
    html:function(){
      return res.render('error', {
        err: err
      });
    },
    default:function(){
      res.send();
    }
  });
});

server.on('error', function(err){
    debug('ERROR %s', err);
});
server.on('listening', function(){
 debug('Server listening on port %s', port); 
});