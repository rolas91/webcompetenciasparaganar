const EntitySchema = require('typeorm').EntitySchema // import {EntitySchema} from "typeorm";
const Centro = require('./Centro').Centro // import {Post} from "../model/Post";
const Curso = require('./Curso').Curso // import {Category} from "../model/Category";

module.exports = new EntitySchema({
  name: 'Centro',
  target: Centro,
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
    cursos: {
      target: Curso,
      name: 'Curso',
      type: 'one-to-many',
      cascade: true
    }
  }
})
