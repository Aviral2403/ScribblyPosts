import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { URL } from "../url";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Searchbar from "../components/Searchbar";
import Loader from "../components/Loader";

const Home = () => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const { search } = useLocation();
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${URL}/api/posts${search}`;
      const header = {
        "ngrok-skip-browser-warning": "69420",
      };
      const res = await axios.get(url, { headers: header });
      // Sort posts by updatedAt date in descending order (newest first)
      const sortedPosts = res.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setPosts(sortedPosts);
      if (sortedPosts.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {!loading && (
        <div className="flex justify-center items-center mt-4 w-full">
          <Searchbar />
        </div>
      )}
      <div className="content flex-1 px-8 md:px-[100px] mb-4">
        {loading ? (
          <Loader />
        ) : !noResults ? (
          posts.map((post) => (
            <Link
              key={post._id}
              to={user ? `/posts/post/${post._id}` : "/register"}
            >
              <HomePosts post={post} />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <img
              src="/noResult.png"
              alt="No Results"
              className="w-48 h-48 md:w-64 md:h-64"
              loading="lazy"
            />
            <h3 className="text-center font-semibold mt-4 italic text-xl">
              We're Sorry!
            </h3>
            <h3 className="text-center font-semibold mt-2 text-xl">
              No Related Posts For Your Search
            </h3>
            <h3 className="text-gray-600 italic text-lg mt-2">
              Try searching for a different keyword
            </h3>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
