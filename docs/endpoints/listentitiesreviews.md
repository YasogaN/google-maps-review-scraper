# Endpoint: listentitiesreviews

## Endpoint URL
```ruby
https://www.google.com/maps/preview/review/listentitiesreviews
```

## Parameters
- `authuser`: authernticated user id (`0`)

- `hl`: language (`en`)

- `gl`: region (`lk`)

- `pb`: Protobuffer Data  (`!1m2!1y4243052730696051301!2y16374293431375645595!2m1!2i10!3e1!4m5!3b1!4b1!5b1!6b1!7b1!5m2!1sdzvaXrvAMImImAXHsLPICA!7e81`)


## Protocol Buffer Data Breakdown

1. `1m2` - message (2 blocks)
    1. `1y` - 64bit integer: `Hex String 1` from the [place url](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md#protcol-buffer-data-breakdown) in decimal
    2. `2y` - 64bit integer  `Hex String 2` from the [place url](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md#protcol-buffer-data-breakdown) in decimal

2. `2m1`/`2m2` - message (1 or 2 blocks)
    1. `2i` - 32bit integer: Number of Results
    2. `3s` - String: Base 64 encoded data of page number

3. `3e1` - enum: 1 

4. `4m5` - message (5 blocks) [^2]
    1. `3b1` - boolean
    2. `4b1` - boolean
    3. `5b1` - boolean
    4. `6b1` - boolean
    5. `7b1` - boolean

5. `5m2` - message (2 blocks) [^3]
    1. `1s` - string: CSRF Token <span style="color:orange">[UNCERTAIN]</span>
    2. `7e` - enum: 81


[^2]:This message block was also present in [listugcposts](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/endpoints/listugcposts.md) endpoint. I couldnt find what the boolean fields meant as the api did not respond to changes made in these fields. If anyone has any idea what the following means, a pull request or issue would be welcome.

[^3]:This message block seams to be a CSRF Token accompanied by a enumarative field. However any changes would result in a `400` Bad Request. It was also present in [listugcposts](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/endpoints/listugcposts.md) endpoint.