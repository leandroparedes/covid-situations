const express = require('express');
const router = express.Router();

const data = require('./situations.json');

router.get('/:year', (req, res) => {
    res.send('Feature not available at the moment');
});

router.get('/:year/:month', (req, res) => {
    res.send('Feature not available at the moment');
});

router.get('/:year/:month/:day', (req, res) => {
    res.send('Feature not available at the moment');
});

router.get('/', (req, res) => {
    res.send(data);
});

module.exports = router;