const { GraphQLServer } = require("graphql-yoga");
// resolvers query resolvers and mutation resolvers
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const db = require("./db");

// creat GraphQL Server
// basically creating two servers

function createServer(){
    return new GraphQLServer({
        typeDefs: "src/schema.graphql",
        resolvers: {
            Mutation,
            Query
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false
        },
        context: req => ({...req, db}),
    })
}

module.exports = createServer;