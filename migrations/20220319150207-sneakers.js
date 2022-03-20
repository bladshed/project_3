'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  // first arg: name of table
  // seocnd arg: an object representing
  // all the columns in the table
  // 
  // CREATE TABLE products (
  //  id int unsigned AUTO_INCREMENT PRIMARY KEY,
  //  name varchar(100),
  //  cost int,
  //  description TEXT
  // )
  return db.createTable('sneakers', {
    'id': {
      type:'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned:true
    },
    'name':{
      type:'string',
      length:100,
      notNull:true
    },
    'image_url':{
      type:'string',
      length:255,
      notNull:false
    },
    'price': {
      type:'int',
      unsigned:true
    },
  })
};

exports.down = function(db) {
  return db.dropTable('sneakers');
};

exports._meta = {
  "version": 1
};
