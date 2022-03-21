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
  return db.createTable('users', {
    id: {
      type: 'int',
      unsigned: true,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type:'string',
      length: 320
    },
    password:{
      type:'string',
      length:80
    },
    first_name: {
      type: 'string',  // varchar
      length: 100
    },
    last_name: {
      type: 'string',  // varchar
      length: 100
    },
    admin: {
      type: 'char',  // char
      length: 1
    },
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};