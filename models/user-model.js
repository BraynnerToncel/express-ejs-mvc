import { db_pg } from '../db/db_pg.js';

export class userModel {
  static async getByName(username) {
    const query =
      'SELECT id_user, username, password FROM public.usuario WHERE username=$1 ;';
    const params = [username];
    const data = await db_pg.execute(query, params);
    return data;
  }
  static async create(username, password) {
    const query =
      'INSERT INTO public.usuario(username, password) VALUES ($1, $2) RETURNING id_user, username, password;';
    const params = [username, password];
    const data = await db_pg.execute(query, params);
    return data;
  }

  static async getUsers(name) {
    const query = 'SELECT id_user, username, password 	FROM public.usuario';
    const data = await db_pg.execute(query);
    return data;
  }
}
