import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import {getSongsQuery, getSongsQuery} from '../queries/queries';

class SongList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
    }
    displaySongs(){
        var data = this.props.data;
        if(data.loading){
            return( <div>Loading songs...</div> );
        } else {
            return data.songs.map(song => {
                return(
                    <li key={ song.id } onClick={ (e) => this.setState({ selected: song.id }) } >{ song.title} : { song.runtime }</li>
                );
            })
        }
    }
    render(){
        return(
            <div>
                <div id="new-song">Add Song</div>
                <ul id="song-list">
                    { this.displaySongs() }
                </ul>
            </div>
        );
    }
}

export default graphql(getSongsQuery)(SongList);