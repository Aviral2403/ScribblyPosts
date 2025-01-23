import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import HomePosts from "../components/HomePosts";
import Loader from "../components/Loader";

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const url = `${URL}/api/posts/user/${user._id}`;
      const header = {
        "ngrok-skip-browser-warning": "69420",
      };
      const res = await axios.get(url, { headers: header });
      setPosts(res.data);
      setNoResults(res.data.length === 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="px-8 md:px-[200px] flex justify-center items-center mt-6">
          {!loading && (
            <h1 className="text-2xl md:4xl lg:6xl font-semibold text-center">
              Pen to Screen: Your Masterpieces, Blogs Written By You!
            </h1>
          )}
        </div>
        <div className="px-8 md:px-[200px] mt-8">
          {loading ? (
              <Loader />
          ) : !noResults ? (
            <>
              <div className="space-y-8">
                {posts.map((post) => (
                  <Link
                    key={post._id}
                    to={user ? `/posts/post/${post._id}` : "/login"}
                  >
                    <HomePosts post={post} />
                  </Link>
                ))}
              </div>
              <div className="text-center text-gray-700 mt-8 py-4 font-semibold italic text-xl">
                No More Posts To Display!
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
              <h3 className="font-bold mb-4 sm:mb-8 md:mt-6 italic text-md md:text-lg">
                No posts available
              </h3>
              <div className="flex flex-col items-center justify-center h-auto sm:h-[50vh] md:h-[60vh] lg:h-[70vh] mb-6">
                <img
                  className="w-full h-auto max-w-2xl"
                  src="https://www.outbrain.com/blog/wp-content/uploads/2024/06/how-to-write-your-first-blog-post.png"
                  alt="Write your first blog"
                  loading="lazy"
                />
              </div>
              <h3 className="text-md md:text-lg">No Blogs Yet?</h3>
              <Link
                to="/write"
                className="text-gray-700 font-semibold block italic text-md sm:text-lg hover:text-blue-500 transition-colors"
              >
                Write your first post..{" "}
                <span className="text-blue-500">click here</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyBlogs;
