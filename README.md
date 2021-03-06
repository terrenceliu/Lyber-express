**Lyber server**
----
# About

The backend server that provides services for `Lyber`.

**Lyft api doesn't support cors request smh so here we go**

~~Deployed on Heroku. Link: https://lyber-server.herokuapp.com~~

Deployed on Amazon AWS EC2 instance. Homepage: https://lyber.co

Web frontend repo: https://github.com/terrenceliu/Lyber

iOS repo: https://github.com/EdwardFeng523/Lyber-ios

# Active Endpoints

Method | URL | Description
:--- | :--- | :-----
 GET | `/api/estimate/beta` | (Beta) Exact pricing estimate & ETA
 GET | `/api/estimate`      | Estimate fare & ETA
POST | `/api/log/request`   | Log requests to DB


# Getting started

## Installing

Clone the repository. 
```
npm install
```

Start the local server
```
npm run start
```

## Local development

Install `nodemon` to enable auto restart of the local dev server whenever we make some changes to the codes.

```
npm install nodemon -g
```

To start the local dev server
```
npm run start:dev
```

The default port of the server is `8000`.


# API Documentation
## Estimate Beta Endpoint
* **Description**

    Return the estimate data from both Uber and Lyft endpoint.
    This endpoint also supports the upfront fare estimate.

* **URL**

  /api/estimate/beta

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
    
    <Coordinates of departure and destination.>

    Name | Type | Description 
    :--- | :---| :---
    depar_lat | float | Latitude of departure location
    depar_lng | float | Longitude of departure location
    dest_lat | float | Latitude of destination location
    dest_lng | float | Longitude of destination location
    dest_ref | string | Google Place ID of the destination. Details: https://developers.google.com/places/place-id

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```json
    {
        "prices": [
            {
                "company": "uber",
                "display_name": "uberX",
                "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
                "max_estimate": 17,
                "min_estimate": 13,
                "fare_estimate": "$15.63",
                "distance": 6.17,
                "duration": 1080,
                "eta": 600,
                "currency_code": "USD"
            }
        ],
        "id": "foo-bar"
    }
    ```

    <Coordinates of departure and destination.>

    Name | Type | Description 
    :--- | :---| :---
    display_name | string | Name of the product
    product_id | string  | Product id
    max_estimate | float | Estimated max price in dollars
    min_estimate | float | Estimated min price in dollars
    fare_estimate | float | Upfront estimate price in dollars
    distance | float | Distance of the ride in miles
    duration | float | Length of the trip in seconds
    eta | int | Estimated Arrival Time for the product in seconds
    currency_code | String | 
    id | String | UUID of the request

 
* **Error Response:**

* **Sample Call:**

    https://lyber.co/api/estimate/beta?depar_lat=29.704844899999998&depar_lng=-95.41860729999999&dest_lat=29.7427584&dest_lng=-95.3798506&dest_ref=ChIJsxPKx26_QIYRw4B1m_fbSgQ

## Estimate Endpoint
* **Description**

    Return the estimate data from both Uber and Lyft endpoint.

* **URL**

  /api/estimate

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
    
    <Coordinates of departure and destination.>

    Name | Type | Description 
    :--- | :---| :---
    depar_lat | float | Latitude of departure location
    depar_lng | float | Longitude of departure location
    dest_lat | float | Latitude of destination location
    dest_lng | float | Longitude of destination location

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```json
    {
        "prices": [
            {
                "company": "uber",
                "display_name": "uberX",
                "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
                "max_estimate": 17,
                "min_estimate": 13,
                "distance": 6.17,
                "duration": 1080,
                "eta": 600,
                "currency_code": "USD"
            }
        ],
        "id": "foo-bar"
    }
    ```

    <Coordinates of departure and destination.>

    Name | Type | Description 
    :--- | :---| :---
    display_name | string | Name of the product
    product_id | string  | Product id
    max_estimate | float | Estimated max price in dollars
    min_estimate | float | Estimated min price in dollars
    distance | float | Distance of the ride in miles
    duration | float | Length of the trip in seconds
    eta | int | Estimated Arrival Time for the product in seconds
    currency_code | String | 
    id | String | UUID of the request

 
* **Error Response:**

* **Sample Call:**

    https://lyber.co/api/estimate?depar_lat=29.9902199&depar_lng=-95.33678270000001&dest_lat=29.70045739999999&dest_lng=-95.4097193

## Log Endpoint
* **URL**

  /api/log/request

* **Method**

  `POST`

*  **POST Params**

   **Required:**
    
    <Coordinates of departure and destination.>
    
    Name | Type | Description 
    :--- | :---| :---
    id   | string | request id
    deparLat | float | Latitude of departure location
    deparLng | float | Longitude of departure location
    destLat | float | Latitude of destination location
    destLng | float | Longitude of destination location
    company | String | Name of the company
    productName | String | Name of the product selected
    priceMin | float | Minimum of estimate price
    priceMax | float | Maximum of estiamte price
    eta | int | Estimated Arrival Time for the product in seconds
    priority | string | `time || price`
    

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```json
    "success"
    ```
 
* **Error Response:**


## (@Deprecated) Uber Endpoint
* **URL**

  /api/uber

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
    
    <Coordinates of departure and destination.>

    Name | Type | Description 
    :--- | :---| :---
    depar_lat | float | Latitude of departure location
    depar_lng | float | Longitude of departure location
    dest_lat | float | Latitude of destination location
    dest_lng | float | Longitude of destination location

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```json
    {
        "prices": [
            {
                "localized_display_name": "uberX",
                "distance": 6.17,
                "display_name": "uberX",
                "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
                "high_estimate": 17,
                "low_estimate": 13,
                "duration": 1080,
                "estimate": "$13-17",
                "currency_code": "USD"
            }
        ]
    }
    ```
 
* **Error Response:**

* **Sample Call:**

    https://lyber.co/api/uber?depar_lat=29.9902199&depar_lng=-95.33678270000001&dest_lat=29.70045739999999&dest_lng=-95.4097193

## (@Deprecated) Lyft Endpoint
* **URL**

  /api/lyft

* **Method:**
  
  `GET`
  
*  **URL Params**

   **Required:**
    
    <Coordinates of departure and destination.>

    Name | Type | Description 
    :--- | :---| :---
    depar_lat | float | Latitude of departure location
    depar_lng | float | Longitude of departure location
    dest_lat | float | Latitude of destination location
    dest_lng | float | Longitude of destination location

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    
    ```json
    {
        "cost_estimates": [
            {
                "ride_type": "lyft_plus",
                "estimated_duration_seconds": 913,
                "estimated_distance_miles": 3.29,
                "estimated_cost_cents_max": 2355,
                "primetime_percentage": "25%",
                "currency": "USD",
                "estimated_cost_cents_min": 1561,
                "display_name": "Lyft Plus",
                "primetime_confirmation_token": null,
                "cost_token": null,
                "is_valid_estimate": true
            }
        ]
    }
    ```
 
* **Error Response:**

* **Sample Call:**

https://lyber.co/api/lyft?depar_lat=29.9902199&depar_lng=-95.33678270000001&dest_lat=29.70045739999999&dest_lng=-95.4097193



