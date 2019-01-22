const Musician = require('../models/musician');
const BandMember = require('../models/bandMember');
const Band = require('../models/band');
const Song = require('../models/song');
const Album = require('../models/album');
const Event = require('../models/event');
const {eventPublisher} = require('../library/eventPublisher');
const socket = require('../socket');
const EVENT_ADDED = 'EVENT_ADDED';

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
        },
        event: async (parent, args, context) => {
            return await Event.findById(args.id).limit(30).sort('date');
        },
        events: async (parent, args, context) => {
            return await Event.find({}).limit(30)
        },
        eventsByDateRange: async (parent, args, context) => {
            let startDate, endDate;

            try {
                startDate = new Date(args.startDate);
            } catch (e) {
                console.log(e)
            }

            try {
                endDate = new Date(args.endDate);
            } catch (e) {
                console.log(e)
            }

            return await Event.find({"createdAt": {"$gte": startDate, "$lt": endDate}}).limit(30)
        },

        eventsByName: async (parent, args, context) => {
            return await Event.find({name: args.name}).limit(30)
        }
    },

    Musician: {
        dob:(parent,args,context,info) => {
            return new Date(parent.dob).toString();
        }
    },

    Event: {
        createdAt:(parent,args,context,info) => {
            return new Date(parent.createdAt).toString();
        },
        storedAt: (parent,args,context,info) => {
            return new Date(parent.storedAt).toString();
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
        },
        band: async (bandmember) => {
            return await (Band.findById(bandmember.bandId));
        },
    },


    Song: {
        albums: async  (song) => {
            console.log(song.albumIds );
            return await Album.find({ songIds : {"$in" : [song.id]} })
        }
    },

    Subscription: {
        eventAdded: {
            subscribe: () => socket.asyncIterator(EVENT_ADDED)
        }
    },

    Mutation: {
        addMusician: async (root, args) => {
            const musician = new Musician({
                firstName: args.firstName,
                lastName: args.lastName,
                dob: new Date(args.dob).toString(),
                instruments: args.instruments
            });
            const data = await musician.save();
            await eventPublisher.publish('EVENT_ADDED', 'MUSICIAN_CREATED', data);
            return data;
        },
        addBandMember: async (root, args) => {
            const bandMember = new BandMember({
                musicianId: args.musicianId,
                bandId: args.bandId,
                startDate:  (args.startDate ? new Date(args.startDate) : null ),
                endDate: (args.endDate ? new Date(args.endDate) : null )
            });
            const data = await bandMember.save();
            await eventPublisher.publish('EVENT_ADDED', 'MUSICIAN_CREATED', data);
            return data;
        },
        addBand: async (root, args) => {
            const band = new Band({
                name: args.name,
                genre: args.genre,
                bandMemberIds: args.bandMemberIds
            });
            const data = await band.save();
            await eventPublisher.publish('EVENT_ADDED', 'BAND_CREATED', data);
            return data;
        },
        addSong: async (root, args) => {
            const song = new Song({
                title: args.title,
                runtime: args.runtime,
                musicianIds: args.musicianIds
            });
            const data = await song.save();
            await eventPublisher.publish('EVENT_ADDED', 'SONG_CREATED', data);
            return data;
        },
        addAlbum: async (root, args) => {
            const album = new Album({
                title: args.title,
                releaseDate: new Date(args.releaseDate),
                bandId: args.bandId,
                musicianId: args.musicianId,
                songIds: args.songIds
            });
            const data = await album.save();
            await eventPublisher.publish('EVENT_ADDED', 'ALBUM_CREATED', data);
            return data;
        },
        addEvent: async (root, args) => {
            const event = new Event({
                name: args.name.toUpperCase(),
                createdAt: new Date(),
                payload: args.payload,
            });
            return await event.save();
        },
        updateMusician: async (root, args) => {
            const updater = {};

            if (args.firstName) updater.firstName = args.firstName;
            if (args.lastName) updater.lastName = args.lastName;
            if (args.dob) updater.dob = new Date(args.dob).toString();
            if (args.instruments) updater.instruments = args.instruments;

            const data  = await Musician.findOneAndUpdate({_id: args.id}, {$set: updater}, {new: true});
            await eventPublisher.publish('EVENT_ADDED', 'MUSICIAN_UPDATED', data);
            return data;lt
        },
        updateBandMember: async (root, args) => {
            const updater = {};

            if (args.bandId) updater.bandId = args.bandId;
            if (args.musicianId) updater.musicianId = args.musicianId;
            if (args.startDate) updater.startDate = new Date(args.startDate).toString();
            if (args.endDate) updater.endDate = new Date(args.endDate).toString();

            const data  = await BandMember.findOneAndUpdate({_id: args.id}, {$set: updater}, {new: true});
            await eventPublisher.publish('EVENT_ADDED', 'BANDMEMBER_UPDATED', data);
            return data;
        },
        updateBand: async (root, args) => {
            const updater = {};

            if (args.name) updater.bandId = args.name;
            if (args.genre) updater.genre = args.genre;

            const data  = await Band.findOneAndUpdate({_id: args.id}, {$set:updater}, {new: true});
            await eventPublisher.publish('EVENT_ADDED', 'BAND_UPDATED', data);
            return data;

        },
        updateSong: async (root, args) => {
            const updater = {};

            if (args.title) updater.title = args.title;
            if (args.runtime) updater.runtime = args.runtime;
            if (args.musicianIds) updater.musicianIds = args.musicianIds;

            const data  = await Song.findOneAndUpdate({_id: args.id}, {$set: updater}, {new: true});
            await eventPublisher.publish('EVENT_ADDED', 'SONG_UPDATED', data);
            return data;
        },
        updateAlbum: async (root, args) => {
            const updater = {};

            if (args.title) updater.title = args.title;
            if (args.releaseDate) updater.releaseDate = new Date(args.releaseDate).toString();
            if (args.songIds) updater.songIds = args.songIds;

            const data  = await Album.findOneAndUpdate({_id: args.id}, {$set: updater}, {new: true});
            await eventPublisher.publish('EVENT_ADDED', 'ALBUM_UPDATED', data);
            return data;
        },
        testEvent: async (root, args) => {
            const payload = {
                title: args.title,
                message: args.message
            }

            const event = await eventPublisher.publish('EVENT_ADDED', 'TEST_EVENT', payload);
            return event
        }
    }
};

