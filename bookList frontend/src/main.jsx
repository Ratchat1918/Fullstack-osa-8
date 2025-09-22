import ReactDOM from 'react-dom/client'
import App from './App'
import { ALL_BOOKS } from './quiries'
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

const query = ALL_BOOKS;

/*client.query({ query })
  .then((response) => {
    console.log(response.data)
  })*/


ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)