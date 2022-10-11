import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

export default function BookForm() {
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true)

    const isEditting = params.bookId;

    const [authors, setAuthors] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [formInput, setFormInput] = useState({
        bookTitle: "",
        bookYear: "",
        bookStatus: "",
        publisherId:"",
        authorId:"",
        categoryId:""
    });

    function handleInput(event, inputName) {
        const copyFormInput = { ...formInput }
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function getAuthors() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/author/all"
        );
        setAuthors(res.data);
    }

    async function getCategorys() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/category/list"
        );
        setCategorys(res.data);
    }

    async function getPublishers() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/publisher/list"
        );
        setPublishers(res.data);
    }

    async function getFormInput() {
        const res = await axios.get(
            "https://be-psm-mini-library-system.herokuapp.com/book/" +
            params.bookId
        );
        setFormInput(res.data.data);
    }

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            return JSON.parse(savedDataUser)
        } else {
            return {}
        }
    }

    async function getUsersById() {
        try {

            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/byid/"+getUserData().userId,
                {method: "GET"})
            const data = await res.json();
            setStatusUserById(data.status)
            setDataUserById(data.data)
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }
    }

    function saveDataTrue(dataUser, statusUser) {
        const formattedDataUserUpdated = JSON.stringify(dataUser)
        const formattedStatusUserUpdated = JSON.stringify(statusUser)

        localStorage.removeItem("user")
        localStorage.removeItem("statusLogin")

        localStorage.setItem("user", formattedDataUserUpdated)
        localStorage.setItem("statusLogin", formattedStatusUserUpdated)

        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)

    }

    function saveDataFalse(dataUser, statusUser) {
        setUserUpdated(dataUser)
        setStatusUpdated(statusUser)
    }

    async function userDeleteScenario(){
        if(statusUserById === true){
            /*console.log("ya data masuk")*/
            const payload = JSON.stringify({
                username: dataUserById.username,
                password: dataUserById.password
            })
            const targetUrl = "https://be-psm-mini-library-system.herokuapp.com/auth/login"
            const method = "POST"
            const res = await fetch(targetUrl, {
                method: method,
                body: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((re) => re.json())

            const respData = res.data
            const respStatus = res.status

            respStatus === true ? saveDataTrue(respData, respStatus)  : saveDataFalse(respData, respStatus)
        }else{
            localStorage.clear()
            navigate("/home")
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        userDeleteScenario()
        if (isEditting) {
            await axios.put(
                "https://be-psm-mini-library-system.herokuapp.com/book/update/" + params.bookId,
                formInput
            );
        } else {
            await axios.post(
                "https://be-psm-mini-library-system.herokuapp.com/book/add-book",
                {
                    bookTitle: formInput.bookTitle,
                    bookYear: parseInt(formInput.bookYear),
                    bookStatus: Boolean(true),
                    publisherId:parseInt(formInput.publisherId),
                    authorId:parseInt(formInput.authorId),
                    categoryId:parseInt(formInput.categoryId)
                }
            );
        }
        navigate("/book/list");
    }

    useEffect(() => {
        getCategorys()
        getAuthors()
        getPublishers()
        getUsersById()
        if (isEditting) {
            getFormInput()
        }
    }, []);

    return <>

        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Add Book Form</h6>
                <Link to="/book/list">
                    <button onClick={()=>userDeleteScenario()} className="btn btn-secondary">Back</button>
                </Link>
            </div>

            <div>
                <div className="card-body">
                    <form onSubmit={(event) => handleSubmit(event)}>

                        <div className="mb-3">
                            <label className="form-label">Book Title</label>
                            <input
                                className="form-control"
                                type="text"
                                value={formInput.bookTitle}
                                onChange={(event) => handleInput(event, "bookTitle")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Book's Category</label>
                            <select
                                className="form-control"
                                value={formInput.categoryId}
                                onChange={(event) => handleInput(event, "categoryId")}
                            >
                                <option value={""} disabled></option>
                                {categorys.map(category =>
                                    <option
                                        value={category.categoryId}>
                                        {category.categoryName}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Book's Author</label>
                            <select
                                className="form-control"
                                value={formInput.authorId}
                                onChange={(event) => handleInput(event, "authorId")}
                            >
                                <option value={""} disabled></option>
                                {authors.map(author =>
                                    <option value={author.authorId}>
                                        {author.authorName}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Book's Publisher</label>
                            <select
                                className="form-control"
                                value={formInput.publisherId}
                                onChange={(event) => handleInput(event, "publisherId")}
                            >
                                <option value={""} disabled></option>
                                {publishers.map(publisher =>
                                    <option value={publisher.idPublisher}>
                                        {publisher.publisherName}
                                    </option>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Relese Date</label>
                            <input
                                className="form-control"
                                type="number"
                                value={formInput.bookYear}
                                onChange={(event) => handleInput(event, "bookYear")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Book Status</label>
                            <br />
                            <select value={formInput.bookStatus} onChange={(event) => handleInput(event, "bookStatus")} disabled>
                                <option value={""} disabled></option>
                                <option value={"true"}>Available</option>
                                <option value={"false"}>Not Available</option>
                            </select>
                            <br />
                        </div>

                        <div>
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </>
}