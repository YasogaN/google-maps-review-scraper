# Endpoint: listugcposts

## Endpoint URL

```ruby
https://www.google.com/maps/rpc/listugcposts
```

## Parameters

- `authuser`: authernticated user id (`0`)

- `hl`: language (`en`)

- `gl`: region (`lk`)

- `pb`: Protobuffer Data  (`!1m7!1s0x3ae259fa5863aa65:0xe33d2d1f01284b9b!3s!6m4!4m1!1e1!4m1!1e3!2m2!1i10!2s!5m2!1sBnOwZvzePPfF4-EPy7LK0Ak!7e81!8m5!1b1!2b1!3b1!5b1!7b1!11m6!1e3!2e1!3sen!4slk!6m1!1i2!13m1!1e2`)

## Protocol Buffer Data Breakdown

1. `1m7` - message (7 blocks)

    1. `1s` - string: `Hex String 1` and `Hex String 2` from the [place url](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md#protcol-buffer-data-breakdown) sperated by a colon (`:`)

    2. `3s` - string: Search Query

    3. `6m4` - message (4 blocks)

        1. `4m1` - message (1 block)
            1. `1e1` - enum

        2. `4m1` - message (1 block)
            1. `1e3` - enum

        3. `2m2` - message (2 blocks)
            1. `1i10` - 32-bit integer: Number of results per page
            2. `2s` - string: Base 64 encoded data of page number [^4]

        4. `5m2` - message (2 blocks) [^1]
            1. `1s` - string: CSRF token <span style="color:orange">[UNCERTAIN]</span>
            2. `7e81` - enum

    4. `8m5` - message (5 blocks) [^2]
        1. `1b1` - boolean: Toggle number of likes (False returns `null`)
        2. `2b1` - boolean: Toggle the reply of the business (False returns an empty array (`[]`))
        3. `3b1` - boolean: Toggle the name of the google user (False returns `'A Google User'`)
        4. `5b1` - boolean: Multiple changes to the schema [^6]
        5. `7b1` - boolean: No idea what this does

    5. `11m6` - message (6 blocks)
        1. `1e3` - enum
        2. `2e1` - enum
        3. `3s` - string: Language
        4. `4s` - string: Region
        5. `6m1` - message (1 block)
            1. `1i2` - 32-bit integer: //DO
        6. `13m1` - message (1 block)
            1. `1e2` - enum: Sorting of results [^5]

[^1]: This message block seams to be a CSRF Token accompanied by a enumarative field. However any changes would result in a `400` Bad Request. It was also present in [listentitiesreviews](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/endpoints/listentitiesreviews.md) endpoint.

[^2]: This message block was also present in [listentitiesreviews](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/endpoints/listentitiesreviews.md) endpoint. As usual, 1 stands for true and 0 stands for false after the letter b.

[^4]: The string is an empty element when requesting for the first page of reviews.

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
