import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useContext, useState } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  const showMenu = () => {
    setMenu(!menu);
  };

  const { user } = useContext(UserContext);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-[100px] py-4 bg-gray-900">
      <div className="flex flex-row gap-2 justify-between items-center w-full">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/NavLogo.png" alt="Logo" width={50} height={60} />
          <h1 className="text-lg font-cursive text-shadow-lg text-gray-100 cursor-pointer font-semibold">
            ScribblyPosts
          </h1>
        </Link>
        <Link to='/'>
          <h1 className="text-sm text-gray-100 cursor-pointer hover:bg-[#bdc2e7] hover:text-gray-900 p-1 rounded-md text-center items-center block md:hidden">
            Home
          </h1>
        </Link>
      </div>
      <div className="hidden md:flex items-center justify-center space-x-2 md:space-x-4 text-gray-100 ">
        <Link
          to="/"
          className="hover:bg-[#bdc2e7] hover:text-gray-900 p-1 rounded-md"
        >
          Home
        </Link>

        <Link
          to="/about"
          className="hover:bg-[#bdc2e7] hover:text-gray-900 p-1 rounded-md"
        >
          About
        </Link>

        {user ? (
          <h3>
            <Link
              to="/write"
              className="hover:bg-[#bdc2e7] hover:text-gray-900 p-1 rounded-md"
            >
              Write
            </Link>
          </h3>
        ) : (
          <h3>
            <Link
              to="/login"
              className="hover:bg-[#bdc2e7] hover:text-gray-900 p-1 rounded-md"
            >
              Login
            </Link>
          </h3>
        )}
        <div className="hidden md:flex items-center justify-center  text-gray-100"></div>
        {user ? (
          <div onClick={showMenu}>
            <p className="cursor-pointer relative ml-2">
              <GiHamburgerMenu />
            </p>
            {menu && <Menu />}
          </div>
        ) : (
          <>
            <h3>
              <Link
                to="/register"
                className="hover:bg-[#bdc2e7] hover:text-gray-900 p-1 rounded-md"
              >
                Register
              </Link>
            </h3>
          </>
        )}
      </div>
      <div onClick={showMenu} className="md:hidden text-lg text-gray-100">
        <p className="cursor-pointer relative ml-2">
          <GiHamburgerMenu />
        </p>
        {menu && <Menu />}
      </div>
    </div>
  );
};

export default Navbar;
