const dea3f = require('./dea3f');
const dea1r = {};
const dea2h = require('./dea2h');
dea1r.Books = (data, callback) => {
  const acceptableHeaders = ["post", "get", "put", "delete"];
  if (acceptableHeaders.indexOf(data.method) > -1) {
    dea1r._books[data.method](data, callback);
  } else {
    callback(405);
  }
};

dea1r._books = {};

dea1r._books.post = (data, callback) => {
  var name = typeof (data.payload.name) === 'string' && data.payload.name.trim().length > 0 ? data.payload.name : false;
  var amount = typeof (data.payload.amount) === 'string' && !isNaN(parseInt(data.payload.amount)) ? data.payload.amount : false;
  var author = typeof (data.payload.author) === 'string' && data.payload.author.trim().length > 0 ? data.payload.author : false;
  var publisher = typeof (data.payload.publisher) === 'string' && data.payload.publisher.trim().length > 0 ? data.payload.publisher : false;
  var year = typeof (data.payload.year)=== 'string' && data.payload.year.trim().length > 0 ? data.payload.year: false;

  if (name && amount && author && publisher && year) {
    const fileName = dea2h.generateRandomString(50);
    dea3f.create('books', fileName, data.payload, (err) => {
      if (!err) {
        callback(400, { message: "book addition is successful", data: null });
      } else {
        callback(600, { message: "operation failed" });
      }
    });
  }else{
    callback(600, { message: "check fields" });
  }
};

dea1r._books.get = (data, callback) => {
  if (data.query.name) {
    dea3f.read('books', data.query.name, (err, data) => {
      if (!err && data) {
        callback(400, { message: 'book retrieved', data: data });
      } else {
        callback(604, { err: err, data: data, message: 'could not retrieve book' });
      }
    });
  } else {
    callback(604, { message: 'book not found', data: null });
  }
};

dea1r._books.put = (data, callback) => {
  if (data.query.name) {
    dea3f.update('books', data.query.name, data.payload, (err) => {
      if (!err) {
        callback(400, { message: 'book update is successful' })
      } else {
        callback(600, { err: err, data: null, message: 'book update not successful' });
      }
    });
  } else {
    callback(604, { message: 'book not available' });
  }
};

dea1r._books.delete = (data, callback) => {
  if (data.query.name) {
    dea3f.delete('books', data.query.name, (err) => {
      if (!err) {
        callback(400, { message: 'book successfully deleted' });
      } else {
        callback(600, { err: err, message: 'book not deleted' });
      }
    })
  } else {
    callback(604, { message: 'book not available' });
  }
};


dea1r.ping = (data, callback) => {
  callback(400, { response: "server is live" });
};

dea1r.notfound = (data, callback) => {
  callback(404, { response: 'not Available' });
};


module.exports = dea1r;