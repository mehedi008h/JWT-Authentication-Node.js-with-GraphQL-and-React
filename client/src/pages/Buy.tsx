import React from "react";
import { useByeQuery } from "../generated/graphql";

const Buy = () => {
    const { data, loading, error } = useByeQuery();

    if (loading) {
        return <div>loading...</div>;
    }

    if (error) {
        console.log(error);
        return <div>err</div>;
    }

    if (!data) {
        return <div>no data</div>;
    }

    return (
        <div className="flex">
            <h1 className="mt-20">{data.bye}</h1>
        </div>
    );
};

export default Buy;
