import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getMusiciansQuery } from '../queries/queries';

// components
import MusicianDetails from './MusicianDetails';

class MusicianList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
    }
    displayMusicians(){
        var data = this.props.data;
        if(data.loading){
            return( <div>Loading musicians...</div> );
        } else {
            return data.musicians.map(musician => {
                return(
                    <li key={ musician.id } onClick={ (e) => this.setState({ selected: musician.id }) } >{ musician.firstName } { musician.lastName }</li>
                );
            })
        }
    }
    render(){
        return(
            <div>
                <div id="new-musician">Add Musician</div>
                <ul id="musician-list">
                    { this.displayMusicians() }
                </ul>
                <MusicianDetails musicianId={ this.state.selected } />
            </div>
        );
    }
}

export default graphql(getMusiciansQuery)(MusicianList);
