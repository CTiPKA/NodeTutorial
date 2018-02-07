const path = require('path');

var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');

var FileDriver = function (db) {
  this.db = db;
};

FileDriver.prototype.getCollection = function (callback) {
  this.db.collection('files', function (error, fileCollection) {
    if (error) {
      console.log('Getting file collection error: ' + error);
      callback(error);
    } else {
      callback(null, fileCollection);
    }
  });
};

// find a specific file
FileDriver.prototype.get = function (id, callback) {
  this.getCollection(function (error, fileCollection) {
    if (error) {
      callback(error);
    } else {
      var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$'); // 2
      if (!checkForHexRegExp.test(id)) {
        var errorCustom = { error: 'invalid id' };
        callback(errorCustom);
      } else {
        fileCollection.findOne({ _id: ObjectID(id) }, function (error, doc) {
          // 3
          if (error) callback(error);
          else callback(null, doc);
        });
      }
    }
  });
};

FileDriver.prototype.handleGet = function (req, res) {
  var fileId = req.params.id;
  if (fileId) {
    this.get(fileId, function (error, thisFile) {
      if (error) {
        res.send(400, error);
      } else {
        if (thisFile) {
          var filename = fileId + thisFile.ext;
          var filePath = './uploads/' + filename;
          console.log('Sending file - ' + filePath);
          res.sendfile(filePath);
        } else res.send(404, 'file not found');
      }
    });
  } else {
    res.send(404, 'file not found');
  }
};

// save new file
FileDriver.prototype.save = function (obj, callback) {
  this.getCollection(function (error, fileCollection) {
    if (error) {
      callback(error);
    } else {
      obj.created_at = new Date();
      fileCollection.insert(obj, function () {
        callback(null, obj);
      });
    }
  });
};

FileDriver.prototype.getNewFileId = function (newobj, callback) {
  this.save(newobj, function (err, obj) {
    if (err) {
      console.log('Getting new file id error: ' + err);
      callback(err);
    } else {
      console.log('Successfully asquired new file id : ' + obj._id);
      callback(null, obj._id);
    }
  });
};

FileDriver.prototype.handleUploadRequest = function (req, res) {
  var ctype = req.get('content-type');
  var ext = ctype.substr(ctype.indexOf('/') + 1);
  if (ext) {
    ext = '.' + ext;
  } else {
    ext = '';
  }
  this.getNewFileId({ 'content-type': ctype, ext: ext }, function (err, id) {
    if (err) {
      res.send(400, err);
    } else {
      var filename = id + ext;
      var filePath = path.join(__dirname, '/uploads/', filename);

      var writable = fs.createWriteStream(filePath);
      req.pipe(writable);
      req.on('end', function () {
        res.send(201, { _id: id });
      });
      writable.on('error', function (err) {
        res.send(500, err);
      });
    }
  });
};

exports.FileDriver = FileDriver;
