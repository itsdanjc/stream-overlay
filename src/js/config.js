/*
    Copyright (c) 2026 itsdanjc.
    Licensed under MIT.
*/

import schema from "./schemas/v1.json" with { type: "json" };
import { escapeURL } from "./format.js"
import {
    decodeQueryParams,
    searchStringToObject,
    withDefault,
    StringParam,
    NumberParam,
    ObjectParam,
    BooleanParam,
} from 'serialize-query-params';

const URLParam = {
    encode: (url) => 
        url == null ? encodeURIComponent(url.toString()) : "",
    decode: (str) => escapeURL(str)
};

const ColorParam = {
    encode: (colour) =>
        colour.substring(1).toLowerCase(),
    decode: (str) => {
        if(new RegExp("^#?([0-9a-f]{6})$", "gm").test(str)) {
            if (str.startsWith("#")) return str
            return "#" + str;
        }
    }
}

const ValueType = {
    string: StringParam,
    number: NumberParam,
    object: ObjectParam,
    boolean: BooleanParam,
    url: URLParam,
    color: ColorParam,
}


export class Config {
    /**
     * Object defined values for configuration.
     * @param {string} from URL param (like) list to extract configuration from.
     */
    constructor(from){
        const query = decodeQueryParams(
            Config.makeParamConfigMap(),
            searchStringToObject(from)
        )
        
        const fields = schema.fields;
        for (const param in fields){
            this.add(
                fields[param].id,   // Key
                query[param]        // Value
            )
        }        
    }

    /**
     * 
     * @returns 
     */
    static makeParamConfigMap(){
        const fields = Object.entries(schema.fields);
        let map = {};
    
        for (const [key, field] of fields){
            const type = ValueType[field.type];
            if(!type) {
                console.error(`Schema seems to be invalid: Invalid value type ${field.type}.`);
                continue;
            }   
            map[key] = withDefault(type, field.default ?? null)
        }

        return map
    }

    /**
     * 
     * @param {string} key 
     * @param {any} value 
     */
    add(key, value){
        if (!key.includes(".")){
            this[key] = value;
            return;
        }

        // Split keys into a tree structure using . as a separator.
        const parts = key.split(".");
        let ref = this;
        for (let i = 0; i < parts.length - 1; i++) {
            // Set the ref to the referring object, sets its value to an empty object if undefined.
            ref = ref[parts[i]] ??= {};
        }

        ref[parts.at(-1)] = value;
    }

    /**
     * 
     * @returns 
     */
    setColourStyles(){
        if(!this.colour) return;

        const colours = Object.entries(this.colour);
        const styleSheetEl = document.createElement("style");
        let rootStyle = "";
        
        for (const [rule, value] of colours){
            if (value)
                rootStyle += `--colour-${rule}: ${value};`;
        }

        styleSheetEl.innerHTML = `:root{${rootStyle}}`;
        document.head.appendChild(styleSheetEl);
    }
}
