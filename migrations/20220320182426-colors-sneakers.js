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
  // the name of the pivot table for a M:N relationship
  // should be the names of the two tables combined
  // in alphabetical order seperated by an underscore.
  return db.createTable('colors_sneakers',{
    'id': {
      'type':'int',
      'unsigned': true,
      'autoIncrement': true,
      'primaryKey': true
    },
    'color_id':{
      'type':'int',
      'unsigned':true,
      'notNull':true,
      'foreignKey':{
        'name':'fk_colors_sneakers_colors',
        'table':'colors',
        'mapping':'id',
        'rules':{
          'onDelete':'cascade',
          'onUpdate':'restrict'
        }
      }
    },
    'sneaker_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey':{
        'name':'fk_colors_sneakers_sneakers', // must be unique in the database
        'table':'sneakers',
        'mapping':'id',
        'rules':{
          'onDelete':'cascade',
          'onUpdate':'restrict'
        }    
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('colors_sneakers');
};

exports._meta = {
  "version": 1
};