import { AppDataSource } from "./data-source";
import "dotenv/config";
import "reflect-metadata";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { sendRefreshToken } from "./sendRefreshToken";
import { createAccessToken, createRefreshToken } from "./auth";
const express = require("express");
const cookieParser = require("cookie-parser");
const { ApolloServer } = require("apollo-server-express");
const { buildSchema } = require("type-graphql");
const { UserResolver } = require("./UserResolver");

(async () => {
    const app = express();
    app.use(cookieParser());

    app.get("/", (req, res) => res.send("Hello"));

    app.post("/refresh_token", async (req, res) => {
        const token = req.cookies.jid;
        if (!token) {
            return res.send({ ok: false, accessToken: "" });
        }

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (err) {
            console.log(err);
            return res.send({ ok: false, accessToken: "" });
        }

        console.log(payload);

        // token is valid and
        // we can send back an access token
        const user = await User.findOneBy({ id: payload.userId });

        if (!user) {
            return res.send({ ok: false, accessToken: "" });
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: "" });
        }

        sendRefreshToken(res, createRefreshToken(user));

        return res.send({ ok: true, accessToken: createAccessToken(user) });
    });

    AppDataSource.initialize();

    const schema = await buildSchema({
        resolvers: [UserResolver],
    });

    const apploServer = new ApolloServer({
        schema,
        playground: true,
        context: ({ req, res }) => ({ req, res }),
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
