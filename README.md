# Stream Overlay

This is a OBS browser source using the [Aiir](https://aiir.com) metadata API,
to display **Now Playing** and **Current Programme** information.

I made this with [Moore Student Radio](https://itsdanjc.com/msr) for our studio
camera livestream, as we wanted to give our viewers a similar experience our listeners have on our website.

## Usage
**In order to use Stream Overlay, you must be use using Aiir CMS.**

**This project is packaged using the [NPM](https://npmjs.com) package manager**,
if you don't have this, install this first. You will also need a web server, for example, [Python](https://python.org).

The following will install stream-overlay using a prebuilt package:
```bash
cd /path/to/installation/directory
npm init
npm install stream-overlay
```

The package will now be installed. In order to use in OBS, a web server is necessary.
In this example, we will use Python's `http.server` library:

```bash
python -m http.server -d node_modules/stream-overlay/dist/
```


For a more custom installation, you may wish to install and build manually:

1.  Using [Git](https://git-scm.com/), clone this repository locally.

    ```bash
    git clone https://github.com/itsdanjc/stream-overlay.git /path/to/installation/directory
    ```
2.  Then, using NPM, build the project.

    ```bash
    cd /path/to/installation/directory
    npm ci
    npm run build
    ```
    This will create a package in a new `dist/` directory, this is were we'll serve from.

3.  Serve using a web server, for example with Python.

    ```
    python -m http.server -d dist/ 
    ```


### Configuation

Configuration of the overlay is done using [URL parameters](https://en.wikipedia.org/wiki/Query_string).

URL params appear at the end of the URL and start with a `?` character.
They are key, value pairs in the format `<key>=<value>`. It is delimited by a `&` character.
An example configuration is provided below:

```url
http://127.0.0.1:8000/?id=1234&pc=1f468f&sc=1f468f&=ffffff
```


| Key   | Required | Description                                                                   | Expected Values                | Default       |
|:-----:|:--------:|:------------------------------------------------------------------------------|:-------------------------------|:--------------|
| `id`  | Yes      | The Station ID you use to send metadata to Aiir CMS.                          | 4 digit alphanumeric string.   |               |
| `qr`  |          | Use QR codes with a link to Apple Music, instead of showing cover art.        | 1 to enable, 0 to disable.     |               |
| `pc`  | Yes      | Primary colour to use throughout.                                             | Hex Color Value.               |               |
| `sc`  | Yes      | Secondary colour to use throughout.                                           | Hex Color Value.               |               |
| `bgc` |          | Background colour to use for QR codes, only useful when QR codes are enabled. | Hex Color Value.               | `FFFFFF`      |
| `fgc` |          | Foreground colour to use for QR codes, only useful when QR codes are enabled. | Hex Color Value.               | `000000`      |
| `fc`  | Yes      | Colour to use for text.                                                       | Hex Color Value.               | `FFFFFF`      |
| `tt`  |          | Text to use on line 1 (title line) of the track info card.                    |                                | "Now Playing" |
| `pt`  |          | Text to use on line 1 (title line) of the programme info card.                |                                | "Live Now"    |
| `tl1` |          | Title of the track placeholder.                                               |                                |               |
| `tl2` |          | Content of the track placeholder.                                             |                                |               |
| `tl3` |          | Footer of the track placeholder.                                              |                                |               |
| `tth` |          | Thumbnail of the track placeholder.                                           |                                |               |
| `pl1` |          | Title of the programme placeholder.                                           |                                |               |
| `pl2` |          | Content of the programme placeholder.                                         |                                |               |
| `pl3` |          | Footer of the programme placeholder.                                          |                                |               |
| `pth` |          | Thumbnail of the programme placeholder.                                       |


## License and Disclaimers

Copyright (c) 2026 itsdanjc

Licensed under the MIT License, see [LICENCE](./LICENCE) for more information.


Aiir and Aiir CMS are trademarks of Aiir Inc. This project is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Aiir Inc.