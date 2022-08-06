import "./App.css";
import { useHelloQuery } from "./generated/graphql";

function App() {
    const { data, loading } = useHelloQuery();
    if (loading) return <div>Loading..</div>;
    return (
        <div className="App">
            <h1>{JSON.stringify(data?.hello)}</h1>
        </div>
    );
}

export default App;
