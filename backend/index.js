const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const jwt = require('jsonwebtoken')

require('dotenv').config()
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book{
    title:String!,
    published: String!,
    author: Author,
    id: ID!,
    genres: [String!]!
  }
  type Author{
    name: String!,
    born:Int,
    bookCount:Int,
  }
  type User {
    username: String!
    friends: [Book!]!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount:Int!
    authorCount:Int!
    allBooks:[Book!]!
    allAuthors:[Author!]!
    me:User
  }
  type Mutation {
    addBook(
        title: String!
        author: String!
        published: String!
        genres: [String!]!
    ): Book!
    editAuthor(
        name:String!,
        born:String!
    ): Author
    createUser(
    username: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async ()=>Book.collection.countDocuments(),
    authorCount: async ()=>Author.collection.countDocuments() ,
    allBooks:async ()=>{
      return Book.find({})
    },
    allAuthors:async ()=>{
      return Author.find({})
    }
  },
  Book: {
    author: async (parent) => {
      return await Author.findOne({ name: parent.author })  // map string -> Author object
    }
  },
  Author: {
  bookCount: async (parent) => {
    return Book.collection.countDocuments({ author: parent.name})
  }
},

  Mutation:{
    addBook: async (root, args) => {
      const book = new Book({...args,author:args.author.name})
      try{
        await book.save()
      }catch(error){
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return book
    },
    editAuthor: async (root,args)=>{
      const author = await Author.find({name:args.name}) 
      author.born=args.born
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
  },
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if ( !user || args.password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })        
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },

  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})