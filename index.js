const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const situationsRoutesV1 = require('./routes/v1/situations-routes');

app.use('/v1/situations', situationsRoutesV1);

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => console.log(`Server started on port ${port}`));