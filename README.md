# covid-situations
World Health Organization situations reports since the beginning of the Coronavirus outbreak.

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
    "related_links": [],
    "original_report_link": "https://link_to_original_report_pdf.test/file.pdf"
  }
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

### Get the last 10 reports
[/v1/situations/latest](https://covid-situations.herokuapp.com/v1/situations/latest)

## Built with this API
https://covid-t.herokuapp.com/timeline

https://report-reader.herokuapp.com/

## Collaborators
https://github.com/sebagutierrez

## Data Source
https://github.com/CSSEGISandData/COVID-19
