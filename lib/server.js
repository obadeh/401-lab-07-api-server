  
'use strict';

const express = require('express');
const app = express();
const {timestamp,logger} = require('./logger.js');
const uuid = require('uuid/v4');
const Model=require('../memory-data-model.js')
app.use(express.json());
app.use(timestamp)
app.use(logger);

let CRUD=new Model;

// basic routing ///////////////////////////////

app.get('/products', (req, res) => {
    console.log('request obj:', req.query);
  
    let output = {
      type: req.query.type,
      thisWorked: true
    }
    res.status(200).json(output);
  });


app.get('/categories', (req, res) => {
    console.log('request obj:', req.query);
  
    let output = {
      type: req.query.type,
      thisWorked: true
    }
    res.status(200).json(output);
  });
  
// middleware ///////////////////////////////////////

// let timeFunction= function timestamp() {
//     return (req, res, next) => {
//      let time= new Date();
//      req.requestTime=time
//     }
//   }
  
  function errorHandler(err, req, res, next) {
    res.status(500);
    res.statusMessage = 'Generic Server Error!';
    res.json({ error: err });
  }
  
  function notFoundHandler(req, res, next) {
    res.status(404);
    res.statusMessage = 'Not Found!';
    res.json({ error: 'Not Found'});
  }
  
  app.get('/real-error', (req, res) => {
    throw new Error('first real error');
  });
  
// API routes ///////////////////////////////////////////////////
let db = [];

app.get('/api/v1/products', (req, res, next) => {
  let count = db.length;
  let results = db;
  res.json({ count, results });
});

app.get('/api/v1/products/:id', (req, res, next) => {
  // example of request http://localhost:3000/api/v1/food/23
  // request.params === ['23']
  // request.params.id === '23'
  let id = req.params.id;
  CRUD.get(id);
  let record = db.filter((record) => record.id === parseInt(id));
  res.json(record);
});

app.post('/api/v1/products',(req, res, next) => {
  let { name } = req.body; // req.body.name
  let record = { name };
  record.id = db.length + 1;
  CRUD.create(record);
  db.push(record);
  res.status(201).json(record);
});

app.put('/api/v1/products/:id', (req, res, next) => {
  let idToUpdate = req.params.id;
  let { name, id } = req.body;
  let updatedRecord = { name, id };
  CRUD.update(id,name);
  db = db.map((record) => (record.id === parseInt(idToUpdate)) ? updatedRecord : record);
  res.json(updatedRecord);
});

app.delete('/api/v1/products/:id', (req, res, next) => {
  let id = req.params.id;
  CRUD.delete(id);
  db = db.filter((record) => record.id !== parseInt(id));
  res.json({ msg: 'item deleted' });
});





app.get('/api/v1/categories', (req, res, next) => {
    let count = db.length;
    let results = db;
    res.json({ count, results });
  });
  
  app.get('/api/v1/categories/:id', (req, res, next) => {
    // example of request http://localhost:3000/api/v1/food/23
    // request.params === ['23']
    // request.params.id === '23'
  
    let id = req.params.id;
    let record = db.filter((record) => record.id === parseInt(id));
    res.json(record);
  });
  
  app.post('/api/v1/categories',(req, res, next) => {
    let { name } = req.body; // req.body.name
    let record = { name };
    record.id = db.length + 1;
    db.push(record);
    res.status(201).json(record);
  });
  
  app.put('/api/v1/categories/:id', (req, res, next) => {
    let idToUpdate = req.params.id;
    let { name, id } = req.body;
    let updatedRecord = { name, id };
    db = db.map((record) => (record.id === parseInt(idToUpdate)) ? updatedRecord : record);
    res.json(updatedRecord);
  });
  
  app.delete('/api/v1/categories/:id', (req, res, next) => {
    let id = req.params.id;
    db = db.filter((record) => record.id !== parseInt(id));
    res.json({ msg: 'item deleted' });
  });
////////////////////////////////////

module.exports = {
    server: app,
    start: port => {
      let PORT = port || process.env.PORT || 3000;
      app.listen(PORT, () => console.log(`listening on ${PORT}`));
    }
  }
