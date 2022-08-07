import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    ApolloLink,
    Observable,
    HttpLink,
} from "@apollo/client";
import { getAccessToken, setAccessToken } from "./accessToken";
import jwtDecode from "jwt-decode";
import { TokenRefreshLink } from "apollo-link-token-refresh";

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable((observer) => {
            let handle: any;
            Promise.resolve(operation)
                .then((operation) => {
                    const accessToken = getAccessToken();
                    if (accessToken) {
                        operation.setContext({
                            headers: {
                                authorization: `bearer ${accessToken}`,
                            },
                        });
                    }
                })
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    });
                })
                .catch(observer.error.bind(observer));

            return () => {
                if (handle) handle.unsubscribe();
            };
        })
);

const client = new ApolloClient({
    link: ApolloLink.from([
        new TokenRefreshLink({
            accessTokenField: "accessToken",
            isTokenValidOrUndefined: () => {
                const token = getAccessToken();

                if (!token) {
                    return true;
                }

                try {
                    let decoded: any = jwtDecode(token);
                    if (Date.now() >= decoded * 1000) {
                        return false;
                    } else {
                        return true;
                    }
                } catch {
                    return false;
                }
            },
            fetchAccessToken: () => {
                return fetch("http://localhost:4000/refresh_token", {
                    method: "POST",
                    credentials: "include",
                });
            },
            handleFetch: (accessToken) => {
                setAccessToken(accessToken);
            },
            handleError: (err) => {
                console.warn("Your refresh token is invalid. Try to relogin");
                console.error(err);
            },
        }),

        requestLink,
        new HttpLink({
            uri: "http://localhost:4000/graphql",
            credentials: "include",
        }),
    ]),
    cache,
});

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);

reportWebVitals();
