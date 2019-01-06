import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getMusicianQuery } from '../queries/queries';

class MusicianDetails extends Component {
    displayMusicianDetails(){
        const { musician } = this.props.data;
        if(musician){
            var cdate = (new Date(musician.dob)).toLocaleDateString();
            return(
                <div>
                    <h2>{ musician.firstName } { musician.lastName }</h2>
                    <p>{ cdate }</p>
                    <p>Instruments:</p>
                    <ul className="instruments">
                        { musician.instruments.map(item => {
                            return <li key={item}>{ item }</li>
                        })}
                    </ul>
                </div>
            );
        } else {
            return( <div>No musician selected...</div> );
        }
    }
    render(){
        return(
            <div id="musician-details">
                { this.displayMusicianDetails() }
            </div>
        );
    }
}

export default graphql(getMusicianQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.musicianId
            }
        }
    }
})(MusicianDetails);