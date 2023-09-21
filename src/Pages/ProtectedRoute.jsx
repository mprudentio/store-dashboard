/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';
const ProtectedRoute = (props) => {

 const isAuthorize = window.localStorage.getItem("isLoggedin")
 if(!isAuthorize) return <Navigate to="/login"/>

 return props.children
}

export default ProtectedRoute