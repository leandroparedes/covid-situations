const express = require('express');
const router = express.Router();

const data = require('./situations.json');

const apiUrl = `https://covid-situations.herokuapp.com/v1`;

function paginate (pageNumber, perPage) {
    const itemsPerPage = perPage || 10;

    let end = pageNumber * itemsPerPage;
    let start = end - itemsPerPage;

    let paginatedData = {};
    paginatedData.data = data.slice(start, end);

    let links = {};
    if (start > 0) {
        let page = parseInt(pageNumber) - 1;
        links.prev = `${apiUrl}/situations?page=${page}&perPage=${itemsPerPage}`;
    }

    if (end < data.length) {
        let page = parseInt(pageNumber) + 1;
        links.next = `${apiUrl}/situations?page=${page}&perPage=${itemsPerPage}`;
    }

    paginatedData.links = links;

    return paginatedData;
}

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

    // send paginated response
    if (req.query.page) {
        const paginatedData = paginate(req.query.page, req.query.perPage);
        res.send(paginatedData);
        return;
    }

    res.send(data);
});

module.exports = router;