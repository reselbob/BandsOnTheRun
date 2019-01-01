const express = require('express');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL schema
const schema = buildSchema(`
    type Query {
        instrument(id, String!): Instrument
        instruments(): [Instrument]
        musician(id, String!): Musician
        musicians(): [Musician]
        bandMember(id, String!): BandMember
        bandMembers(): [BandMember]
        band(id, String!): Band
        bands(): [Band]
        song(id, String!): Song
        songs(): [Song]
        album(id, String!): Album
        albums(): [Album]
    },
    type Musician {
        id: String
        firstName: String
        lastName: String
        dob: String
        instruments: [String]
    },
    type BandMember {
        id: String
        musician: Musician
        startDate: String
        endDate: String
    },
    type Band {
        id: String
        name: String
        members: [BandMember] 
    },
    type Song {
        id: String
        title: String
        runtime: Int
    },
    type Album {
        id: String
        title: String
        releaseDate: String
        band: Band
        musician: Musician
        songs: [Song]
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCourse = function(args) { 
    const id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = function(args) {
    if (args.topic) {
        const topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

const root = {
    course: getCourse,
    courses: getCourses,

};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));