const express = require('express');
const app = express();
const path = require('path');

const data = require('./situations.json');

app.get('/situations/:year', (req, res) => {
    const yearData = data[req.params.year];

    if (! yearData) {
        res.send({ message: 'No hay datos para el año ' + req.params.year });
        return;
    }

    res.send(yearData);
});

app.get('/situations/:year/:month', (req, res) => {
    const monthData = data[req.params.year][req.params.month];

    if (! monthData) {
        res.send({ message: `No hay datos para el mes ${req.params.month} del año ${req.params.year}` });
        return;
    }

    res.send(monthData);
});

app.get('/situations/:year/:month/:day', (req, res) => {
    const dayData = data[req.params.year][req.params.month][req.params.day];

    if (! dayData) {
        res.send({ message: `No hay datos para el dia ${req.params.day} del mes ${req.params.month} del año ${req.params.year}` });
        return;
    }

    res.send(dayData);
});

app.get('/situations', (req, res) => {
    res.send(data);
});

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => console.log(`Server started on port ${port}`));