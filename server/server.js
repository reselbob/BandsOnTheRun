const { createServer } = require('http');
const bodyParser = require('body-parser');
const express = require('express');
//const graphqlHTTP = require('express-graphql');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema/schema');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { subscribe, execute } = require('graphql');
const cors = require('cors');
let database;
const app = express();

// allow cross-origin requests
app.use(cors());
database = require("./database/database");
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());


/*
// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
*/

app.use(
    '/graphql',
    graphqlExpress({
        context: {},
        schema
    })
);

app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
    })
);

/*
app.listen(PORT, () => {
    console.log(`now listening for requests on port ${PORT}`);
});*/

const server = createServer(app);

server.listen(PORT, err => {
    if (err) throw err;

    new SubscriptionServer(
        {
            schema,
            execute,
            subscribe,
            onConnect: () => console.log('Client connected')
        },
        {
            server,
            path: '/subscriptions'
        }
    );

    console.log(`> Ready on PORT ${PORT}`);
});