import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";

const Menu = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.get(URL + '/api/auth/logout', { withCredentials: true });
            setUser(null);
            console.log(res);
            navigate("/about"); // Redirect to login page
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="bg-gray-900 bg-opacity-80 w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4">
            {!user && <h3 className="text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1"><Link to="/login">Login</Link></h3>}
            {!user && <h3 className="text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1"><Link to="/register">Register</Link></h3>}
            {user && <h3 className="md:hidden text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1"><Link to="/about">About</Link></h3>}
            {user && <h3 className="md:hidden text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1"><Link to="/write">Write</Link></h3>}
            {user && <h3 className="text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1"><Link to={"/myblogs/" + user._id}>My blogs</Link></h3>}
            {user && <h3 className="text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1"><Link to={"/profile/" + user._id}>Profile</Link></h3>}
            {user && <h3 onClick={handleLogout} className="text-white text-sm hover:bg-[#bdc2e7] cursor-pointer hover:text-gray-900 rounded-md p-1">Logout</h3>}
        </div>
    );
}

export default Menu;

