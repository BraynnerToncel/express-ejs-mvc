import { db_pg } from '../db/db_pg.js';

export class personaModel {
  static async getAll() {
    const query =
      'SELECT id_persona, nombre, apellido, genero, edad 	FROM public.persona;';
    const data = await db_pg.execute(query);
    return data;
  }
  static async getByID(id) {
    const query =
      'SELECT id_persona, nombre, apellido, genero, edad	FROM public.persona WHERE id_persona=$1;';
    const params = [id];
    const data = await db_pg.execute(query, params);
    return data;
  }
  static async update(id, nombre, apellido, genero, edad) {
    const query =
      'UPDATE public.persona 	SET nombre=$1, apellido=$2, genero=$3, edad=$4 WHERE id_persona=$5  RETURNING id_persona, nombre, apellido, genero, edad;';
    const params = [nombre, apellido, genero, edad, id];
    const data = await db_pg.execute(query, params);
    return data;
  }
  static async delete(id) {
    const query =
      'DELETE  FROM public.persona WHERE id_persona=$1  RETURNING id_persona, nombre, apellido, genero, edad;';
    const params = [id];
    const data = await db_pg.execute(query, params);
    return data;
  }
}
