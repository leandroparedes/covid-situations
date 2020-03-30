# covid-situations
World Health Organization situations reports since the beginning of the Coronavirus outbreak.

**This is a work in progress**

## Endpoints

### Get all the reports since the beginning of the outbreak
[/v1/situations](https://covid-situations.herokuapp.com/v1/situations)

### Get paginated reports
[/v1/situations?page=2](https://covid-situations.herokuapp.com/v1/situations?page=2)

Parameters:
  - page
  - perPage (default: 10)
  
Response:
```json
{
  "data": [
    {
      "date": "2019/12/31",
      "reports": [
        "report 1",
        "report 2"
      ]
    }
  ],
  "links": {
    "previous": "https://covid-situations.herokuapp.com/v1/situations?page=1",
    "next": "https://covid-situations.herokuapp.com/v1/situations?page=3"
  }
}
```

### Get the last 10 reports
[/v1/situations/latest](https://covid-situations.herokuapp.com/v1/situations/latest)

## Built with this API
https://covid-t.herokuapp.com/timeline

## Collaborators
https://github.com/sebagutierrez

## Data Source
https://github.com/CSSEGISandData/COVID-19
