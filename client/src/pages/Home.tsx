import React from "react";
import { useHelloQuery } from "../generated/graphql";

const Home = () => {
    const { data, loading } = useHelloQuery();
    if (loading) return <div>Loading..</div>;
    return (
        <div className="bg min-h-screen flex">
            <h1>{JSON.stringify(data?.hello)}</h1>
        </div>
    );
};

export default Home;
