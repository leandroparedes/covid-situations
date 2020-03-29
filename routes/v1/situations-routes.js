const express = require('express');
const router = express.Router();

const data = require('./situations.json');

/**
 * Return the last 10 situations reports
 */
router.get('/latest', (req, res) => {
    res.send(
        data.slice(data.length - 10, data.length)
    );
});

/**
 * Return all situations reports
 */
router.get('/', (req, res) => {
    res.send(data);
});

module.exports = router;