import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Header = () => {
    const { data, loading } = useMeQuery();
    const [logout, { client }] = useLogoutMutation();

    console.log(data);

    return (
        <div className="flex nav w-full fixed font-poppins">
            <div className="w-3/4 mx-auto h-16 flex justify-between items-center">
                <div className="text-white">
                    <Link to={"/"} className="text-lg">
                        Home
                    </Link>
                </div>
                <div className="text-white">
                    {!loading && data && data.me ? (
                        <button
                            onClick={async () => {
                                await logout();
                                setAccessToken("");
                                await client!.resetStore();
                            }}
                        >
                            logout
                        </button>
                    ) : (
                        <>
                            <Link to={"/login"}>Login</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
