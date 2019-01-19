const { gql } = require('apollo-server');

module.exports = gql`
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
        runtime: Int
        albums: [Album]
    }

    type BandMember {
        id: String
        musician: Musician
        startDate: String
        endDate: String
    }

    type Band {
        id: String
        name: String
        bandmembers: [BandMember]
    }

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
        date: String
        payload: String
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
    }
`;