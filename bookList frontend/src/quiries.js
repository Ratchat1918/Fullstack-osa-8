import { gql } from "@apollo/client"

export const ALL_AUTHORS=gql`
        query{
            allAuthors {
                name
                born
                bookCount
                }
            }`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
      id
      genres
      }
  }
`
export const NEW_BOOK = gql`
  mutation createBook($title: String!, $published: String!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author
      id
      genres
    }
  }
`
export const EDIT_YEAR=gql`
  mutation EditAuthor($name: String!, $born: String!){
    editAuthor(
      name:$name,
      born:$born
    ){
      name
      }
  }
`