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

function dataWithRequestedFields(options) {
    const { fieldsString, data, dataType } = options;

    const fields = fieldsString.split(';');

    const validation = validateFields(fields);
    if (! validation.valid) {
        throw formatInvalidFieldsError(validation);
    }

    switch (dataType) {
        case 'array':
            let arrayResponse = [];
            data.map(situation => {
                let situationData = {};
                fields.map(field => situationData[field] = situation[field] || []);
                arrayResponse.push(situationData);
            });
            return arrayResponse;
        break;

        case 'object':
            let objectResponse = {};
            fields.map(field => objectResponse[field] = data[field] || []);
            return objectResponse;
        break;
    }
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
    'situation_in_numbers',
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
    let data = baseData.slice(baseData.length - 10, baseData.length);

    if (req.query.fields) {
        try {
            data = dataWithRequestedFields({
                fieldsString: req.query.fields,
                data: data,
                dataType: 'array'
            });
        } catch (error) {
            return res.send(error);
        }
    }

    if (req.query.page) {
        data = paginate({
            pageNumber: req.query.page,
            perPage: req.query.perPage,
            data: data,
            url: parseUrl(req.originalUrl),
            filtering: req.query.fields != undefined
        });
    }

    res.send(data);
});

/**
 * Return the situations with the given ID
 */
router.get('/:id', (req, res) => {
    if (req.params.id.length != 8) {
        res.status(400).send({ message: 'Wrong ID format. It should be YYYYMMDD' });
        return;
    }

    let situation = findByID(req.params.id);

    if (! situation) {
        res.status(404).send({ message: 'Situation not found' });
        return;
    }

    if (req.query.fields) {
        try {
            situation = dataWithRequestedFields({
                fieldsString: req.query.fields,
                data: situation,
                dataType: 'object'
            });
        } catch (error) {
            return res.send(error);
        }
    }

    res.send({ situation });
});

/**
 * Return all situations reports
 */
router.get('/', (req, res) => {
    let data = baseData;

    if (req.query.fields) {
        try {
            data = dataWithRequestedFields({
                fieldsString: req.query.fields,
                data: data,
                dataType: 'array'
            });
        } catch (error) {
            return res.send(error);
        }
    }

    if (req.query.page) {
        data = paginate({
            pageNumber: req.query.page,
            perPage: req.query.perPage,
            data: data,
            url: parseUrl(req.originalUrl),
            filtering: req.query.fields != undefined
        });
    }

    res.send(data);
});

module.exports = router;