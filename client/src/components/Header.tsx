import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Header = () => {
    const { data, loading } = useMeQuery();
    const [logout, { client }] = useLogoutMutation();

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
                        <div className="flex flex-row items-center gap-3">
                            <span className="border border-red-700 transition-all font-semibold px-4 py-1 rounded-full">
                                {data.me.name}
                            </span>
                            <button
                                className="bg-red-800 hover:bg-red-700 transition-all font-semibold px-4 py-1 rounded-full"
                                onClick={async () => {
                                    await logout();
                                    setAccessToken("");
                                    await client!.resetStore();
                                }}
                            >
                                Logout
                            </button>
                        </div>
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
