/*
    Factory functions for validating websocket message types.

    Copyright (c) 2026 itsdanjc.
    Licensed under MIT.
*/


// Object representing currently playing song.
export const Track = (t) => ({
    eventId:    t.eventId,
    trackId:    t.trackId,
    title:      t.title,
    artist:     t.artist,
    imageUrl:   t.imageUrl,
    appleMusicUrl: t.appleMusicUrl
});

// Object representing current programme.
export const Programme = (p) => ({
    name:           p.name,
    description:    p.description,
    imageUrl:       p.imageUrl,
    programmeId:    p.programmeId,
    start:          new Date( p.start ),
    end:            new Date( p.end ),
    contactPageUrl: p.contactPageUrl
});

// Object representing a websocket response message.
export const Message = (msg) => ({
    track: 
        msg["nowPlaying"] ? Track(msg["nowPlaying"]) : null,

    programme: 
        msg["nowProgramme"] ? Programme(msg["nowProgramme"]) : null,
});
