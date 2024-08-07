# URL: place

## URL
```ruby
https://www.google.com/maps/place/
```

## Parameters
- `Place Name`: Name of the Place (Whitespaces denoted by `+`)
- `Country Name`: Name of Country (Whitespaces denoted by `+`)
- `Latitude`: Latitude of the point at center of screen (Accurate to 7 decimal places)
- `Longitude`: Longitude of the point at center of screen (Accurate to 7 decimal places)
- `Zoom Level`: Zoom Level of the map
- `PBData`: Protobuffer Data

## Construction of the URL
- First Level: `Place Name` and `Country Name` connected by `++` 

    eg: `The+White+House++United+States`

- Second Level: `Latitude`, `Longitude` and `Zoom Level` sperated by commas (`,`), starting with the unicode character `U+0040` (`@`) and ending with the letter `z`.

    eg: `@38.8864874,-77.0377681,15z`

- Third Level: `PBData` with the prefix `data=`

    eg: `data=!4m6!3m5!1s0x89b7b7bcdecbb1df:0x715969d86d0b76bf!8m2!3d38.8976763!4d-77.0365298!16zL20vMDgxc3E`


### Constructed URL
```ruby
https://www.google.com/maps/place/[Place Name++Country Name]/@[Latitude],[Longitude],[ZoomLevel]z/data=[PBData]
```

### Sample URL
```ruby
https://www.google.com/maps/place/The+White+House++United+States/@38.8864874,-77.0377681,15z/data=!4m6!3m5!1s0x89b7b7bcdecbb1df:0x715969d86d0b76bf!8m2!3d38.8976763!4d-77.0365298!16zL20vMDgxc3E
```

## Protcol Buffer Data Breakdown
1. `4m6` - message (6 blocks)
    1. `3m5` - message (5 blocks)
        1. `1s` - string: Hexadecimal string of Place ID (`Hex String 1`:`Hex String 2`)
        2. `8m2` - message (2 blocks)
            1. `3d` - double: Latitude
            2. `4d` - double: Longitiude
        3. 2 possible cases:
            - If an MID is assigned to the place: `16z` - base64 (no padding): MID of the location
            - If not: `16s` - string: unique identifer of the location created by google maps <span style="color:orange">[UNCERTAIN]</span>