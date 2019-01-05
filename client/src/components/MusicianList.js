import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getMusiciansQuery } from '../queries/queries';

// components
import MusicianDetails from './MusicianDetails';

class MusicianList extends Component {
    displayMusicians(){
        var data = this.props.data;
        if(data.loading){
            return( <div>Loading musicians...</div> );
        } else {
            return data.musicians.map(musician => {
                return(
                    <li key={ musician.id }>{ musician.firstName } { musician.lastName }</li>
                );
            })
        }
    }
    render(){
        return(
            <div>
                <ul id="musician-list">
                    { this.displayMusicians() }
                </ul>
                <MusicianDetails />
            </div>
        );
    }
}

export default graphql(getMusiciansQuery)(MusicianList);
