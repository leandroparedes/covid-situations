const express = require('express');
const router = express.Router();

const baseData = require('./situations.json');

const host = `https://covid-situations.herokuapp.com`;

function paginate (options) {
    const { pageNumber, perPage, data, url, filtering } = options;

    const itemsPerPage = perPage || 10;

    let end = pageNumber * itemsPerPage;
    let start = end - itemsPerPage;

    let paginatedData = {};
    paginatedData.data = data.slice(start, end);

    let links = {};
    const queryStringSymbol = filtering ? '&' : '?';
    if (start > 0) {
        let page = parseInt(pageNumber) - 1;
        links.prev = `${host}${url}${queryStringSymbol}page=${page}&perPage=${itemsPerPage}`;
    }

    if (end < data.length) {
        let page = parseInt(pageNumber) + 1;
        links.next = `${host}${options.url}${queryStringSymbol}page=${page}&perPage=${itemsPerPage}`;
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

const whitelistFields = [
    'date',
    'reports',
    'highlights',
    'preparedness_and_responses',
    'related_links',
    'original_report_link'
];

function validateFields (fields) {
    let invalidFields = fields.map(field => {
        if (! whitelistFields.includes(field)) {
            return field;
        }
    });

    invalidFields = invalidFields.filter(field => field != undefined);

    return (invalidFields.length && {
        valid: false,
        invalid_fields: invalidFields
    }) || { valid: true };
}

function formatInvalidFieldsError (validation) {
    return {
        errors: {
            message: 'Invalid requested field(s)',
            'invalid_fields': validation.invalid_fields
        }
    };
}

function parseUrl (url) {
    return url.split(/(\?|&)(page|perPage)=[0-9]/).shift()
}

/**
 * Return the last 10 situations reports
 */
router.get('/latest', (req, res) => {
    let filteredData = baseData;

    // return only the requested fields
    if (req.query.fields) {
        const fields = req.query.fields.split(';');
        const validation = validateFields(fields);

        if (! validation.valid) {
            return res.status(400).send(
                formatInvalidFieldsError(validation)
            );
        }

        // filtered data is no longer all the original data
        filteredData = [];

        baseData.map(situation => {
            let situationData = {};
            fields.map(field => situationData[field] = situation[field]);
            filteredData.push(situationData);
        });
    }
    
    const latestData = filteredData.slice(baseData.length - 10, baseData.length);

    if (req.query.page) {
        const paginated = paginate({
            pageNumber: req.query.page,
            perPage: req.query.perPage,
            data: latestData,
            url: parseUrl(req.originalUrl),
            filtering: req.query.fields != undefined
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

    if (req.query.fields) {
        const fields = req.query.fields.split(';');

        const validation = validateFields(fields);

        if (! validation.valid) {
            return res.status(400).send(
                formatInvalidFieldsError(validation)
            );
        }

        let response = { situation: {} };
        fields.map(field => response.situation[field] = situation[field] || []);
        return res.send(response);
    }

    res.send({ situation });
});

/**
 * Return all situations reports
 */
router.get('/', (req, res) => {
    // let the filtered data be all the original data
    let filteredData = baseData;

    // return only the requested fields
    if (req.query.fields) {
        const fields = req.query.fields.split(';');
        const validation = validateFields(fields);

        if (! validation.valid) {
            return res.status(400).send(
                formatInvalidFieldsError(validation)
            );
        }

        // filtered data is no longer all the original data
        filteredData = [];

        baseData.map(situation => {
            let situationData = {};
            fields.map(field => situationData[field] = situation[field]);
            filteredData.push(situationData);
        });
    }

    // Here now filtered data is either the original data or actually filtered data
    // ready to be paginated if necessary

    // send paginated response
    if (req.query.page) {
        const paginatedData = paginate({
            pageNumber: req.query.page,
            perPage: req.query.perPage,
            data: filteredData,
            url: parseUrl(req.originalUrl),
            filtering: req.query.fields != undefined
        });
        res.send(paginatedData);
        return;
    }

    res.send(filteredData);
});

module.exports = router;