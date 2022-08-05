import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { User } from "./entity/User";
import { hash, compare } from "bcryptjs";

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "hi";
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

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