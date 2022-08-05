import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import "reflect-metadata";
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { buildSchema } = require("type-graphql");
const { UserResolver } = require("./UserResolver");

(async () => {
    const app = express();
    app.get("/", (req, res) => res.send("Hello"));

    AppDataSource.initialize();

    const schema = await buildSchema({
        resolvers: [UserResolver],
    });

    const apploServer = new ApolloServer({
        schema,
        playground: true,
    });
    await apploServer.start();
    apploServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log("Express Server running");
    });
})();

// AppDataSource.initialize()
//     .then(async () => {
//         console.log("Connecting database...");
//     })
//     .catch((error) => console.log(error));
