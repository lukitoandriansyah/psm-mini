import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route, Navigate, HashRouter} from "react-router-dom";

import App from "./App";
import UserList from "./pages/user/UserList.jsx";
import DetailsProfile from "./pages/user/DetailsProfile.jsx";
import ChangeProfile from "./pages/user/ChangeProfile.jsx";
import Home from "./pages/Home.jsx";
import RoleList from "./pages/role/RoleList.jsx";
import ChangeRole from "./pages/role/ChangeRole.jsx";
import AddRole from "./pages/role/AddRole.jsx";
import RegisterForm from "./pages/auth/RegisterForm.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import UserDashboard from "./pages/dashbord/UserDashbord.jsx";
import BookList from "./pages/book/BookList.jsx";
import AdminDashboard from "./pages/dashbord/AdminDashboard.jsx";
import EndPage from "./pages/EndPage.jsx";
import AuthorList from "./pages/Author/AuthorList";
import AuthorForm from "./pages/Author/AuthorForm";
import PublisherList from "./pages/Publisher/PublisherList";
import PublisherForm from "./pages/Publisher/PublisherForm";
import DetailProfileUserBooks from "./pages/user/DetailProfileUserBooks";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
            <HashRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<Navigate to={"/home"} replace/>}/>

                        <Route path={"/home"} element={<Home/>}/>

                        <Route path={"register"} element={<RegisterForm/>}/>
                        <Route path={"login"} element={<LoginForm/>}/>

                        <Route path={"/end"} element={<EndPage/>}/>

                        <Route element={<App/>}>
                            <Route path="users" element={<UserList/>}/>
                            <Route path={"users/:username"} element={<DetailsProfile/>}/>
                            <Route path={"users/:username/list-book"} element={<DetailProfileUserBooks/>}/>
                            <Route
                                path={"users/:username/:userId"}
                                element={<ChangeProfile/>}
                            />

                            <Route path={"roles"} element={<RoleList/>}/>
                            <Route path={"roles/:roleId"} element={<ChangeRole/>}/>
                            <Route path={"roles/add"} element={<AddRole/>}/>

                            <Route path={"/user/dashboard"} element={<UserDashboard/>}/>

                            <Route path={"/book/list"} element={<BookList/>}/>

                            <Route path={"/admin/dashboard"} element={<AdminDashboard/>}/>

                            <Route path="author" element={<AuthorList/>}/>
                            <Route path="author/form" element={<AuthorForm/>}/>
                            <Route path="author/form/:authorId" element={<AuthorForm/>}/>

                            <Route path="publisher" element={<PublisherList/>}/>
                            <Route path="publisher/form" element={<PublisherForm/>}/>
                            <Route
                                path="publisher/form/:publisherId"
                                element={<PublisherForm/>}
                            />
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
    </React.StrictMode>
);
