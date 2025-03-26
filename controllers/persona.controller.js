import { personaModel } from '../models/persona-model.js';

export class personaController {
  static async getAll(req, res) {
    const data = await personaModel.getAll();

    if (data) {
      res.render('persona/lista', { listaPersonas: data.rows });
    } else {
      res.render('error');
    }
  }
  static async getByID(req, res) {
    const id = req.params.id;
    const data = await personaModel.getByID(id);
    if (data) {
      res.render('persona/editar', { persona: data.rows[0] });
    } else {
      res.render('error');
    }
  }
  static async update(req, res) {
    const id = req.params.id;
    const body = req.body;
    const data = await personaModel.update(
      id,
      body.nombre,
      body.apellido,
      body.genero,
      body.edad
    );
    if (data) {
      res.json({ result: 'success', data: data.rows[0] });
    } else {
      res.json({ result: 'error', message: 'Error al ejecutar consulta' });
    }
  }
  static async delete(req, res) {
    const id = req.params.id;
    const data = await personaModel.delete(id);
    if (data) {
      res.json({ result: 'success', data: data.rows[0] });
    } else {
      res.json({ result: 'error', message: 'Error al ejecutar consulta' });
    }
  }
}
