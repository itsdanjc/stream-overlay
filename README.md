# Stream Overlay

This is a OBS browser source using the [Aiir](https://aiir.com) metadata API,
to display **Now Playing** and **Current Programme** information.

I made this with [Moore Student Radio](https://itsdanjc.com/msr) for our studio
camera livestream, as we wanted to give our viewers a similar experience our listeners have on our website.

## Features
**In order to use Stream Overlay, you must be use using Aiir CMS.**

- Built-In configurator.
- QR code generation.
- OBS integration.
- Portable installation.

## Usage

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

In a web browser navigate to <http://127.0.0.1:8000/config.html> 
to access the configuration UI.

## License and Disclaimers

Copyright (c) 2026 itsdanjc

Licensed under the MIT License, see [LICENCE](./LICENCE) for more information.


Aiir and Aiir CMS are trademarks of Aiir Inc. This project is an independent open-source project and is not affiliated with, endorsed by, or sponsored by Aiir Inc.