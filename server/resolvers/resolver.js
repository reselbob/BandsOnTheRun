const Musician = require('../models/musician');
const BandMember = require('../models/bandMember');
const Band = require('../models/band');
const Song = require('../models/song');
const Album = require('../models/album');


module.exports = {
    Query: {
        musicians: async (parent, args, context) => {
            return await Musician.find({}).sort('lastName');
        },
        songs: async (parent, args, context) => {
            return await Song.find({}).limit(30).sort('title');
        },
        song: async (parent, args, context) => {
            return await Song.findById(args.id);
        },
        albums: async (parent, args, context) => {
            return await Album.find({}).limit(30).sort('title');
        },
        album: async (parent, args, context) => {
            return await Album.findById(args.id);
        },
        bands: async (parent, args, context) => {
            return await Band.find({}).limit(30).sort('name');
        },
        bandmembers: async (parent, args, context) => {
            return await BandMember.find({}).limit(30)
        }
    },

    Musician: {
        dob:(parent,args,context,info) => {
            return new Date(parent.dob).toString();
        }
    },

    Album: {
        songs: async (album) => await Song.find({_id: {$in: album.songIds}}),
        band:  async (album) => Band.findById(album.bandId),
        musician: async (album) => Musician.findById(album.musicianId)
    },

    Band: {
        bandmembers : async (band) => await BandMember.find({bandId: band.id})
    },

    BandMember:{
        startDate:(parent,args,context,info) => {
            return new Date(parent.startDate).toString();
        },
        endDate:(parent,args,context,info) => {
            return new Date(parent.endDate).toString();
        },
        musician: async (bandmember) => {
            return await (Musician.findById(bandmember.musicianId))
        }
    },


    Song: {
        albums: async  (song) => {
            console.log(song.albumIds );
            return await Album.find({ songIds : {"$in" : [song.id]} })
        }
    },
};

