import * as esbuild from 'esbuild'
import { mkdir, readFile, writeFile } from "node:fs/promises"
import htmlPlugin from "@chialab/esbuild-plugin-html";

import { BANNER } from './banner.js';

const OUT_DIR = "./dist";
const TO_BUILD = ["src/*.html"];

// Define and make output directory
await mkdir(OUT_DIR, { recursive: true });

// Build using html files as entrypoints.
let html = await esbuild.build({
    entryPoints: TO_BUILD,
    outdir: OUT_DIR,
    assetNames: 'static/[name]',
    chunkNames: '[name].min',
    bundle: true,
    banner: {
        js: BANNER,
        css: BANNER
    },
    loader: {
        ".ttf": "copy",
    },
    minify: true,
    plugins: [htmlPlugin()],
});