module.exports = `
    type Musician {
        id: String
        firstName: String
        lastName: String
        dob: String
        instruments: [String]
    }
   
    type Song {
        id: String
        title: String
        # musicians describes the composer(s) of the song
        musicians: [Musician]
        runtime: Int
        albums: [Album]
    }

    type BandMember {
        id: String
        band: Band
        musician: Musician
        startDate: String
        endDate: String
    }

    type Band {
        id: String
        name: String
        genre: String
        bandmembers: [BandMember]
    }

    """
    Describes an album released by either a band or musician
    """
    type Album {
        id: String
        title: String
        releaseDate: String
        songs: [Song]
        musician: Musician
        band: Band
    }

    type Event {
        id: String
        name: String
        createdAt: String
        storedAt: String
        payload: String
    }

    type TestEvent {
        title: String
        message: String
    }

    type Query {
        songs: [Song]
        song(id: String!): Song
        albums: [Album]
        album(id: String!): Album
        bandmembers: [BandMember]
        bands: [Band]
        band(id: String!): Band
        musicians: [Musician]
        musician: Musician
        events: [Event]
        eventsByDateRange: [Event]
        event: Event
        eventsByName: [Event]

    }
    type Mutation {
        addMusician(firstName: String!, lastName: String!, dob: String, instruments: [String] ): Musician
        addBandMember(bandId: String, musicianId : String, startDate : String, endDate: String): BandMember
        addBand(name: String, genre: String,  musicianIds: [String]): Band
        addSong (title: String, runtime: Int, musicianIds: [String]): Song
        addAlbum (title: String, releaseDate: String, songIds: [String]): Album
        addEvent (name: String!, payload: String): Event
        eventsByDateRange( startDate: String, endDate: String): [Event]
        eventsByName( name: String!): [Event]
        updateMusician(id: String!, firstName: String, lastName: String, dob: String, instruments: [String] ): Musician
        updateBandMember(bandmemberId : String!, bandId: String, musicianId : String, startDate : String, endDate: String): BandMember
        updateBand(bandId: String!, name: String, musicianIds: [String]): Band
        updateSong (id: String!, title: String, runtime: Int, musicianIds: [String]): Song
        updateAlbum (albumId: String!, title: String, releaseDate: String, songIds: [String]): Album
        testEvent(title: String, message: String): Event
    }

    type Subscription {
        eventAdded(topicName: String): Event
    }
    
`;
