import { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const Searchbar = () => {
    const [prompt, setPrompt] = useState("");
    const navigate = useNavigate();
    const path = useLocation().pathname;



    const handleSearch = () => {
        if (prompt) {
          navigate(`?search=${prompt}`);
        } else {
          navigate("/");
        }
      };
    
      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      };

  return (
    <div>
        {path === "/" && (
        <div className="relative flex items-center ml-8 cursor-pointer">
          <input
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Search A Post"
            className="outline-none px-3 py-2 rounded-md pl-10 w-full sm:max-w-xs md:max-w-md lg:max-w-lg mr-3 bg-blue-50 placeholder-gray-600"
          />
          <p
            onClick={handleSearch}
            className="absolute left-3 text-gray-900 cursor-pointer"
          >
            <IoMdSearch />
          </p>
        </div>
      )}
      
    </div>
  )
}

export default Searchbar
