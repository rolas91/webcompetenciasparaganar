const EntitySchema = require('typeorm').EntitySchema // import {EntitySchema} from "typeorm";
const Centro = require('./Centro').Centro // import {Post} from "../model/Post";
const Curso = require('./Curso').Curso // import {Category} from "../model/Category";

module.exports = new EntitySchema({
  name: 'Curso',
  target: Curso,
  columns: {
    id: {
      primary: true,
      type: 'int'
    },
    nombre: {
      type: 'varchar'
    }
  },
  relations: {
    centro: {
      target: Centro,
      name: 'Centro',
      type: 'many-to-one',
      cascade: true
    }
  }
})
