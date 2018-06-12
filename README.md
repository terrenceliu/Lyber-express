**Lyber server**
----

## Uber Endpoint
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

## Lyft Endpoint
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


