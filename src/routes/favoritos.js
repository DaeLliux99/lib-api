const express = require('express');
const router = express.Router();
const Favorito = require('../models/favorito');
const Articulo = require('../models/articulo');
const Publicador = require('../models/publicador');
const Materia = require('../models/materia');
const extUser = require('../middleware/extractorUsuario');
const { Op } = require('sequelize');


router.get('/', extUser, async (req, res) => {
  const favoritos = await Favorito.findAll({
    include: [
      {
        model: Articulo,
        as: "articulo",
        include: [
          {
            model: Publicador,
            as: "publicador",
            attributes: { exclude: ["contraseña"] },
          },
          {
            model: Materia,
            as: "materia",
          },
        ],
      },
    ],
  });
  res.send(favoritos);
});

router.get('/porId/:id', async (req, res) => {
  const { id } = req.params;
  const favorito = await Favorito.findByPk(id);
  res.send(favorito);
});

router.get('/porUsuario/', extUser, async (req, res) => {
  console.log(req.query);
  const { idUsuario } = req;
  const favorito = await Favorito.findAll({
    include: [
      {
        model: Articulo,
        as: "articulo",
        include: [
          {
            model: Publicador,
            as: "publicador",
            attributes: { exclude: ["contraseña"] },
          },
          {
            model: Materia,
            as: "materia",
          },
        ],
      },
    ],
    where: {
      idUsuario,
    },
  });
  res.send(favorito);
});

router.get('/consulta/*', extUser, async (req, res) => {
  console.log(req.query);
  const { idUsuario } = req;
  const { idArticulo } = req.query;
  const favorito = await Favorito.findOne({
    where: {
      [Op.and]: [{ idArticulo }, { idUsuario }],
    },
  });
  res.send(favorito);
});

router.post('/add', extUser, async (req, res) => {
  const { idArticulo } = req.body;
  const { idUsuario } = req;
  const nuevoFav = await Favorito.create({
    idArticulo,
    idUsuario
  });
  //await Articulo.update({ numFav: numFav+1 }, { where: { idArticulo } })
  await Articulo.increment('numFav', { where: { idArticulo } });
  res.send(nuevoFav);
});

router.put('/edit/:id', extUser, async (req, res) => {
  const { id } = req.params;
  const { idArticulo } = req.body;
  const { idUsuario } = req;
  await Favorito.update(
    {
      idArticulo,
      idUsuario,
    },
    {
      where: {
        [Op.and]: [{ idFavorito: id }, { idUsuario }],
      },
    }
  );
});

router.delete('/delete/*', extUser, async (req, res) => {
  const { idArticulo } = req.query;
  const { idUsuario } = req;
  await Favorito.destroy({
    where: {
      [Op.and]: [{ idArticulo }, { idUsuario }],
    },
  });
  await Articulo.decrement('numFav', { where: { idArticulo } });
  res.send({message: "Eliminado"});
});

module.exports = router;
