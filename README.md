# World Health Organization situations reports
World Health Organization situations reports since the beginning of the Coronavirus outbreak.

Transcriptions from https://github.com/CSSEGISandData/COVID-19/tree/master/who_covid_19_situation_reports/who_covid_19_sit_rep_pdfs

**This is a work in progress**

## Endpoints

### Get all the situation reports since the beginning of the outbreak
[/v1/situations](https://covid-situations.herokuapp.com/v1/situations)

Response:
```json
[
    {
      "date": "2019/12/31",
      "reports": [
        "report 1",
        "report 2"
      ],
      "highlights": [
        "highlight 1",
        "highlight 2",
      ],
      "preparedness_and_responses": [
        {
          "authority": "World Health Organization",
          "actions": [
            "action 1 by WHO",
            "action 2 by WHO"
          ]
        }
      ],
      "situation_in_numbers": [
        {
            "location": "Global",
            "numbers": {
                "confirmed": 100,
                "suspected": 200,
                "severe": 50,
                "deaths": 20
            }
        }
      ],
      "related_links": [
        {
          "link_text": "text link 1",
          "link_url": "https://somelink.test"
        }
      ],
      "original_report_link": "https://link_to_original_report_pdf.test/file.pdf"
    }
  ]
```

### Get a situation report by ID (where ID is the date of the report in format YYYYMMDD)
[/v1/situations/20191231](https://covid-situations.herokuapp.com/v1/situations/20191231)

Response:
```json
{
  "situation": {
    "date": "2019/12/31",
    "reports": [],
    "highlights": [],
    "preparedness_and_responses": [],
    "situation_in_numbers": [],
    "related_links": [],
    "original_report_link": "https://link_to_original_report_pdf.test/file.pdf"
  }
}
```
If the ID doesn't match the required format (YYYYMMDD) the following response (HTTP 400) will be sent:
```json
{
    "message": "Wrong ID format. It should be YYYYMMDD"
}
```
If no situation is found the following reponse (HTTP 404) will be sent:
```json
{
    "message": "Situation not found"
}
```

### Get paginated situation reports
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
      "reports": [],
      "highlights": [],
      "preparedness_and_responses": [],
      "situation_in_numbers": [],
      "related_links": [],
      "original_report_link": "https://link_to_original_report_pdf.test/file.pdf"
    }
  ],
  "links": {
    "previous": "https://covid-situations.herokuapp.com/v1/situations?page=1&perPage=10",
    "next": "https://covid-situations.herokuapp.com/v1/situations?page=3&perPage=10"
  }
}
```

### Get the last 10 reports (supports pagination as well)
[/v1/situations/latest](https://covid-situations.herokuapp.com/v1/situations/latest)

### Get only the data you need
[/v1/situations?fields=date;reports](https://covid-situations.herokuapp.com/v1/situations?fields=date;reports)

Response
```json
[
    {
        "date": "2019/12/31",
        "reports": []
    }
]
```

- Supported fields (separated by a **;** ):
    - date
    - reports
    - highlights
    - preparedness_and_responses
    - situation_in_numbers
    - related_links
    - original_report_link

If you pass an invalid field the following response will be sent

Example request:

[/v1/situations?fields=invalid;invalid2](https://covid-situations.herokuapp.com/v1/situations?fields=invalid;invalid2)
```json
{
    "errors": {
        "message": "Invalid requested field(s)",
        "invalid_fields": [
            "invalid",
            "invalid2"
        ]
    }
}
```
   
#### Important note:
If you're using ```fields``` with ```page``` (and optionally with ```perPage```) the parameter ```fields``` **must be the first query string parameter**, otherwise the pagination will not work.

This will work fine

[/v1/situations?fields=date;reports&page=1](https://covid-situations.herokuapp.com/v1/situations?fields=date;reports&page=1)

This **will not** work

[/v1/situations?page=1&fields=date;reports](https://covid-situations.herokuapp.com/v1/situations?page=1&fields=date;report)

## Upcoming features
* Distribution of Covid-19 maps images per situation report (if any)
* Highlights per situation report
* Charts images (epidemic curve by date, etc) per situation report (if any)

## Built with this API
https://covid-t.herokuapp.com/timeline

https://report-reader.herokuapp.com/

## Collaborators
https://github.com/sebagutierrez

## Data Source
https://github.com/CSSEGISandData/COVID-19
