import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Spinner from "../../components/Spinner/Spinner"
import {Url} from "../../partials/url-BE/Url.jsx";

let responses = []
export default function ChangeRole() {
    let statusCheckerName = true
    const params = useParams();
    const [roles, setRoles] = useState([])
    const [statusUserById, setStatusUserById] = useState()
    const [dataUserById, setDataUserById] = useState([])
    const [userUpdated, setUserUpdated] = useState([])
    const [statusUpdated, setStatusUpdated] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [formInput, setFormInput] = useState({
        roleName: ""
    })

    async function getUsers() {
        try {
            const res = await fetch(Url+"/role/list-role",
                {method: "GET"})
            const data = await res.json();
            setRoles(data.sort((a,b)=>a.roleId-b.roleId));
        }catch (err){
            console.log(err)
            alert("There's something wrong. please try again")
        }finally {
            setIsLoading(false)
        }
    }

    function roleNameChecker(paramRoleName){
        for(let role of roles){
            if(role.roleName.toLowerCase()===paramRoleName.toLowerCase() && paramRoleName.toLowerCase() !== localStorage.getItem("tempRoleName").toLowerCase()){
                alert("Failed to save data, data was exists")
                statusCheckerName = false
            }
        }
    }

    function handleInput(event, inputName) {
        const copyFormInput = {...formInput}
        copyFormInput[inputName] = event.target.value
        setFormInput(copyFormInput)
    }

    async function roleById() {
        setIsLoading(true)
        try {
            const res = await fetch(Url+"/role/"+params.roleId,
                {method: "GET"})
            const data = await res.json();
            localStorage.setItem("tempRoleName", data.data.roleName)
            setFormInput(data.data);
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
        event.preventDefault()
        userDeleteScenario()
        if(formInput.roleName.split(" ").length === 1){
            const payload = JSON.stringify({
                ...formInput,
                roleName: formInput.roleName.charAt(0).toUpperCase() + formInput.roleName.slice(1).toLowerCase(),
                roleId: parseInt(formInput.roleId)
            })

            roleNameChecker(formInput.roleName.charAt(0).toUpperCase() + formInput.roleName.slice(1).toLowerCase())

            if(statusCheckerName === false) {statusCheckerName = true}
            else {
                const targetUrl = Url+"/role/update/" + params.roleId;
                const method = "PUT"
                await fetch(targetUrl, {method: method, body: payload, headers: {'Content-Type': 'application/json'}})
                    .then((re) => re.json())
                    .then((d) => responses.push(d))

                if (responses[responses.length - 1].status.toString() === "true") {
                    localStorage.removeItem("tempRoleName")
                    alert(responses[responses.length - 1].message.toString())
                    navigate('/roles')
                } else {
                    if (formInput.roleName !== "") {
                        const messageArr = responses[responses.length - 1].message.toString().split(" ");
                        messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0 ? alert(responses[responses.length - 1].message.toString()): alert(responses[responses.length - 1].message.toString())
                    } else {alert("Form must be filled fully")}
                }
                statusCheckerName = true
            }
        }
        else{
            let strRoleName = ""
            for(let inputRoleName of formInput.roleName.split(" ")) {
                strRoleName += inputRoleName.charAt(0).toUpperCase() + inputRoleName.slice(1).toLowerCase() + " "
            }

            const payload = JSON.stringify({
                ...formInput,
                roleName: strRoleName.substring(0,strRoleName.length-1),
                roleId: parseInt(formInput.roleId)
            })

            roleNameChecker(strRoleName.substring(0,strRoleName.length-1))

            if(statusCheckerName===false){statusCheckerName = true}
            else {
                const targetUrl = Url+"/role/update/" + params.roleId;
                const method = "PUT"
                await fetch(targetUrl, {method: method, body: payload, headers: {'Content-Type': 'application/json'}})
                    .then((re) => re.json())
                    .then((d) => responses.push(d))

                if (responses[responses.length - 1].status.toString() === "true") {
                    localStorage.removeItem("tempRoleName")
                    alert(responses[responses.length - 1].message.toString())
                    navigate('/roles')
                } else {
                    if (formInput.roleName !== "") {
                        const messageArr = responses[responses.length - 1].message.toString().split(" ");
                        messageArr.indexOf("Id") >= 0 && messageArr.indexOf("found") >= 0 ? alert(responses[responses.length - 1].message.toString()):alert(responses[responses.length - 1].message.toString())
                    }
                    else {alert("Form must be filled fully")}
                }

                statusCheckerName = true
            }
        }
    }

    useEffect(() => {
        getUsers()
        roleById()
        getUsersById()
    }, [])


    return <>
        <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Form Change Role</h6>

                <Link onClick={()=>userDeleteScenario()} to={"/roles"}>
                    <button className="btn btn-secondary">
                        Back
                    </button>
                </Link>
            </div>

            <div className="card-body">
                {isLoading?
                    <div className="d-flex justify-content-center">
                        <Spinner />
                    </div>
                    :
                    <form className="w-50" onSubmit={event => handleSubmit(event)}>
                        <div className="form-group mb-4">
                            <label>Role Name</label>
                            <input type="text" className="form-control" required value={formInput.roleName} onChange={event => handleInput(event, "roleName")}/>
                        </div>

                        <button className="btn btn-primary">
                            Save Changes
                        </button>
                    </form>
                }
            </div>
        </div>
    </>
}