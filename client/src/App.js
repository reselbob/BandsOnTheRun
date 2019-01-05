import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// components
import MusicianList from './components/MusicianList';

// apollo client setup
const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql'
});

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
            <div id="main">
                <h1>Bands On The Run</h1>
                <h2>Musicians</h2>
                <MusicianList />

            </div>
        </ApolloProvider>
    );
  }
}

export default App;
