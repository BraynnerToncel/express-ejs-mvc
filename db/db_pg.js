import pg from 'pg';
import { config } from '../config.js';

export class db_pg {
  static async execute(query, parametros) {
    const { Pool } = pg;
    const pool = new Pool(config);
    let data;
    try {
      if (parametros) {
        data = await pool.query(query, parametros);
      } else {
        data = await pool.query(query);
      }
    } catch (err) {
      console.log('error:', err);
    } finally {
      await pool.end();
    }
    return data;
  }
}
