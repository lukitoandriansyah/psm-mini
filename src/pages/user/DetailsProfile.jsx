import {useEffect, useState} from "react";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner.jsx";

let firstName;
let userArr = [];
let midName;
let additionalName;
export default function DetailsProfile() {
    const [user, setUser] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const params = useParams()
    const navigate = useNavigate()
    let a = "*******"
    let isPassDueDate = false

    function handlingName(paramName){
        let triggerArr = []
        const userArrLocal = paramName.data.name.split(" ")

        for (let x = 0; x < userArrLocal.length; x++) {
            x > 1 ? userArr[x] = userArrLocal[x].substring(0, 1) : userArr[x] = userArrLocal[x];
        }

        firstName = userArr[0]
        userArrLocal.length > 1 ? midName = userArr[1] : midName = ""

        for (let x = 0; x < userArrLocal.length; x++) {
            let processNameFront = firstName + " " + midName
            let trigger = paramName.data.name.replace(processNameFront, "")
            if (x > 1) {
                trigger = trigger.replace(userArrLocal[x], userArr[x])
                trigger.search(userArr[x]) !== -1 ? triggerArr.push(userArr[x]) : " "
            } else {
                trigger = trigger
            }
            additionalName = [...triggerArr]
        }
    }

    async function getUsers() {
        try {
            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/users/profile/" + params.username,
                {method: "GET"})
            const data = await res.json();
            handlingName(data)
            setUser(data.data);
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
    }

    async function getUserBooks() {
        setIsLoading(true)
        try {
            const res = await fetch("https://be-psm-mini-library-system.herokuapp.com/userbook/list-userbook",
                {method: "GET"})
            const data = await res.json();
            setUserBooks(data);
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
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

    function profileView(){
        return<>
            {
                userArr.length===1? <strong>{firstName}</strong>
                    : userArr.length>1 ? <><strong>{firstName}</strong>&nbsp;{midName}&nbsp;{additionalName}</>
                        : ""
            }
        </>
    }

    function passView(){
        return<>
            {
                getUserData().username === user.username ? user.password
                    :
                    getUserData().roleName === "Admin" ? <button className="btn btn-danger" onClick={handlingButton}>{a}</button>
                        :
                        user.password
            }
        </>
    }

    function remindLoan(){
        return<>
            {
                isPassDueDate === true ? <><div className="btn-danger"><p>Due Date Passed.</p></div><div className={"btn-outline-danger"}><strong>Back Your Book!!!</strong></div></>
                    :
                    getUserBooksById() > 0 ? <><br/><h4 className="btn-success fa">Happy Read !!!</h4></>
                        :
                        <><br/><h4 className="btn-primary fa">Let's Borrow !!!</h4></>
            }
        </>
    }

    function pictureBook(){
        return<>
            {
                getUserBooksById() === 0 ? <img src="https://cdn0.iconfinder.com/data/icons/ban-sign/512/sign-48-512.png" alt=""/>
                    :
                    getUserBooksById() === 1 ? <img src="https://cdn.onlinewebfonts.com/svg/img_18895.png" alt=""/>
                        :
                        <img src="https://th.bing.com/th/id/R.1dc6fabd97bf37ca4f4205435b2ddd2c?rik=x0wO3MEiFLC5dw&riu=http%3a%2f%2fclipart-library.com%2fimages_k%2fbook-transparent-png%2fbook-transparent-png-22.png&ehk=1Up0crZ35gdC4AmIR6jIp9coG2VdoOTVzhQA84BpkSQ%3d&risl=&pid=ImgRaw&r=0" alt=""/>
            }
        </>
    }

    function handlingButton() {
        userDeleteScenario()
        alert("You don't have access to see this account password")
    }

    function backLastStep(event) {
        event.preventDefault()
        userDeleteScenario()
        history.go(-1)
        /*if(getUserData().username===user.username){
            history.go(-1)
        }else {
            <Navigate to={"/users"}/>
        }*/
    }

    useEffect(() => {
        getUsers()
        getUserBooks()
        getUsersById()
    }, [])

    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">

                {
                    getUserData().username === params.username?
                        <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                             onClick={(event) => backLastStep(event)}>
                            &nbsp;
                            Back
                        </div>
                        :
                        <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                             onClick={()=> {
                                 userDeleteScenario()
                                 navigate("/users")
                             }}>
                            &nbsp;
                            Back
                        </div>

                }

                <h6 className="m-0 font-weight-bold text-primary">
                    {getUserData().username === user.username ? "Your Profile" : "Profile"}
                </h6>
                <Link onClick={()=>userDeleteScenario()} to={"/users/" + params.username + "/" + user.id}>
                    <button className="btn btn-primary">
                        Change Profile
                    </button>
                </Link>
            </div>
            <div className="card-body text-center">
                {isLoading?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                    :
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
                                                    {profileView()}
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
                                                        {passView()}
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
                                                        You're Borrowed
                                                    </h6>
                                                </div>
                                                <div
                                                    className={"card-button-profile card-button-outline-primary-profile"}>
                                                    <h5>
                                                        <Link onClick={()=>userDeleteScenario()} to={"/users/" + params.username + "/list-book"}>
                                                            <button className="btn btn-outline-success">
                                                                Detail
                                                            </button>
                                                        </Link>
                                                    </h5>
                                                </div>
                                                <div className={"footer-card-profile-detail footer-body-profile-detail"}>
                                                    <div className={"text-center"}>
                                                        {remindLoan()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-12">
                                                <div className="profile-image-profile-detail float-md-right">
                                                    {pictureBook()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    </>
}