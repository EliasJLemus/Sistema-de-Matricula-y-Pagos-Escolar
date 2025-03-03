import React from "react";
import {Route, Routes} from "react-router-dom";
import { LoginPage } from "./pages/login";

export const AppRouter: React.FC<{}> = () => {
    return (
        <Routes>
            <Route path="/login"
            element={<LoginPage/>}>
            </Route>
        </Routes>
    )
}