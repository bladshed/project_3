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
  return db.createTable('sneakers_tags',{
    'id': {
      'type':'int',
      'unsigned': true,
      'autoIncrement': true,
      'primaryKey': true
    },
    'sneaker_id': {
      'type': 'int',
      'unsigned': true,
      'notNull': true,
      'foreignKey':{
        'name':'fk_sneakers_tags_sneakers', // must be unique in the database
        'table':'sneakers',
        'mapping':'id',
        'rules':{
          'onDelete':'cascade',
          'onUpdate':'restrict'
        }    
      }
    },
    'tag_id':{
      'type':'int',
      'unsigned':true,
      'notNull':true,
      'foreignKey':{
        'name':'fk_sneakers_tags_tags',
        'table':'tags',
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
  return db.dropTable('sneakers_tags');
};

exports._meta = {
  "version": 1
};