import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SiAuth0 } from "react-icons/si";
import { AiOutlineMenu } from "react-icons/ai";

import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Header = () => {
    const [open, setOpen] = useState(false);
    const { data, loading } = useMeQuery();
    const [logout, { client }] = useLogoutMutation();

    return (
        <div className="flex nav w-full fixed font-poppins">
            <div className="w-3/4 mx-auto h-16 flex justify-between items-center">
                <div className="text-white">
                    <Link to={"/"} className="text-lg">
                        <SiAuth0 size={25} />
                    </Link>
                </div>
                <div className="text-white xl:flex lg:flex md:flex hidden">
                    {!loading && data && data.me ? (
                        <div className="flex flex-row items-center gap-3">
                            <Link
                                to={"/me"}
                                className="border-2 border-red-700 hover:border-red-600 transition-all font-semibold px-4 py-1 rounded-full"
                            >
                                {data.me.name}
                            </Link>
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
                            <Link
                                className="bg-red-800 hover:bg-red-700 transition-all font-semibold px-4 py-1 rounded-full"
                                to={"/login"}
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
                <div className="xl:hidden lg:hidden md:hidden flex text-white relative">
                    <AiOutlineMenu
                        size={20}
                        onClick={() => setOpen(open ? false : true)}
                    />
                    {open && (
                        <div className="bg-black absolute top-11 right-2 z-30 px-4 py-2 rounded-md">
                            {!loading && data && data.me ? (
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <Link
                                        to={"/me"}
                                        className="border-2 border-red-700 hover:border-red-600 transition-all font-semibold px-4 py-1 rounded-full"
                                    >
                                        {data.me.name}
                                    </Link>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
