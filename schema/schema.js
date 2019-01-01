const graphql = require('graphql');
const Musician = require('../models/musician');
const BandMember = require('../models/bandMember');
const Band = require('../models/band');
const Song = require('../models/song');
const Album = require('../models/album');
const mongoose = require('mongoose');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
    return this.toString();
};

const SongType = new GraphQLObjectType({
    name: 'Song',
    fields: ( ) => ({
        _id: { type: GraphQLID },
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

const MusicianType = new GraphQLObjectType({
    name: 'Musician',
    fields: ( ) => ({
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        dob: { type: GraphQLString },
        instruments: { type: new GraphQLList(GraphQLString) }
    })
});

const BandMemberType = new GraphQLObjectType({
    name: 'BandMember',
    fields: ( ) => ({
        _id: { type: GraphQLID },
        band: {
            type: BandType,
            resolve(parent, args) {
                return Band.findById(parent.bandId);
            }
        },
        musician: {
            type: MusicanType,
            resolve(parent, args) {
                return Musican.findById(parent.musicianId);
            }
        },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString }
    })
});

const BandType = new GraphQLObjectType({
    name: 'Band',
    fields: ( ) => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        members: {
            type: GraphQLList(BandMemberType),
            resolve(parent, args) {
                return BandMember.find({ bandId: parent.id });
            }
        }
    })
});

const AlbumType = new GraphQLObjectType({
    name: 'Album',
    fields: ( ) => ({
        _id: { type: GraphQLID },
        title: { type: GraphQLString },
        songs: {
            type: SongType,
            resolve(parent, args) {
                return Song.find({ album: {id: parent.id }});
            }
        },
        band:{
            type: BandType,
            resolve(parent, args) {
                return Band.find({ id: args.bandId });
            }
        },
        musician: {
            type: MusicianType,
            resolve(parent, args) {
                return Musician.find({ id: args.musicianId });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        musician: {
            type: MusicianType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Musician.findById(args.id);
            }
        },
        musicians: {
            type: new GraphQLList(MusicianType),
            resolve(parent, args){
                return Musician.find({});
            }
        },
    }
});

/*const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {}
});*/

module.exports = new GraphQLSchema({
    query: RootQuery
});