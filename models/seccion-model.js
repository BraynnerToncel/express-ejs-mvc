import { db_pg } from '../db/db_pg.js';

export class sesionModel {
  static async create(username) {
    const query =
      'INSERT INTO public.sesion(username, active)VALUES ($1, 2) RETURNING id_sesion,username ;';
    const params = [username];
    const data = await db_pg.execute(query, params);
    return data;
  }

  static async active(id, tkn) {
    const query =
      'UPDATE public.sesion 	SET  refresh_token=$1, active=1 	WHERE id_sesion=$2 RETURNING id_sesion,username ;';
    const params = [tkn, id];
    const data = await db_pg.execute(query, params);
    return data;
  }

  static async getById_tkn(id, tkn) {
    const query =
      'SELECT id_sesion, username, refresh_token 	FROM public.sesion WHERE active =1 and  id_sesion = $1 AND refresh_token = $2 ;';
    const params = [id, tkn];
    const data = await db_pg.execute(query, params);
    return data;
  }
}
