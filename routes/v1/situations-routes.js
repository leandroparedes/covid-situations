const express = require('express');
const router = express.Router();

const baseData = require('./situations.json');

const host = `https://covid-situations.herokuapp.com`;

function paginate (options) {
    const { pageNumber, perPage, data, url } = options;

    const itemsPerPage = perPage || 10;

    let end = pageNumber * itemsPerPage;
    let start = end - itemsPerPage;

    let paginatedData = {};
    paginatedData.data = data.slice(start, end);

    let links = {};
    if (start > 0) {
        let page = parseInt(pageNumber) - 1;
        links.prev = `${host}${url}?page=${page}&perPage=${itemsPerPage}`;
    }

    if (end < data.length) {
        let page = parseInt(pageNumber) + 1;
        links.next = `${host}${options.url}?page=${page}&perPage=${itemsPerPage}`;
    }

    paginatedData.links = links;

    return paginatedData;
}

function findByID (id) {
    const year = id.slice(0, 4);
    const month = id.slice(4, 6);
    const day = id.slice(6, 8);
    const date = `${year}/${month}/${day}`;

    return baseData.find(situation => situation.date == date);
}

/**
 * Return the last 10 situations reports
 */
router.get('/latest', (req, res) => {
    const latestData = baseData.slice(baseData.length - 10, baseData.length);

    if (req.query.page) {
        const paginated = paginate({
            pageNumber: req.query.page,
            perPage: req.query.perPage,
            data: latestData,
            url: req.originalUrl.split('?').shift()
        });

        res.send(paginated);
        return;
    }

    res.send(latestData);
});

/**
 * Return the situations with the given ID
 */
router.get('/:id', (req, res) => {
    if (req.params.id.length != 8) {
        res.status(400).send({ message: 'Wrong ID format. It should be YYYYMMDD' });
        return;
    }

    const situation = findByID(req.params.id);

    if (! situation) {
        res.status(404).send({ message: 'Situation not found' });
        return;
    }

    res.send({ situation });
});

/**
 * Return all situations reports
 */
router.get('/', (req, res) => {

    // send paginated response
    if (req.query.page) {
        const paginatedData = paginate({
            pageNumber: req.query.page,
            perPage: req.query.perPage,
            data: baseData,
            url: req.originalUrl.split('?').shift()
        });
        res.send(paginatedData);
        return;
    }

    res.send(baseData);
});

module.exports = router;