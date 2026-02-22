import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Authentication from "./components/Auth/auth"
import Home from "./pages/home/home"
import Certificates from "./components/certificates/certificates"
import AppLayout from "./pages/global-layout"
import MyProjects from "./components/cards/generals-components/myprojects"



export default function AppRoutes() {

    return (
        <Router>
            <Routes>

                {/* ROTAS COM MENU */}
                <Route element={<AppLayout/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/my-projects" element={<MyProjects/>} />
                    <Route path="/certificates" element={<Certificates />} />
                </Route>

                {/* ROTAS SEM MENU */}
                <Route path="/sign-in" element={<Authentication />} />

            </Routes>
        </Router>
    )
}