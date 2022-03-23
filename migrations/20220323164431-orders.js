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
  return db.createTable('orders', {
    'id': {
      type:'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned:true
    },
    'order_number': {
      type:'int',
      unsigned:true,
      notNull:true
    },
    'delivery_status':{
      type:'string',
      length:50,
      notNull:false
    },
    'date_created':{
      'type':'date'
    }
  })
};

exports.down = function(db) {
  return db.dropTable('orders');
};

exports._meta = {
  "version": 1
};