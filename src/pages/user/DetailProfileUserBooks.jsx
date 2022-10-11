import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Spinner from "../../components/Spinner/Spinner.jsx";

export default function DetailProfileUserBooks() {
    const [userBooks, setUserBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const navigate = useNavigate()
    const params = useParams()

    async function getUserBooks() {
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

    function dueDate(paramDueDate){
        return<>
            {
                new Date(paramDueDate.dueDate).getDate() - new Date().getDate() >= 0 ? <h4 className={"btn-outline-success"}>{new Date(paramDueDate.dueDate).getDate() - new Date().getDate() + " Days"}</h4>
                    :
                    <h4 className={"btn-outline-danger"}>{"Due Date Passed " + (0 - (new Date(paramDueDate.dueDate).getDate() - new Date().getDate())) + " Days"}</h4>
            }
        </>
    }

    function listDetailsUserBook(){
        return<>
            {
                userBooks.map((uBook) => params.username === uBook.userName ? uBook.returnDate === null ?
                        <tbody><tr key={uBook.id}><td>{uBook.bookTitle}</td><td>{uBook.dueDate}</td><td className={"text-center"}>{dueDate(uBook)}</td></tr></tbody>
                        :
                        <></>
                    :
                    <></>
                )}
        </>
    }

    function back(event) {
        event.preventDefault()
        userDeleteScenario()
        history.go(-1)
    }


    useEffect(() => {
        getUserBooks()
        getUsersById()
    }, [])


    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <div className={"m-0 font-weight-bold text-primary fa fa-arrow-circle-left"}
                     onClick={event => back(event)}>
                    &nbsp;
                    Back
                </div>
                <h6 className="m-0 font-weight-bold text-primary">List Your Books</h6>
            </div>
            <div className="card-body">
                {isLoading?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                    :
                    <div className={"table-responsive"}>
                        <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                            <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Due Date</th>
                                <th scope="col">Time</th>
                            </tr>
                            </thead>
                            {listDetailsUserBook()}
                        </table>
                    </div>
                }
            </div>
        </div>
    </>
}