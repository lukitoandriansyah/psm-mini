import React from "react";
import ReactDOM from "react-dom/client";
import {Routes, Route, Navigate, HashRouter} from "react-router-dom";

import App from "./App";
import UserList from "./pages/user/UserList.jsx";
import DetailsProfile from "./pages/user/DetailsProfile.jsx";
import ChangeProfile from "./pages/user/ChangeProfile.jsx";
import Home from "./pages/Home.jsx";
import RoleList from "./pages/role/RoleList.jsx";
import ChangeRole from "./pages/role/ChangeRole.jsx";
import AddRole from "./pages/role/AddRole.jsx";
import RegisterForm from "./pages/auth/RegisterForm.jsx";
import UserDashboard from "./pages/dashbord/UserDashbord.jsx";
import BookList2 from "./pages/book/BookList2.jsx";
import BookForm from "./pages/book/BookForm.jsx";
import UserBookList from "./pages/userbook/UserbookList.jsx";
import UserBookForm from "./pages/userbook/UserbookForm.jsx";
import AdminDashboard from "./pages/dashbord/AdminDashboard.jsx";
import EndPage from "./pages/EndPage.jsx";
import AuthorList from "./pages/Author/AuthorList";
import AuthorForm from "./pages/Author/AuthorForm";
import PublisherList from "./pages/Publisher/PublisherList";
import PublisherForm from "./pages/Publisher/PublisherForm";
import DetailProfileUserBooks from "./pages/user/DetailProfileUserBooks";
import CategoryList from "./pages/category/CategoryList.jsx";
import CategoryForm from "./pages/category/CategoryForm.jsx";
import ProtectedRouteForAdmin from "./pages/protected-routes/ProtectedRouteForAdmin.jsx";
import LoginForm from "./pages/auth/LoginForm.jsx";
import ProtectedRouteLogin from "./pages/protected-routes/ProtectedRouteLogin.jsx";
import ProtectedRouteForNonAdmin from "./pages/protected-routes/ProtectedRouteForNonAdmin";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Navigate to={"/home"} replace/>}/>
                    <Route path={"/home"} element={<Home/>}/>
                    <Route path={"/register"} element={<RegisterForm/>}/>
                    <Route path={"/login"} element={<LoginForm/>}/>
                    <Route path={"/end"} element={<EndPage/>}/>
                    <Route path={""} element={<App/>}>
                        <Route element={<ProtectedRouteLogin/>}>
                            <Route path={"users/:username"} element={<ProtectedRouteForNonAdmin/>}>
                                <Route index element={<DetailsProfile/>}/>
                                <Route path={"list-book"} element={<DetailProfileUserBooks/>}/>
                                <Route path={":userId"} element={<ChangeProfile/>}/>
                            </Route>
                            <Route path={"/user/dashboard"} element={<UserDashboard/>}/>
                            <Route path={"/admin/dashboard"} element={<AdminDashboard/>}/>
                            <Route path={"/book/list"} element={<BookList2/>}/>

                            <Route element={<ProtectedRouteForAdmin/>}>
                                <Route path="users" element={<UserList/>}/>


                                <Route path={"roles"} element={<RoleList/>}/>
                                <Route path={"roles/:roleId"} element={<ChangeRole/>}/>
                                <Route path={"roles/add"} element={<AddRole/>}/>

                                <Route path={"/user/dashboard"} element={<UserDashboard/>}/>
                                <Route path="/book/form" element={<BookForm/>}/>
                                <Route path="/book/form/:bookId" element={<BookForm/>}/>

                                <Route path="/userbook/form" element={<UserBookForm/>}/>
                                <Route path="/userbook/form/:userbookId" element={<UserBookForm/>}/>
                                <Route path={"/userbook/list"} element={<UserBookList/>}/>

                                <Route path="author" element={<AuthorList/>}/>
                                <Route path="author/form" element={<AuthorForm/>}/>
                                <Route path="author/form/:authorId" element={<AuthorForm/>}/>

                                <Route path="publisher" element={<PublisherList/>}/>
                                <Route path="publisher/form" element={<PublisherForm/>}/>
                                <Route path="publisher/form/:idPublisher" element={<PublisherForm/>}/>

                                <Route path="category/list" element={<CategoryList/>}/>
                                <Route path="category/form" element={<CategoryForm/>}/>
                                <Route path="category/form/:categoryId" element={<CategoryForm/>}/>
                            </Route>

                        </Route>
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    </React.StrictMode>
);
