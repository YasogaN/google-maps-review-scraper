# Structure of the output

The output is an array of Review Objects.

Check [Reporting Issues](#reporting-issues) if you find any issues with this document.

## Review Object

### Format

```json
[
    [
        "Review_ID",
        [
            "<Review Metadata Object>"
        ],
        [
            "<Review Body Object>"
        ],
        null,
        "Unique_ID"
    ]
]
```

### Breakdown of the structure

1. `Review_ID`: 35 character alphanumarical string used to indentify that review.
2. Array: [Review Metadata Object](#review-metadata-object)
3. Array: [Review Body Object](#review-body-object)
4. `null`: <span style="color:yellow">Unidentified Field</span>
5. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>

## Review Metadata Object

### Format
```json
[
    "HexString1:HexString2",
    null, 
    0000000000000000, 
    0000000000000001
    [
        "<Contributor Metadata Object>"
    ],
    null,
    "Time"
    null,
    null,
    null,
    null,
    null,
    null,
    [
        "<Source Object>"
    ],
    null,
    0
]
```

### Breakdown of the structure

1.  `HexString1:HexString2`: `HexString1` can be identified to always be `0x0` and `HexString2` would be a unique identifier to the place where the review was placed on. [^1]
2.  `null`: <span style="color:yellow">Unidentified Field</span>
3.  `0000000000000000`: 16 digit number corresponding to a timestamp expressed in microseconds, when the review was first written.
4.  `0000000000000001`: 16 digit number corresponding to a timestamp expressed in microseconds, when the review was last edited. Could be the same as `0000000000000000`.
5.  Array: [Contributor Metadata Object](#contributor-metadata-object)
6. `null`: <span style="color:yellow">Unidentified Field</span>
7. `Time`: How ago the review was published.
8. `null`: <span style="color:yellow">Unidentified Field</span>
9. `null`: <span style="color:yellow">Unidentified Field</span>
10. `null`: <span style="color:yellow">Unidentified Field</span>
11. `null`: <span style="color:yellow">Unidentified Field</span>
12. `null`: <span style="color:yellow">Unidentified Field</span>
13. `null`: <span style="color:yellow">Unidentified Field</span>
14. Array [Source Object](#source-object)
15. `null`: <span style="color:yellow">Unidentified Field</span>
16. `0`: <span style="color:yellow">Unidentified Field</span>


## Contributor Metadata Object

### Format

```json
[
    null,
    null,
    [
        "Contributors_Reviews_URL"
    ],
    null,
    null,
    [
        "<Contributor Information Object>"
    ]
]
```

### Breakdown of structure

1. `null`: <span style="color:yellow">Unidentified Field</span>
2. `null`: <span style="color:yellow">Unidentified Field</span>
3. Array[^3]: 
   1. `Contributors_Reviews_URL`: URL linking to all reviews written by the contributor.
4. `null`: <span style="color:yellow">Unidentified Field</span>
5. `null`: <span style="color:yellow">Unidentified Field</span>
6. Array: [Contributor Information Object](#contributor-information-object)


## Contributor Information Object

### Format

```json
[
    "Name",
    "Profile_Picture",
    [
        "Contributor_URL"
    ],
    "User_ID",
    null,
    2,
    3,
    null,
    [4, 5, 6],
    7,
    [
        "Status_Reviews",
        null,
        null,
        null,
        null,
        [
            null,
            "Unique_ID"
        ]
    ]
]
```

### Breakdown of structure

1. `Name`: The name of the contributor. [^5]
2. `Profile_Picture`: Profile picture of the contributor.
3. Array:
   1. `Contributor_URL`: URL linking to the contributor's page.
4. `User_ID`: User ID of the contributor (numerical). [^3]
5. `null`: <span style="color:yellow">Unidentified Field</span>
6. `2`: Number of Reviews by the contributor. [^3]
7. `3`: Number of Pictures by the contributor [^2] [^3]
8. `null`: <span style="color:yellow">Unidentified Field</span>
9. Array[^3]: 
   1. `4`: <span style="color:yellow">Unidentified Field</span>
   2. `5`: <span style="color:yellow">Unidentified Field</span>
   3. `6`: <span style="color:yellow">Unidentified Field</span>
10. `7`: <span style="color:yellow">Unidentified Field</span> [^4]
11. Array[^4]: 
    1. `Status_Reviews`: Contians the number of reviews published by the contributor. If the contributor is a local guide, `Local Guide` is displayed first divided by a `·`.
    2. `null`: <span style="color:yellow">Unidentified Field</span>
    3. `null`: <span style="color:yellow">Unidentified Field</span>
    4. `null`: <span style="color:yellow">Unidentified Field</span>
    5. `null`: <span style="color:yellow">Unidentified Field</span>
    6. Array:
       1. `null`: <span style="color:yellow">Unidentified Field</span>
       2. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>


## Source Object

### Format

```json
[
    "Provider",
    "Image",
    00,
    "Identifier",
    00
]
```

### Breakdown of the structure

1. `Provider`: Name of the review Provider (Google, Tripadvisor, Priceline, Trip.com).
2. `Image`: URL linking to the branding image of that provider.
3. `00`: Number which corresponds with the provider id. <span style="color:orange">[UNCERTAIN]</span>
4. `Identifer`: A string containing a identifier of that Provider (google, tripadvisor, PricelineStandard, ctrip)
5. `00`: Maximum rating possible.


## Review Body Object

### Format

```json
[
    [
        0
    ],
    [
        "<Image Objects>"
    ],
    null,
    null,
    null,
    [
        "<Additional Information Objects>"
    ],
    null,
    [
        "<3rd Party Data Object>"
    ],
    null,
    null,
    null,
    null,
    null,
    [
        "language"
    ],
    [
        [
            "<Review Text Object>"
        ]
    ],
    [],
    [
        "<Review Text Metadata Object>"
    ],
    "Unique_ID"
]
```

### Breakdown of the structure
1. Array[^3]: 
    1. `0`: The rating out of 5. 
2. `null`: <span style="color:yellow">Unidentified Field</span>
3. Array: Array of [Image Objects](#image-object).
4. `null`: <span style="color:yellow">Unidentified Field</span>
5. `null`: <span style="color:yellow">Unidentified Field</span>
6. `null`: <span style="color:yellow">Unidentified Field</span>
7. Array: Array of [Additional Information Objects](#additional-information-object)[^3]
8. `null`: <span style="color:yellow">Unidentified Field</span>
9. Array: [3rd Party Data Object](#3rd-party-data-object)
10. `null`: <span style="color:yellow">Unidentified Field</span>
11. `null`: <span style="color:yellow">Unidentified Field</span>
12. `null`: <span style="color:yellow">Unidentified Field</span>
13. `null`: <span style="color:yellow">Unidentified Field</span>
14. `null`: <span style="color:yellow">Unidentified Field</span>
15. Array[^3]:
    1. `language`: 2 letter language code of the language the review is written on.
16. Array:
    1. Array: [Review Text Object](#review-text-object)
17. Array: Emtpy (<span style="color:yellow">Unidentified Field</span>)
18. Array: [Review Text Metadata Object](#review-text-metadata-object)
19. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>


## Image Object

### Format

```json
[
    "Picture_ID",
    [
        "Picture_ID",
        0,
        1,
        null,
        null,
        null,
        [
            "Image_URL",
            null,
            [
                2,
                3
            ]
        ],
        null,
        [
            [
                4,
                5,
                6
            ],
            [
                7,
                8
            ],
            [
                2,
                3
            ],
            9
        ],
        "Unique_ID",
        "Unique_ID",
        [
            "Report_URL",
            null,
            null,
            "Unique_ID"
        ],
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [
            "<Image Metdata Object>"
        ],
        9,
        null,
        null,
        null,
        null,
        null,
        null,
        [
            "10",
            "11"
        ]
    ],
]
```

### Breakdown of the structure
1. `Picture_ID`: Unique Identifier of the picture.
2. Array:
    1. `Picture_ID`: Another instance of the picture id.
    2. `0`: <span style="color:yellow">Unidentified Field</span>
    3. `1`: Number of Megapixels <span style="color:orange">[UNCERTAIN]</span>
    4. `null`: <span style="color:yellow">Unidentified Field</span>
    5. `null`: <span style="color:yellow">Unidentified Field</span>
    6. `null`: <span style="color:yellow">Unidentified Field</span>
    7. Array:
        1. `Image_URL`: URL linking to a centered and cropped image (150*150).
        2. `null`: <span style="color:yellow">Unidentified Field</span>
        3. Array: 
            1. `2`: Width of the image (in pixels).
            2. `3`: Height of the image (in pixels)
    8. `null`: <span style="color:yellow">Unidentified Field</span>
    9. Array:
        1. Array:
            1. `4`: <span style="color:yellow">Unidentified Field</span>
            2. `5`: Longitude of the place where the picture was taken.
            3. `6`: Latitude of the place where the picutre was taken.
        2. Array:
            1. `7`: Yaw of the picture <span style="color:orange">[UNCERTAIN]</span>
            2. `8`: Pitch of the picture <span style="color:orange">[UNCERTAIN]</span>
        3. Array:
            1. `2`: Width of the image (in pixels).
            2. `3`: Height of the image (in pixels)
        4. `9`: <span style="color:yellow">Unidentified Field</span>
    10. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
    11. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
    12. Array:
        1. `Report_URL`: URL linking to the report page of that image
        2. `null`: <span style="color:yellow">Unidentified Field</span>
        3. `null`: <span style="color:yellow">Unidentified Field</span>
        4. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
    13. `null`: <span style="color:yellow">Unidentified Field</span>
    14. `null`: <span style="color:yellow">Unidentified Field</span>
    15. `null`: <span style="color:yellow">Unidentified Field</span>
    16. `null`: <span style="color:yellow">Unidentified Field</span>
    17. `null`: <span style="color:yellow">Unidentified Field</span>
    18. `null`: <span style="color:yellow">Unidentified Field</span>
    19. `null`: <span style="color:yellow">Unidentified Field</span>
    20. `null`: <span style="color:yellow">Unidentified Field</span>
    21. `null`: <span style="color:yellow">Unidentified Field</span>
    22. Array: [Image Metadata Object](#image-metadata-object)
    23. `9`: <span style="color:yellow">Unidentified Field</span>
    24. `null`: <span style="color:yellow">Unidentified Field</span>
    25. `null`: <span style="color:yellow">Unidentified Field</span>
    26. `null`: <span style="color:yellow">Unidentified Field</span>
    27. `null`: <span style="color:yellow">Unidentified Field</span>
    28. `null`: <span style="color:yellow">Unidentified Field</span>
    29. `null`: <span style="color:yellow">Unidentified Field</span>
    30. Array: 
        1. `10`: A Number wrapped in a string. <span style="color:yellow">Unidentified Field</span>
        2. `11`: `HexString2` Converted to a signed decimal.


## Image Metadata Object

### Format

```json
[
    null,
    [
        0,
        "Unique_ID"
    ],
    [
        0,
        1,
        [
            2,
            3
        ]
    ],
    [
        null,
        null,
        null,
        null,
        null,
        [
            "Caption"
        ],
        null,
        [
            "Place"
        ]
    ],
    [
        null,
        [
            [
                [
                    "Name"
                ],
                "Profile_URL",
                "Profile_Picture"
            ]
        ]
    ],
    [
        [
            [
                4
            ],
            [
                [
                    null,
                    null,
                    null,
                    null,
                    5
                ]
            ]
        ]
    ],
    [
        6,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        [
            7,
            8,
            9,
            10,
            null,
            null,
            null,
            null,
            [
                "Time"
            ]
        ]
    ],
    [
        "Imagery_Report"
    ]
]
```

### Breakdown of the structure
1. `null`: <span style="color:yellow">Unidentified Field</span>
2. Array:
    1. `0`: <span style="color:yellow">Unidentified Field</span>
    2. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
3. Array:
    1. `1`: <span style="color:yellow">Unidentified Field</span>
    2. `2`: <span style="color:yellow">Unidentified Field</span>
    3. Array:
        1. `2`: Width of the image (in pixels).
        2. `3`: Height of the image (in pixels)
4. Array:
    1. `null`: <span style="color:yellow">Unidentified Field</span>
    2. `null`: <span style="color:yellow">Unidentified Field</span>
    3. `null`: <span style="color:yellow">Unidentified Field</span>
    4. `null`: <span style="color:yellow">Unidentified Field</span>
    5. `null`: <span style="color:yellow">Unidentified Field</span>
    6. Array:
        1. `Caption`: Caption/Alt Text of the image.
    7. `null`: <span style="color:yellow">Unidentified Field</span>
    8. Array:
        1. `Place`: Name of the Place
5. Array:
    1. `null`: <span style="color:yellow">Unidentified Field</span>
    2. Array: 
        1. Array:
            1. Array: 
                1. `Name`: Name of the Contributor. [^5]
            2. `Profile_URL`: URL linking to the profile of the contributor.
            3. `Profile_Picture`: URL linking to the profile picture of the contributor.
6. Array:
    1. Array:
        1. Array:
            1. `4`: <span style="color:yellow">Unidentified Field</span>
        2. Array: 
            1. Array:
                1. `null`: <span style="color:yellow">Unidentified Field</span>
                2. `null`: <span style="color:yellow">Unidentified Field</span>
                3. `null`: <span style="color:yellow">Unidentified Field</span>
                4. `null`: <span style="color:yellow">Unidentified Field</span>
                5. `5`: <span style="color:yellow">Unidentified Field</span>
7. Array:
    1. `6`: <span style="color:yellow">Unidentified Field</span>
    2. `null`: <span style="color:yellow">Unidentified Field</span>
    3. `null`: <span style="color:yellow">Unidentified Field</span>
    4. `null`: <span style="color:yellow">Unidentified Field</span>
    5. `null`: <span style="color:yellow">Unidentified Field</span>
    6. `null`: <span style="color:yellow">Unidentified Field</span>
    7. `null`: <span style="color:yellow">Unidentified Field</span>
    8. `null`: <span style="color:yellow">Unidentified Field</span>
    9. Array:
        1. `7`: Year the review was published
        2. `8`: Month the review was published
        3. `9`: Day the review was published
        4. `10`: Hour the review was published (GMT)
        5. `null`: <span style="color:yellow">Unidentified Field</span>
        6. `null`: <span style="color:yellow">Unidentified Field</span>
        7. `null`: <span style="color:yellow">Unidentified Field</span>
        8. `null`: <span style="color:yellow">Unidentified Field</span>
        9. Array: 
            1. `Time`: How ago the review was published.
8. Array:
    1. `Imagery_Report`: A URL linking to a `imagery/report` page where the image can be reported.

## Additional Information Object

### Format

```json
[
    [
        "Question_ID"
    ],
    "Question",
    [
        [
            [
                [
                    "Answer_ID"
                ],
                "Answer",
                0,
                null,
                null,
                "Unique_ID",
                null,
                null,
                1
            ]
        ],
        2
    ],
    null,
    null,
    "Displayed_Text",
    null,
    "Unique_ID",
    null,
    null,
    null,
    null,
    null,
    3
]
```

### Breakdown of the structure
1. Array:
    1. `Question_ID`: Internal identifier of the question asked when the contributor is submitting the review.
2. `Question`: Question displayed to the contributor when submitting the review.
3. Array:
    1. Array:
        1. Array:
            1. Array: 
                1. `Answer _ID`: Internal identifier of the contributor's selected answer
            2. `Answer`: Answer displayed to the users/contributor.
            3. `0`: <span style="color:yellow">Unidentified Field</span>
            4. `null`: <span style="color:yellow">Unidentified Field</span>
            5. `null`: <span style="color:yellow">Unidentified Field</span>
            6. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
            7. `null`: <span style="color:yellow">Unidentified Field</span>
            8. `null`: <span style="color:yellow">Unidentified Field</span>
            9. `1`: <span style="color:yellow">Unidentified Field</span>
    2. `2`: <span style="color:yellow">Unidentified Field</span>
4. `null`: <span style="color:yellow">Unidentified Field</span>
5. `null`: <span style="color:yellow">Unidentified Field</span> 
6. `Displayed_Text`: Question displayed to the users when viewing the review
7. `null`: <span style="color:yellow">Unidentified Field</span>
8. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
9. `null`: <span style="color:yellow">Unidentified Field</span>
10. `null`: <span style="color:yellow">Unidentified Field</span>
11. `null`: <span style="color:yellow">Unidentified Field</span>
12. `null`: <span style="color:yellow">Unidentified Field</span>
13. `null`: <span style="color:yellow">Unidentified Field</span>
14. `3`: <span style="color:yellow">Unidentified Field</span>


## 3rd Party Data Object

### Format

```json
[
    [
        "<Priceline Object>",
        "<Priceline Object>"
    ],
    1,
    "Rating"
]
```

### Breakdown of the structure
1. Array: Two [Priceline Objects](#priceline-object), each for postive and negative points. Returns `null` if from another source.
2. `1`: Rating as a number
3. `Rating`: Rating as a fraction


## Priceline Object

### Format
```json
[
    0,
    null,
    null,
    null,
    null,
    null,
    [
        "Text",
        null,
        [
            1,
            2
        ]
    ]
]
```

### Breakdown of the structure
1. `0`: `1` refers to positive point and `2` refers to negative point.
2. `null`: <span style="color:yellow">Unidentified Field</span>
3. `null`: <span style="color:yellow">Unidentified Field</span>
4. `null`: <span style="color:yellow">Unidentified Field</span>
5. `null`: <span style="color:yellow">Unidentified Field</span>
6. `null`: <span style="color:yellow">Unidentified Field</span>
7. Array:
    1. `Text`: Review text,
    2. `null`: <span style="color:yellow">Unidentified Field</span>
    3. Array:
        1. `1`: <span style="color:yellow">Unidentified Field</span>
        2. `2`: Number of characters tin the Review text.

## Review Text Object

### Format

```json
[
    "Text",
    null,
    [
        0,
        1
    ]
]
```

### Breakdown of the structure
1. `Text`: The text of the review. New lines are denoted by `/n`.
2. `null`: <span style="color:yellow">Unidentified Field</span>
3. Array:
    1. `0`: <span style="color:yellow">Unidentified Field</span>
    2. `1`: Number of Characters (Not always correct)


## Review Text Metadata Object

### Format

```json
[
    null,
    0,
    null,
    [
        "Review_URL_"
    ],
    [
        "Report_URL",
        null,
        null,
        "Unique_ID"
    ],
    1
]
```

### Breakdown of the structure
1. `null`: <span style="color:yellow">Unidentified Field</span>
2. `0`: <span style="color:yellow">Unidentified Field</span>
3. `null`: <span style="color:yellow">Unidentified Field</span>
4. Array:
    1. `Review_URL`: URL Linking to the review
5. Array[^3]:
    1. `Report_URL`: URL linking to a page where the user can report the review.
    2. `null`: <span style="color:yellow">Unidentified Field</span>
    3. `null`: <span style="color:yellow">Unidentified Field</span>
    4. `Unique_ID`: <span style="color:yellow">Unidentified Field</span>
6. `1`: <span style="color:yellow">Unidentified Field</span>


# Reporting Issues

If you find any mismatches, irregularities, or other issues with the API documentation or functionality, please help us improve by creating an issue.

You can submit an issue by clicking the "New Issue" button in the repository's [Issues tab](https://github.com/YasogaN/google-maps-review-scraper/issues).

When submitting an issue, kindly include the following details:

    + A clear description of the problem.
    + The url of the google maps place.
    + Steps to reproduce the issue.
    + Any relevant logs, error messages, or screenshots (if applicable).

[^1]: `HexString2` is can be identified to be `HexString2` from the [place url](https://github.com/YasogaN/google-maps-review-scraper/blob/main/docs/urls/place.md#protcol-buffer-data-breakdown)
[^2]: Number of pictures might not return the same number in the contributors profile.
[^3]: Could return `null` values if the review was not written on google maps itself but fetched from other sources (Tripadvisor, Priceline, Trip.com).
[^4]: Value is not included if the review was not written on google maps itself but fetched from other sources (Tripadvisor, Priceline, Trip.com).
[^5]: If the source is Trip.com, the name would be displayed as `Trip.com Member`, If the google user is Anonymous, it would be displayed as `A Google User`. If the source is Priceline and wishes to be Anonymous, it would be displayed as `""`.