export default function verificarAdmin(req, res, next) {
  if (!req.user || req.user.username !== 'admin') {
    console.log(req.user?.username); //
    return res.status(403).render('accesoDenegado');
  } else {
    return res.render('admin/reportes');
  }
}
