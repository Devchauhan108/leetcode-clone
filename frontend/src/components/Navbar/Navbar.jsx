import {NavLink} from "react-router-dom";
function Navbar() {
    return(
        <>
        <h1>LeetCode Clone</h1>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/problems">Problems</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
        </>
    )
}
export default Navbar;