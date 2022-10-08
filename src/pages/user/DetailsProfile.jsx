import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

let firstName;
let userArr = [];
let midName;
let additionalName;
export default function DetailsProfile() {
    const [user, setUser] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const params = useParams()
    let a = "*******"
    let isPassDueDate = false

    async function getUsers() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/" + params.username,
            {method: "GET"})
        const data = await res.json();
        const userArrLocal = data.data.name.split(" ")
        for (let x = 0; x < userArrLocal.length; x++) {
            x > 1 ?
                userArr[x] = userArrLocal[x].substring(0, 1)
                :
                userArr[x] = userArrLocal[x];
        }

        firstName = userArr[0]
        userArrLocal.length > 1 ? midName = userArr[1] : midName = ""
        let triggerArr = []
        for (let x = 0; x < userArrLocal.length; x++) {
            let processNameFront = firstName + " " + midName
            let trigger = data.data.name.replace(processNameFront, "")
            if (x > 1) {
                trigger = trigger.replace(userArrLocal[x], userArr[x])
                trigger.search(userArr[x]) !== -1 ?
                    triggerArr.push(userArr[x])
                    :
                    " "
            } else {
                trigger = trigger
            }
            additionalName = [...triggerArr]
        }
        setUser(data.data);
    }

    async function getUserBooks() {
        const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook",
            {method: "GET"})
        const data = await res.json();
        setUserBooks(data);
    }

    function getUserBooksById() {
        let totalBooks = 0;
        let dueDates;
        let returnDates;
        for (let i = 0; i < userBooks.length; i++) {
            dueDates = new Date(userBooks[i].dueDate)
            returnDates = new Date(userBooks[i].returnDate)
            if(userBooks[i].userName === params.username ){
                if(userBooks[i].returnDate === null){
                    totalBooks = totalBooks + 1
                    if(dueDates.getDate() - new Date().getDate() < 0){
                        isPassDueDate = true
                    }else {
                        isPassDueDate = false
                    }
                }
            }
        }
        return totalBooks
    }

    function getUserData() {
        const savedDataUser = localStorage.getItem("user")
        if (savedDataUser) {
            const parsedData = JSON.parse(savedDataUser)
            return parsedData
        } else {
            return {}
        }
    }


    function handlingButton() {
        alert("You don't have access to see this account password")
    }

    function back(event) {
        event.preventDefault()
        history.go(-1)
    }

    useEffect(() => {
        getUsers()
    }, [])
    useEffect(() => {
        getUserBooks()
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>
                <h6 className="m-0 font-weight-bold text-primary">
                    {
                        getUserData().username === user.username ?
                            "Your Profile"
                            :
                            "Profile"
                    }
                </h6>
                <Link to={"/users/" + params.username + "/" + user.id}>
                    <button className="btn btn-primary">
                        Change Profile
                    </button>
                </Link>
            </div>
            <div className="card-body text-center">
                <div className="container profile-page-profile-detail">
                    <div className="row">
                        <div className="col-xl-6 col-lg-7 col-md-12">
                            <div className="card-profile-detail profile-header-profile-detail">
                                <div className="body-profile-detail">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="profile-image-profile-detail float-md-right"><img
                                                src="https://icons.veryicon.com/png/o/miscellaneous/two-color-webpage-small-icon/user-244.png"
                                                alt=""/></div>
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-12">
                                            <h4 className="m-t-0 m-b-0" key={user.id}>
                                                {
                                                    userArr.length===1?
                                                        <strong>
                                                            {firstName}
                                                        </strong>
                                                        :
                                                        userArr.length>1?
                                                            <>
                                                                <strong>
                                                                    {firstName}
                                                                </strong>
                                                                &nbsp;
                                                                {midName}
                                                                &nbsp;
                                                                {additionalName}
                                                            </>
                                                            : ""
                                                }
                                            </h4>
                                            <h5>{"( ID : " + user.id + " )"}</h5>
                                            <span className="job_post">{user.roleName}</span>
                                            <p>PSM Mini Library</p>
                                            <div
                                                className={"card-button-profile card-button-outline-primary-profile"}>
                                                <h5 className={"fa fa-user-circle"}>
                                                    &nbsp;
                                                    {user.username}
                                                </h5>
                                            </div>
                                            <br/>
                                            <div
                                                className={"card-button-profile card-button-outline-primary-profile"}>
                                                <h5 className={"fa fa-key"}>
                                                    &nbsp;
                                                    {
                                                        getUserData().username === user.username ?
                                                            user.password
                                                            :
                                                            getUserData().roleName === "Admin" ?
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={handlingButton}>
                                                                    {a}
                                                                </button>
                                                                :
                                                                user.password
                                                    }
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-7 col-md-12">
                            <div className="card-profile-detail profile-header-profile-detail">
                                <div className="body-profile-detail">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-8 col-12">
                                            <h4 className="m-t-0 m-b-0" key={user.id}>
                                                <strong>
                                                    Total Books
                                                </strong>
                                            </h4>
                                            <h1 className={"big-text"}> {getUserBooksById()}</h1>
                                            <div
                                                className={"card-button-profile card-button-outline-primary-profile"}>
                                                <h6 className={"fa"}>
                                                    &nbsp;
                                                    You're Borrowed
                                                </h6>
                                            </div>
                                            <div
                                                className={"card-button-profile card-button-outline-primary-profile"}>
                                                <h5>
                                                    <Link to={"/users/" + params.username + "/list-book"}>
                                                        <button
                                                            className="btn btn-outline-success"
                                                        >
                                                            Detail
                                                        </button>
                                                    </Link>
                                                </h5>
                                            </div>
                                            <div className={"footer-card-profile-detail footer-body-profile-detail"}>
                                                <h5 className={"text-center"}>
                                                    {
                                                        isPassDueDate === true ?
                                                            <>
                                                                <div className="btn-danger">
                                                                    <p>Due Date Passed.</p>
                                                                </div>
                                                                <div className={"btn-outline-danger"}>
                                                                    <strong>Back Your Book!!!</strong>
                                                                </div>
                                                            </>
                                                            :
                                                            getUserBooksById() > 0 ?
                                                                <>
                                                                    <br/>
                                                                    <h4 className="btn-success fa">
                                                                        Happy Read !!!
                                                                    </h4>
                                                                </>
                                                                :
                                                                <>
                                                                    <br/>
                                                                    <h4 className="btn-primary fa">
                                                                        Let's Borrow !!!
                                                                    </h4>
                                                                </>
                                                    }
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-12">

                                            <div className="profile-image-profile-detail float-md-right">
                                                {getUserBooksById() === 0 ?

                                                    <img
                                                        src="https://cdn0.iconfinder.com/data/icons/ban-sign/512/sign-48-512.png"
                                                        alt=""/>

                                                    :
                                                    getUserBooksById() === 1 ?
                                                        <img
                                                            src="https://cdn.onlinewebfonts.com/svg/img_18895.png"
                                                            alt=""/>

                                                        :

                                                        <img
                                                            src="https://th.bing.com/th/id/R.1dc6fabd97bf37ca4f4205435b2ddd2c?rik=x0wO3MEiFLC5dw&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fbook-transparent-png%2fbook-transparent-png-22.png&ehk=1Up0crZ35gdC4AmIR6jIp9coG2VdoOTVzhQA84BpkSQ%3d&risl=&pid=ImgRaw&r=0"
                                                            alt=""/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}