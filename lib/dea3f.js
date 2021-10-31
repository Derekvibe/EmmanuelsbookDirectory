const fs = require('fs');
const path = require('path');
const dea2h = require('./dea2h')
var lib = {
  baseDir: path.join(__dirname, '/../.data/')
};

lib.create = (dir, filename, data, callback) => {
  //open file for writing
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  fs.open(filePath, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("There is an Error when closing the new file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });

    } else {
      callback("new file already exist");
    }
  });
};


lib.read = (dir, filename, callback) => {
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (!err && data) {
      callback(false, JSON.parse(data));
    }
    else {
      callback(err, data);
    }
  });
};

lib.update = (dir, filename, data, callback) => {
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  //open the file
  fs.open(filePath, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      fs.readFile(fileDescriptor, 'utf-8', (err, bookToUpdate) => {
        if (!err && bookToUpdate) {
          let updatedBook = helper.formatObject(JSON.parse(bookToUpdate), data);
          var updatedData = JSON.stringify(updatedBook);
          fs.truncate(fileDescriptor, (err) => {
            if (!err) {
              fs.writeFile(filePath, updatedData, (err) => {
                if (!err) {
                  fs.close(fileDescriptor, (err) => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback("error closing the file");
                    }
                  });
                } else {
                  callback('error writing to existing file');
                }
              });
            }
          });
        } else {
          callback(err);
        }
      });



    } else {
      callback('cant open file, file may not exist');
    }
  });
};

lib.delete = (dir, filename, callback) => {
  const filePath = lib.baseDir + dir + "\\" + filename + '.json';
  fs.unlink(filePath, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};

module.exports = lib;