const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
} = graphql;

const Musician = require('../models/musician');
const BandMember = require('../models/bandMember');
const Band = require('../models/band');
const Song = require('../models/song');
const Album = require('../models/album');
const mongoose = require('mongoose');

const GraphQLDate = require('graphql-date');
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
    return this.toString();
};

const SongType = new GraphQLObjectType({
    name: 'Song',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        runtime: { type: GraphQLInt },
        albums: {
            type: GraphQLList(AlbumType),
            resolve(parent, args) {
                return Album.find({id : args.albumId });
            }
        }
    })
});
const AlbumType = new GraphQLObjectType({
    name: 'Album',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        releaseDate: {type: GraphQLDate},
        songs: {
            type: GraphQLList(SongType),
            resolve(parent, args) {
                return Song.find({ id: { $in: parent.songIds } });
            }
        },
        band:{
            type: BandType,
            resolve(parent, args) {
                return Band.findById(parent.bandId );
            }
        },
        musician: {
            type: MusicianType,
            resolve(parent, args) {
                return Musician.findById(parent.musicianId );
            }
        }
    })
});
const MusicianType = new GraphQLObjectType({
    name: 'Musician',
    fields: ( ) => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        dob: { type: GraphQLDate },
        instruments: { type: new GraphQLList(GraphQLString) }
    })
});
const BandMemberType = new GraphQLObjectType({
    name: 'BandMember',
    fields: ( ) => ({
        id: { type: GraphQLID },
        bandId: { type: GraphQLID },
        musicianId: { type: GraphQLID },
        band: {
            type: BandType,
            resolve(parent, args) {
                return Band.findById(parent.bandId);
            }
        },
        musician: {
            type: MusicianType,
            resolve(parent, args) {
                return Musician.findById(parent.musicianId);
            }
        },
        startDate: { type: GraphQLDate },
        endDate: { type: GraphQLDate }
    })
});
const BandType = new GraphQLObjectType({
    name: 'Band',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        members: {
            type: GraphQLList(BandMemberType),
            resolve(parent, args) {
                return BandMember.find({ bandId: parent.id })
            }
        }
    })
});
const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'The unique identifier of the event'
        },
        name: {
            type: GraphQLString,
            description: 'The name of event, for example, SONG_ADDED'
        },
        date: {
            type: GraphQLString,
            description: 'The date time when the event was raised.'
        },
        payload: {
            type: GraphQLString,
            description: 'The payload that contains information releveant to the event, (optional)'
        }

    })
});

module.exports = {
    SongType,
    AlbumType,
    MusicianType,
    BandMemberType,
    BandType,
    EventType
}