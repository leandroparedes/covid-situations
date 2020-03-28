const express = require('express');
const router = express.Router();

const data = require('./situations.json');

router.get('/:year', (req, res) => {
    const yearData = data[req.params.year];

    if (! yearData) {
        res.send({ message: 'No hay datos para el año ' + req.params.year });
        return;
    }

    res.send(yearData);
});

router.get('/:year/:month', (req, res) => {
    const monthData = data[req.params.year][req.params.month];

    if (! monthData) {
        res.send({ message: `No hay datos para el mes ${req.params.month} del año ${req.params.year}` });
        return;
    }

    res.send(monthData);
});

router.get('/:year/:month/:day', (req, res) => {
    const dayData = data[req.params.year][req.params.month]['days'][req.params.day];

    if (! dayData) {
        res.send({ message: `No hay datos para el dia ${req.params.day} del mes ${req.params.month} del año ${req.params.year}` });
        return;
    }

    res.send(dayData);
});

router.get('/', (req, res) => {
    res.send(data);
});

module.exports = router;