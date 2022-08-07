import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="flex nav w-full fixed font-poppins">
            <div className="w-3/4 mx-auto h-16 flex justify-between items-center">
                <div className="text-white">
                    <Link to={"/"} className="text-lg">
                        Home
                    </Link>
                </div>
                <div className="text-white">
                    <Link to={"/login"}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
