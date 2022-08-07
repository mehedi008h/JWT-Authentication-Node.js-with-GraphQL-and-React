import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    };
    return (
        <div className="bg min-h-screen flex justify-center items-center">
            <div className="card w-1/3 rounded-md p-4">
                <h1 className="text-center font-roboto text-2xl font-bold">
                    Login
                </h1>
                <div className="mt-8">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email ..."
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full outline-none border px-4 py-2 rounded-full"
                        />
                        <input
                            type="password"
                            placeholder="Enter your password ..."
                            value={password}
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full outline-none border  px-4 py-2 rounded-full"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 py-2 px-4 rounded-full w-2/4 hover:w-3/4 mx-auto transition-all text-white font-semibold tracking-wide"
                        >
                            Login
                        </button>
                    </form>
                    <div className="flex flex-col justify-center items-center gap-2 mt-6">
                        <Link
                            to="/fotgot-password"
                            className="text-blue-600 font-semibold"
                        >
                            Forgot Password
                        </Link>
                        <p className="text-base ">
                            Dont't have a account?{" "}
                            <Link
                                className="text-blue-600 font-semibold"
                                to="/signup"
                            >
                                Signup
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
