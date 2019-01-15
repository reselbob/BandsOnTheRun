const graphql = require('graphql');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;
const GraphQLDate = require('graphql-date');
const socket = require('../socket');
const Musician = require('../models/musician');
const BandMember = require('../models/bandMember');
const Band = require('../models/band');
const Song = require('../models/song');
const Album = require('../models/album');
const mongoose = require('mongoose');
const Subscription = require('../subscriptions');


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
                return Musician.find({}).limit(30).sort('lastName');
            }
        },
        bands: {
            type: new GraphQLList(BandType),
            resolve(parent, args){
                return Band.find({}).limit(30).sort('name');
            }
        },
        band: {
            type: BandType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Band.findById(args.id);
            }
        },
        songs: {
            type: new GraphQLList(SongType),
            resolve(parent, args){
                return Song.find({}).limit(30).sort('title');
            }
        },
        song: {
            type: SongType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Song.findById(args.id);
            }
        },
        albums: {
            type: new GraphQLList(AlbumType),
            resolve(parent, args){
                return Album.find({}).limit(30).sort('name');
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
                return Musician.findOneAndUpdate({id: args.id}, {$set:{instruments:args.instruments}}, {new: true}, (err, doc) => {
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
                return Musician.findOneAndUpdate({id: args.id}, {$set:{memberIds:args.memberIds}}, {new: true}, (err, doc) => {
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
        addSong:{
            type: SongType,
            args: {
                title: { type:  new GraphQLNonNull( GraphQLString ) },
                runtime: { type: new GraphQLNonNull( GraphQLInt )},
                albumIds: { type: new GraphQLList(GraphQLString) }

            },
            resolve(parent, args){
                const song = new Song({
                    title: args.title,
                    runtime: args.runtime,
                    albumIds: args.albumIds
                });
                return song.save();
            }
        },
        updateSong: {
            type: SongType,
            args: {
                id: {type:new GraphQLNonNull( GraphQLID) },
                title: { type:  new GraphQLNonNull( GraphQLString ) },
                runtime: { type: new GraphQLNonNull( GraphQLInt )},
                albumIds: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args){
                return Musician.findOneAndUpdate({id: args.id}, {$set:{albumIds:args.albumIds, title:args.title, runtime:args.runtime }}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log(err);
                        throw err
                    }

                    return doc
                });
            }
        },
        addAlbum:{
            type: AlbumType,
            args: {
                title: { type:  new GraphQLNonNull( GraphQLString ) },
                bandId: { type:  GraphQLString },
                musicianId: { type:  GraphQLString },
                songIds: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args){
                const album = new Album({
                    title: args.title,
                    bandId: args.bandId,
                    musicianId: args.musicianId,
                    songIds: args.songIds
                });
                return album.save();
            }
        },
        updateAlbum:{
            type: AlbumType,
            args: {
                id: {type: new GraphQLNonNull( GraphQLID )  },
                title: { type:  new GraphQLNonNull( GraphQLString ) },
                bandId: { type:  GraphQLString },
                musicianId: { type:  GraphQLString },
                songIds: { type: new GraphQLList(GraphQLString) }
            },
            resolve(parent, args){
                return Musician.findOneAndUpdate({id: args.id},
                    {$set:{ title:args.title,
                            bandId:args.bandId,
                            musicianId:args.musicianId,
                            songIds:args.songIds}}, {new: true},
                    (err, doc) => {
                    if (err) {
                        console.log(err);
                        throw err
                    }
                    return doc
                });
            }
        },
    }
});

const Event = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        payload : {
            type: GraphQLString
        }
    })
});
/*
const Subscription =  new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        date: {
            type: GraphQLString
        },
        payload : {
            type: GraphQLString
        }
    }),
    subscribe: () => socket.asyncIterator('EVENT_CREATED')
});
*/

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
    subscription: Subscription
});