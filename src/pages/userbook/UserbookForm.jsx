import axios from "axios";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Url} from "../../partials/url-BE/Url.jsx";

export default function UserBookForm() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true)
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])

    const isEditting = params.userbookId;

    const [bookById, setBookById] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [userBooks, setUserBooks] = useState([]);
    const [userBookDetail, setUserBookDetail] = useState([]);
    const [formInput, setFormInput] = useState({
        bookId: "",
        userId: "",
        startDate: "",
        dueDate: "",
        returnDate: ""
    })

    function handleInput(event, propName) {
        const copyFormInput = {...formInput};
        copyFormInput[propName] = event.target.value;

        setFormInput(copyFormInput)
    }

    async function getBooks() {
        const res = await axios.get(
            Url+"/book/books"
        );
        setBooks(res.data);
    }

    async function getUsers() {
        const res = await axios.get(
            Url+"/users/list-user"
        );
        setUsers(res.data);
    }

    async function getUserBooks() {
        const res = await fetch(Url+"/userbook/list-userbook",
            {method: "GET"})
        const data = await res.json();
        setUserBooks(data);
    }

    async function getUserBookDetail() {
        const res = await fetch(Url+"/userbook/" + params.userbookId,
            {method: "GET"})
        const data = await res.json();
        setUserBookDetail(data);
    }

    function userWhoCanBorrow() {
        let arr = []
        for (let x = 0; x < users.length; x++) {
            for (let y = 0; y < userBooks.length; y++) {
                if (users[x].username == userBooks[y].userName) {
                    if (userBooks[y].returnDate == null) {
                        arr.push(userBooks[y].userName)
                    }
                }
            }
        }
        return arr
    }

    localStorage.setItem("usname", userWhoCanBorrow())
    let dataUsBook = localStorage.getItem("usname").split(",")

    function usBookCounter() {
        let counter = 0
        let arrB=[]
        for (let x = 0; x < users.length; x++) {
            for (let y = 0; y< dataUsBook.length; y++){
                if(dataUsBook[y]===users[x].username){
                    counter = counter+1
                    if(counter>=3){
                        arrB.push(dataUsBook[y])
                        counter = 0
                    }
                }
            }
        }
        return arrB
    }
    let setArrB = new Set(usBookCounter())

    async function getFormInput() {
        const res = await axios.get(
            Url+"/userbook/" +
            params.userbookId
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

            const res = await fetch(Url+"/users/profile/byid/"+getUserData().userId,
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
            const targetUrl = Url+"/auth/login"
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
            const payloadUpdateUserBook = {
                bookId: formInput.bookId,
                userId: formInput.userId,
                startDate: formInput.startDate.toString(),
                dueDate: formInput.dueDate.toString(),
                returnDate: formInput.returnDate
            }

            const re = await axios.put(
                Url+"/userbook/update-userbook/" +
                params.userbookId,
                payloadUpdateUserBook
            );

            const res = await axios.get(
                Url+"/book/" +
                payloadUpdateUserBook.bookId
            )
            setBookById(res.data.data)

            if(re.data.data.returnDate !== null){
                const payloadUpdateBookStatus = {
                    bookTitle: res.data.data.bookTitle,
                    bookYear: res.data.data.bookYear,
                    bookStatus: true,
                    publisherId:res.data.data.publisherId,
                    authorId:res.data.data.authorId,
                    categoryId:res.data.data.categoryId
                }
                await axios.put(
                    Url+"/book/update/" + payloadUpdateUserBook.bookId,
                    payloadUpdateBookStatus
                );
            }
            else{

                const payloadUpdateBookStatus = {
                    bookTitle: res.data.data.bookTitle,
                    bookYear: res.data.data.bookYear,
                    bookStatus: false,
                    publisherId:res.data.data.publisherId,
                    authorId:res.data.data.authorId,
                    categoryId:res.data.data.categoryId
                }
                await axios.put(
                    Url+"/book/update/" + payloadUpdateUserBook.bookId,
                    payloadUpdateBookStatus
                );
            }

        } else {
            const payload = {
                bookId: formInput.bookId,
                userId: formInput.userId,
                startDate: formInput.startDate.toString(),
                dueDate: formInput.dueDate.toString(),
                returnDate: formInput.returnDate.toString()
            }

            await axios.post(
                Url+"/userbook/add-userbook",
                payload
            );

            const res = await axios.get(
                Url+"/book/" +
                payload.bookId
            )
            setBookById(res.data.data)

            const payloadUpdateBookStatus = {
                bookTitle: res.data.data.bookTitle,
                bookYear: res.data.data.bookYear,
                bookStatus: false,
                publisherId:res.data.data.publisherId,
                authorId:res.data.data.authorId,
                categoryId:res.data.data.categoryId
            }

            await axios.put(
                Url+"/book/update/" + payload.bookId,
                payloadUpdateBookStatus
            );
        }
        navigate("/userbook/list");
    }

    useEffect(() => {
        getBooks()
        getUsers()
        getUserBooks()
        getUserBookDetail()
        getUsersById()
        if (isEditting) {
            getFormInput()
        }
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Userbook Form</h6>
                <Link onClick={()=>userDeleteScenario()} to="/userbook/list">
                    <button className="btn btn-secondary">Back</button>
                </Link>
            </div>

            <div>
                <div className="card-body">
                    <form onSubmit={(event) => handleSubmit(event)}>

                        <div className="mb-3">
                            <label className="form-label">Book Title</label>
                            <select
                                className="form-control"
                                value={formInput.bookId}
                                required
                                onChange={(event) => handleInput(event, "bookId")}
                            >
                                <option value={""} disabled></option>
                                {books.map(book =>
                                    book.bookStatus === true ?
                                        <option
                                            value={book.bookId}>
                                            {book.bookTitle}
                                        </option> : <></>
                                )}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">username</label>
                            <select
                                className="form-control"
                                value={formInput.userId}
                                required
                                onChange={(event) => handleInput(event, "userId")}
                            >
                                {isEditting ?
                                    <>
                                        <option value={""} disabled></option>
                                        {users.map(user =>
                                            <option
                                                value={user.userId}>
                                                {user.username}
                                            </option>
                                        )}
                                    </>
                                    :
                                    <>
                                        <option value={""} disabled></option>
                                        {users.map(user =>
                                            setArrB.has(user.username) ?
                                                <></> :
                                                <option
                                                    value={user.userId}>
                                                    {user.username}
                                                </option>
                                        )}
                                        :
                                        <>
                                        </>
                                    </>

                                }
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Start Date</label>
                            <input
                                className="form-control"
                                type="date"
                                required
                                value={formInput.startDate}
                                onChange={(event) => handleInput(event, "startDate")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Due Date</label>
                            <input
                                className="form-control"
                                type="date"
                                required
                                value={formInput.dueDate}
                                onChange={(event) => handleInput(event, "dueDate")}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Return Date</label>
                            <input
                                className="form-control"
                                type="date"
                                value={formInput.returnDate}
                                onChange={(event) => handleInput(event, "returnDate")}
                            />
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