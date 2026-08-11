# Stream Overlay

This is a OBS browser source using the [Aiir](https://aiir.com) metadata API,
to display **Now Playing** and **Current Programme** information.

I made this with [Moore Student Radio](https://itsdanjc.com/msr) for our studio
camera livestream, as we wanted to give our viewers a similar experience our listeners have on our website.

## Usage
**In order to use Stream Overlay, you must be use using Aiir CMS.**

**This project is packaged using the [NPM](https://npmjs.com) package manager**,
if you don't have this, install this first.

```bash
# Installation
mkdir streamoverlay & cd streamoverlay
npm install stream-overlay

# Build and serve with NPM
npm run build --serve
```

You should now have successfully built the project!

### Configuation

Configuration of the overlay is done using [URL parameters](https://en.wikipedia.org/wiki/Query_string).

URL params appear at the end of the URL and start with a `?` character.
They are key, value pairs in the format `<key>=<value>`. It is delimited by a `&` character.
An example configuration is provided below:

```url
http://127.0.0.1:8000/?id=1234&pc=1f468f&sc=1f468f&=ffffff
```


| Key   | Required | Description                                                               | Expected Values                | Default       |
|:-----:|:--------:|:--------------------------------------------------------------------------|:-------------------------------|:--------------|
| `id`  | Yes      | The Station ID you use to send metadata to Aiir CMS.                      | 4 digit alphanumeric string.   |               |
| `qr`  |          | Use QR codes with a link to Apple Music, instead of showing cover art.    | 1 to enable, 0 to disable.     |               |
| `pc`  | Yes      | Primary colour to use throughout.                                         | Hex Color Value.               |               |
| `sc`  | Yes      | Secondary colour to use throughout.                                       | Hex Color Value.               |               |
| `fc`  | Yes      | Colour to use for text.                                                   | Hex Color Value.               | `FFFFFF`      |
| `tt`  |          | Text to use on line 1 (title line) of the track info card.                |                                | "Now Playing" |
| `pt`  |          | Text to use on line 1 (title line) of the programme info card.            |                                | "Live Now"    |
| `tl1` |          | Title of the track placeholder.                                           |                                |               |
| `tl2` |          | Content of the track placeholder.                                         |                                |               |
| `tl3` |          | Footer of the track placeholder.                                          |                                |               |
| `tth` |          | Thumbnail of the track placeholder.                                       |                                |               |
| `pl1` |          | Title of the programme placeholder.                                       |                                |               |
| `pl2` |          | Content of the programme placeholder.                                     |                                |               |
| `pl3` |          | Footer of the programme placeholder.                                      |                                |               |
| `pth` |          | Thumbnail of the programme placeholder.                                   |


## License and Disclaimers

Copyright (c) 2026 itsdanjc

Licensed under the MIT License, see [LICENCE](./LICENCE) for more information.


Aiir and Aiir CMS are trademarks of Aiir Inc. This project is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Aiir Inc.