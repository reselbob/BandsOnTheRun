import { gql } from 'apollo-boost';

const getAuthorsQuery = gql`
    {
        authors {
            name
            id
        }
    }
`;

const getMusiciansQuery = gql`
    {
        musicians {
            firstName
            lastName
            dob
            instruments
        }
    }
`;

const getAlbumsQuery = gql`
    {
        musician{
            firstName
            lastName
        }
        band{
           name 
        }
        title
        songs {
            title
            runtime
        }
    }
`;

const getSongsQuery = gql`
    {
        songs {
            title
            runtime
        }
    }
`;

const getBandsQuery = gql`
    {
        name
        startDate
        endDate
        members{
            musicians{
                firstName
                lastName
                dob
                instruments
            }
        }       
    }
`;

const getBooksQuery = gql`
    {
        books {
            name
            id
        }
    }
`;

const addBookMutation = gql`
    mutation AddBook($name: String!, $genre: String!, $authorId: ID!){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`;

const getBookQuery = gql`
    query GetBook($id: String){
        book(id: $id) {
            id
            name
            genre
            author {
                id
                name
                age
                books {
                    name
                    id
                }
            }
        }
    }
`;

const getMusicianQuery = gql`
    musician(_id: $id) {
        _id
        firstName
        lasName
        dob
        instruments
    }
`;


export { getAlbumsQuery, getBandsQuery, getMusiciansQuery, getMusicianQuery};
