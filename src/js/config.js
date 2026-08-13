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

/**
 * 
 * @returns 
 */
function makeParamConfigMap(){
    const fields = schema.fields;
    let schemaConfigMap = {};

    for (const key in fields){
        var type;

        if (key in ValueType){
            type = ValueType[ fields[key].type ];
        } else {
            type = StringParam;
        }

        schemaConfigMap[key] = withDefault(
            type, fields[key].default
        )
    }

    return schemaConfigMap
}

/**
 * 
 */
export class Configuration {
    constructor(paramsString){
        const query = decodeQueryParams(
            makeParamConfigMap(),
            searchStringToObject(paramsString)
        )

        for (const key in query){
            this[key] = query[key];
        }

        console.log(this)
    }
}















export const stationId = "5188";
export const useQR = true;

export const placeholders = {
    track: {
        line_1: "Placeholder Title",
        line_2: "Placeholder Content",
        line_3: "Placeholder Footer",
    },
    programme: {
        line_1: "On Air",
        line_2: "24/7 Hits",
        line_3: "example.com/radio",
    }
}