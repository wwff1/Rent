import React from "react"
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from "./pages/AuthPage";
import MarkPage from "./pages/MarkPage";
import ModelPage from "./pages/ModelPage";
import ClassPage from "./pages/ClassPage";
import TypePage from "./pages/TypePage";
import ParkPage from "./pages/ParkPage";
import ClientPage from "./pages/ClientPage";
import AutoPage from "./pages/AutoPage";
import AccidentPage from "./pages/AccidentPage";
import OrderPage from "./pages/OrderPage";

export const useRoutes = isAuthenticated => {
    const storageName = 'userData'
    const data1 = localStorage.getItem(storageName)
    const data2 = JSON.parse(localStorage.getItem(storageName))
    if(data1 !== null)
    {
        if (data2.token || isAuthenticated) {
            return(
                <Switch>
                    <Route path="/modelPage" exact>
                        <ModelPage />
                    </Route>
                    <Route path="/markPage" exact>
                        <MarkPage />
                    </Route>
                    <Route path="/clientPage" exact>
                        <ClientPage />
                    </Route>
                    <Route path="/classPage" exact>
                        <ClassPage />
                    </Route>
                    <Route path="/typePage" exact>
                        <TypePage />
                    </Route>
                    <Route path="/autoPage" exact>
                        <AutoPage />
                    </Route>
                    <Route path="/parkPage" exact>
                        <ParkPage />
                    </Route>
                    <Route path="/accidentPage" exact>
                        <AccidentPage />
                    </Route>
                    <Route path="/orderPage" exact>
                        <OrderPage />
                    </Route>
                    <Redirect to="/orderPage" />
                </Switch>
            )
        }
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}