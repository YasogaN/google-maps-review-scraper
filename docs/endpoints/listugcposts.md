# Endpoint: listugcposts

## Endpoint URL

```ruby
https://www.google.com/maps/rpc/listugcposts
```

## Parameters

- `authuser`: authernticated user id (`0`)

- `hl`: language (`en`)

- `gl`: region (`US`)

- `pb`: Protobuffer Data  (`!1m6!1s0x3ae259fa5863aa65:0xe33d2d1f01284b9b!6m4!4m1!1e1!4m1!1e3!2m2!1i10!2s!5m2!1sSessionToken!7e81!8m9!2b1!3b1!5b1!7b1!12m4!1b1!2b1!4m1!1e1!11m4!1e3!2e1!6m1!1i2!13m1!1e2`)

## Protocol Buffer Data Breakdown

1. `1m6` (or `1m7` if search query is present) - message
    1. `1s` - string: `Hex String 1` and `Hex String 2` from the [place url](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md#protcol-buffer-data-breakdown) seperated by a colon (`:`)
    2. `3s` - string: Search Query (Only present if parent is `1m7`)
    3. `6m4` - message
        1. `4m1` - message
            1. `1e1` - enum
        2. `4m1` - message
            1. `1e3` - enum
        3. `2m2` - message
            1. `1i10` - int: Number of results per page
            2. `2s` - string: Base 64 encoded data of page number [^4]
        4. `5m2` - message [^1]
            1. `1s` - string: Session Token
            2. `7e81` - enum
    4. `8m9` - message [^2]
        1. `2b1` - boolean: Toggle number of likes
        2. `3b1` - boolean: Toggle the name of the google user
        3. `5b1` - boolean: Multiple changes to the schema [^6]
        4. `7b1` - boolean: No idea what this does
        5. `12m4` - message
            1. `1b1` - boolean
            2. `2b1` - boolean
            3. `4m1` - message
                1. `1e1` - enum
        6. `11m4` - message
            1. `1e3` - enum
            2. `2e1` - enum
            3. `6m1` - message
                 1. `1i2` - int
        7. `13m1` - message
            1. `1e2` - enum: Sorting of results [^5]

[^5]:| Value | Meaning (First) |
     |-------|-----------------|
     | 1     | Most Relevant   |
     | 2     | Newest          |
     | 3     | Highest Rating  |
     | 4     | Lowest Rating   |

[^6]: Multiple Changes are present in the schema
    - Resolution fields (false returns `0` for width and height instead of actual values)
    - Coordinates of picture (false returns `0` for latitude and longitude instead of actual values)
    - Report url (false returns `https://www.google.com/cbk?output=report&` instead of `//www.google.com/local/imagery/report/?` for prefix of the url)
    - Credits to the OP (false doesn't return the fields)
    - Date & time of upload (false returns `null`)
    - Other unidentifiable fields (false doesn't return the fields)
