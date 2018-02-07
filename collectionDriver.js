var ObjectID = require('mongodb').ObjectID;

var CollectionDriver = function (db) {
  this.db = db;
};

CollectionDriver.prototype.getCollection = function (collectionName, callback) {
  this.db.collection(collectionName, function (error, theCollection) {
    if (error) {
      callback(error);
    } else {
      callback(null, theCollection);
    }
  });
};

CollectionDriver.prototype.findAll = function (collectionName, callback) {
  this.getCollection(collectionName, function (error, theCollection) {
    if (error) callback(error);
    else {
      theCollection.find().toArray(function (error, results) {
        if (error) {
          callback(error);
        } else {
          callback(null, results);
        }
      });
    }
  });
};

CollectionDriver.prototype.get = function (collectionName, id, callback) {
  this.getCollection(collectionName, function (error, theCollection) {
    if (error) {
      callback(error);
    } else {
      var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
      if (!checkForHexRegExp.test(id)) {
        var errorCustom = { error: 'invalid id' };
        callback(errorCustom);
      } else {
        theCollection.findOne({ _id: ObjectID(id) }, function (error, doc) {
          if (error) {
            callback(error);
          } else {
            callback(null, doc);
          }
        });
      }
    }
  });
};

// save new object
CollectionDriver.prototype.save = function (collectionName, obj, callback) {
  this.getCollection(collectionName, function (error, theCollection) {
    if (error) callback(error);
    else {
      obj.created_at = new Date();
      theCollection.insert(obj, function () {
        callback(null, obj);
      });
    }
  });
};

// update a specific object
CollectionDriver.prototype.update = function (
  collectionName,
  obj,
  entityId,
  callback
) {
  this.getCollection(collectionName, function (error, theCollection) {
    if (error) callback(error);
    else {
      obj._id = ObjectID(entityId);
      obj.updated_at = new Date();
      theCollection.save(obj, function (error, doc) {
        if (error) {
          callback(error);
        } else {
          callback(null, obj);
        }
      });
    }
  });
};

// delete a specific object
CollectionDriver.prototype.delete = function (
  collectionName,
  entityId,
  callback
) {
  this.getCollection(collectionName, function (error, theCollection) {
    // A
    if (error) callback(error);
    else {
      theCollection.remove({ _id: ObjectID(entityId) }, function (error, doc) {
        // B
        if (error) {
          callback(error);
        } else {
          callback(null, doc);
        }
      });
    }
  });
};

exports.CollectionDriver = CollectionDriver;
