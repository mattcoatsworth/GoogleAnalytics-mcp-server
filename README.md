# Google Analytics Data API MCP Server

    A Model Context Protocol (MCP) server for interacting with the Google Analytics Data API v1. This server provides tools and resources for querying Google Analytics data, managing audiences, and accessing metadata.

    ## Features

    - Run standard and pivot reports
    - Batch reporting capabilities
    - Access metadata about dimensions and metrics
    - Create, list, update, and delete audiences
    - Check compatibility between dimensions and metrics
    - Comprehensive resource endpoints for exploring GA data

    ## Prerequisites

    - Node.js 14 or higher
    - Google Analytics 4 property
    - Google Cloud service account with appropriate permissions

    ## Setup

    1. Clone this repository
    2. Install dependencies:
       ```
       npm install
       ```
    3. Create a `.env` file based on `.env.example` with your Google Analytics credentials:
       ```
       GOOGLE_CLIENT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
       GOOGLE_PRIVATE_KEY=your-private-key
       DEFAULT_PROPERTY_ID=properties/123456789
       ```

    ## Usage

    ### Running the Server

    ```
    npm start
    ```

    ### Testing with MCP Inspector

    ```
    npm run inspect
    ```

    ## Available Tools

    - **runReport**: Run a standard report on Google Analytics data
    - **batchRunReports**: Run multiple reports in a single batch
    - **runPivotReport**: Run a pivot report on Google Analytics data
    - **batchRunPivotReports**: Run multiple pivot reports in a batch
    - **getMetadata**: Get metadata about dimensions and metrics
    - **checkCompatibility**: Check compatibility between dimensions and metrics
    - **createAudience**: Create a new audience
    - **listAudiences**: List audiences in a property
    - **getAudience**: Get details of a specific audience
    - **deleteAudience**: Delete an audience
    - **updateAudience**: Update an existing audience

    ## Available Resources

    - **ga://property/{propertyId}**: Get property information
    - **ga://report/{propertyId}/{reportType}/{dimensions}/{metrics}/{startDate}/{endDate}**: Generate reports
    - **ga://metadata**: Get API metadata
    - **ga://dimensions**: Browse dimensions by category
    - **ga://dimensions/{category}**: Get dimensions in a specific category
    - **ga://metrics**: Browse metrics by category
    - **ga://metrics/{category}**: Get metrics in a specific category
    - **ga://audiences/{propertyId}**: List audiences in a property
    - **ga://audiences/{propertyId}/{audienceId}**: Get details of a specific audience

    ## Example Queries

    ### Running a Basic Report

    ```javascript
    {
      "propertyId": "properties/123456789",
      "dateRanges": [
        {
          "startDate": "7daysAgo",
          "endDate": "yesterday"
        }
      ],
      "dimensions": [
        {
          "name": "country"
        },
        {
          "name": "deviceCategory"
        }
      ],
      "metrics": [
        {
          "name": "activeUsers"
        },
        {
          "name": "sessions"
        }
      ]
    }
    ```

    ### Creating an Audience

    ```javascript
    {
      "propertyId": "properties/123456789",
      "displayName": "High Value Users",
      "description": "Users who have completed a purchase",
      "membershipDurationDays": 30,
      "filterClauses": [
        {
          "filterExpression": {
            "andGroup": {
              "expressions": [
                {
                  "filter": {
                    "fieldName": "eventName",
                    "stringFilter": {
                      "value": "purchase",
                      "matchType": "EXACT"
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
    ```

    ## License

    MIT
