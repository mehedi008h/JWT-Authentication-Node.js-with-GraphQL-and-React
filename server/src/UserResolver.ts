import {
    Resolver,
    Query,
    Arg,
    Mutation,
    ObjectType,
    Field,
    Ctx,
    UseMiddleware,
    Int,
} from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
import { isAuth } from "./isAuth";
import { AppDataSource } from "./data-source";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "hi";
    }

    @Query(() => String)
    @UseMiddleware(isAuth)
    bye(@Ctx() { payload }: MyContext) {
        console.log(payload);
        return `Your user id is: ${payload!.userId}`;
    }

    // all user
    @Query(() => [User])
    users() {
        return User.find();
    }

    // revokeRefreshToken
    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
        await AppDataSource.getRepository(User).increment(
            { id: userId },
            "tokenVersion",
            1
        );

        return true;
    }

    // login
    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Could not find user");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            throw new Error("Bad password");
        }

        // login successful
        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user),
        };
    }

    // register
    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 12);

        try {
            await User.insert({
                email,
                password: hashedPassword,
            });
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
}
