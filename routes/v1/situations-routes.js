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