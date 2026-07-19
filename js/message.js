/*
    Factory functions for validating websocket message types.

    Copyright (c) 2026 itsdanjc.
    Licensed under MIT.
*/

import { formatTime } from "./format.js";

// Object representing currently playing song.
export const TrackData = (t) => ({
    eventId:    t.eventId,
    trackId:    t.trackId,
    title:      t.title,
    artist:     t.artist,
    imageUrl:   t.imageUrl,
    appleMusicUrl: t.appleMusicUrl
});

export const TrackCardBody = (t) => ({
    line_1:    "Now Playing",
    line_2:    t.title    ?? "Unknown Song",
    line_3:    t.artist   ?? "Unknown Artist",
    thumbnail: t.imageUrl ?? "about:blank",
});

// Object representing current programme.
export const ProgrammeData = (p) => ({
    name:           p.name,
    description:    p.description,
    imageUrl:       p.imageUrl,
    programmeId:    p.programmeId,
    start:          new Date( p.start ),
    end:            new Date( p.end ),
    contactPageUrl: p.contactPageUrl
});

export const ProgrammeCardBody = (p) => ({
    line_1: "Live Now",
    line_2: p.name ?? "Unknown Programme",
    line_3:
        `${formatTime(p.start)} \u2013 ${formatTime(p.end)}`,
    thumbnail: p.imageUrl ?? "about:blank",
});

// Object representing a websocket response message.
export const Message = (msg) => ({
    track: (
        msg["nowPlaying"] && 
        msg["nowPlaying"].type == "track"

    ) ? TrackData(msg["nowPlaying"]) : null,

    programme: (
        msg["nowProgramme"] && 
        msg["nowProgramme"].type == "programme"
        
    ) ? ProgrammeData(msg["nowProgramme"]) : null,
});
