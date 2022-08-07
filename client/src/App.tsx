import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Buy from "./pages/Buy";
import { useEffect, useState } from "react";
import { setAccessToken } from "./accessToken";

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:4000/refresh_token", {
            method: "POST",
            credentials: "include",
        }).then(async (x) => {
            const { accessToken } = await x.json();
            console.log(accessToken);

            setAccessToken(accessToken);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>loading...</div>;
    }
    return (
        <div className="">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    {!loading && <Route path="/buy" element={<Buy />} />}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
