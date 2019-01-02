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
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString }
    })
});

const BandType = new GraphQLObjectType({
    name: 'Band',
    fields: ( ) => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        members: {
            type: GraphQLList(BandMemberType),
            resolve(parent, args) {
                return BandMember.find({ bandId: parent._id })
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
        bands: {
            type: new GraphQLList(BandType),
            resolve(parent, args){
                return Band.find({});
            }
        },
        band: {
            type: BandType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Band.findById(args.id);
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMusician: {
            type: MusicianType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                dob: { type: new GraphQLNonNull(GraphQLString) },
                instruments: { type: new GraphQLList(GraphQLString) }

            },
            resolve(parent, args){
                const musician = new Musician({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    dob: new Date(args.dob).toString(),
                    instruments: args.instruments
                });
                return musician.save();
            }
        },
        updateMusician: {
            type: MusicianType,
            args: {
                id: {type:new GraphQLNonNull( GraphQLID) },
                firstName: { type: GraphQLString },
                lastName:{ type: GraphQLString },
                dob: { type: GraphQLString },
                instruments: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args){
                return Musician.findOneAndUpdate({_id: args.id}, {$set:{instruments:args.instruments}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log(err);
                        throw err
                    }

                    return doc
                });
            }
        },
        addBand:{
            type: BandType,
            args: {
                name: { type: new GraphQLNonNull( GraphQLString ) },
                genre:{ type: GraphQLString },
                memberIds: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args){
                const band = new Band({
                    name: args.name,
                    genre: args.genre,
                    memberIds: { type: new GraphQLList(GraphQLString) }
                });
                return band.save();
            }
        },
        updateBand: {
            type: BandType,
            args: {
                id: {type:new GraphQLNonNull( GraphQLID) },
                firstName: { type: GraphQLString },
                memberIds: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args){
                return Musician.findOneAndUpdate({_id: args.id}, {$set:{memberIds:args.memberIds}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log(err);
                        throw err
                    }

                    return doc
                });
            }
        },
        addBandMember:{
            type: BandMemberType,
            args: {
                musicianId: { type: new GraphQLNonNull( GraphQLString ) },
                bandId: { type: new GraphQLNonNull( GraphQLString ) },
                startDate: {type:GraphQLString },
                endDate: {type:GraphQLString },
            },
            resolve(parent, args){
                const bandMember = new BandMember({
                    musicianId: args.musicianId,
                    bandId: args.bandId,
                    startDate:  (args.startDate ? new Date(args.startDate) : null ),
                    endDate: (args.endDate ? new Date(args.endDate) : null )
                });
                return bandMember.save();
            }
        },
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});