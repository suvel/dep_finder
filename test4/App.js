import Parent1 from "./Parent1"
import RouteComponent1 from './RouteComponent1'
import RouteComponent2Wrapper from './RouteComponent2Wrapper'
import Route2Index from "./Route2Index";
import Route2SubRoute1 from "./Route2SubRoute1";;
import SecureRoutWrapper from './SecureRoutWrapper'
import RouteSecureIndex from './RouteSecureIndex'
import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

const getSecuredRoutes = () => {
    return (<Route
        element={<SecureRoutWrapper />}
    >
        <Route index element={<RouteSecureIndex />} />
        <Route path="RouteSecure1" element={<RouteSecure1 />} >
            <Route index element={<RouteSecure1subRouteIndex />} />
            <Route path="RouteSecure1subRoute1" element={<RouteSecure1subRoute1 />} />
        </Route>
    </Route>)
}

const App = () => {
    return <>
        <h1>App</h1>
        <Routes>
            <Route path="/" element={<Navigate to="/Dashboard" replace />} />
            <Route
                path="Route1"
                element={<RouteComponent1 />}
            />
            <Route
                path="Route2"
                element={
                    <RouteComponent2Wrapper />
                }
            >
                <Route index element={<Route2Index />} />
                <Route path="Route2SubRoute1" element={<Route2SubRoute1 />} />
            </Route>
            <Route
                path="Route3"
                element={
                    <RouteComponent3Wrapper />
                }
            >
                <Route index element={<Route3Index />} />
                <Route path="Route3SubRoute1" element={<Route3SubRoute1 />} />
            </Route>
            {getSecuredRoutes()}
        </Routes>
        <Parent1 />
    </>
}