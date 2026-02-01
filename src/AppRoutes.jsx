import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Authentication from "./components/Auth/auth"
import Home from "./pages/home/home"
import Certificates from "./components/cards/certificates"
import AppLayout from "./pages/global-layout"
import Projects from "./components/cards/projects"



export default function AppRoutes() {

    return (
        <Router>
            <Routes>

                {/* ROTAS COM MENU */}
                <Route element={<AppLayout/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects/>} />
                    <Route path="/certificates" element={<Certificates />} />
                </Route>

                {/* ROTAS SEM MENU */}
                <Route path="/sign-in" element={<Authentication />} />

            </Routes>
        </Router>
    )
}