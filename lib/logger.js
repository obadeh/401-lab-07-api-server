'use strict';
let timestamp = (req, res, next)=> {

  let time = new Date();
  req.requestTime = time;
  next();

};


let logger = (req, res, next) => {

  console.log('request info:', req.method, req.path, req.requestTime);
  next();
};


module.exports = {timestamp,logger,};