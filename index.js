const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const situationsRoutesV1 = require('./routes/v1/situations-routes');

// for testing purposes
app.get('/', (req, res) => {
    const data = require('./format_test.json');

    /* data.forEach(year => {
        console.log('Year:', year.year);
        year.months.forEach(month => {
            console.log('Month:', month.month);
            month.days.forEach(day => {
                console.log('Day:', day.day);
                day.situation.forEach(situation => {
                    console.log('Situation report:', situation);
                });

                if (day.hasOwnProperty('preparedness_and_responses')) {
                    day.preparedness_and_responses.forEach(action => {
                        console.log('Authority:', action.authority);

                        action.responses.forEach(response => {
                            console.log('Response:', response);
                        });
                    });
                }
            });
        });
        console.log('---');
    }); */
    
    res.send(data);
});

app.use('/v1/situations', situationsRoutesV1);

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => console.log(`Server started on port ${port}`));