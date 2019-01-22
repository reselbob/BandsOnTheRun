const { ApolloServer, gql } = require('apollo-server');
import { SubscriptionServer } from 'subscriptions-transport-ws';
const schema = require('./schema/schema');

const database = require("./database/database");
const server = new ApolloServer({ schema });

const PORT = process.env.PORT || 4000;

server.listen(PORT).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});