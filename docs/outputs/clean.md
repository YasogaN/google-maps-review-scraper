# Structure of clean output

The output is an array of Review Objects.

Check [Reporting Issues](#reporting-issues) if you find any issues with this document.

## Review Object
```json
"review_id": "unique_id",
"time": {
    "published": "timestamp",
    "last_edited": "timestamp"
},
"author": {
    "name": "Contributor's Name",
    "profile_url": "URL to contributor's profile",
    "url": "URL to contributor's profile picture",
    "id": "Contributor's ID"
},
"review": {
    "rating": "Rating Given",
    "text": "Review Text" || null,
    "langage": "Language the review was written in" || null
},
"images": {
    "id": "Image ID",
    "url": "URL to image",
    "size": {
        "width": "Image width",
        "height": "Image height",
    },
    "location": {
        "friendly": "User friendly name of location",
        "lat": "Latitude when picture was taken",
        "long": "Longitiude when picture was taken",
    },
    "caption": "Image caption" || null
} || null
"source": "Name of platform where the review was published" || null
```

The above format should is self explanatory

# Reporting Issues

If you find any mismatches, irregularities, or other issues with the API documentation or functionality, please help us improve by creating an issue.

You can submit an issue by clicking the "New Issue" button in the repository's [Issues tab](https://github.com/YasogaN/google-maps-review-scraper/issues).

When submitting an issue, kindly include the following details:
+ A clear description of the problem.
+ The url of the google maps place.
+ Steps to reproduce the issue.
+ Any relevant logs, error messages, or screenshots (if applicable).