import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { toast, Toaster } from "react-hot-toast";

const Profile = () => {
  const param = useParams().id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user, setUser  } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true); // Set loading when starting to fetch
    try {
      const res = await axios.get(
        URL +
          "/api/users/" +
          user._id +
          "?token=" +
          localStorage.getItem("token"),
        { withCredentials: true }
      );
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserUpdate = async () => {
    try {
      const updatedData = { username, email };
      if (newPassword.trim()) {
        updatedData.password = newPassword;
      }
      await axios.put(
        URL +
          "/api/users/" +
          user._id +
          "?token=" +
          localStorage.getItem("token"),
        updatedData,
        { withCredentials: true }
      );
      fetchUserPosts();
      toast.success("User  updated successfully!", { duration: 3000 }); // Show toast notification
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserDelete = async () => {
    try {
      await axios.delete(
        URL +
          "/api/users/" +
          user._id +
          "?token=" +
          localStorage.getItem("token"),
        { withCredentials: true }
      );
      setUser (null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const url = `${URL}/api/posts/user/${user._id}`;
      const header = {
        "ngrok-skip-browser-warning": "69420",
      };
      const res = await axios.get(url, { headers: header });
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const res = await axios.get(`${URL}/api/users/saved-posts/${user._id}`);
      setSavedPosts(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Set loading to false after all data is fetched
    }
  };

  const navigateToPost = (postId) => {
    navigate(`/posts/post/${postId}`);
  };

  useEffect(() => {
    if (user) {
      // Fetch all data sequentially
      const fetchAllData = async () => {
        await fetchProfile();
        await fetchUserPosts();
        await fetchSavedPosts();
      };
      fetchAllData();
    }
  }, [param, user]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl lg:max-w-5xl">
          <button
            onClick={() => navigate("/")}
            className="mb-6 px-4 py-2 text-gray-800 hover:text-blue-500 hover:underline flex items-center gap-2 font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>

        {loading ? (
          <div className="w-full max-w-2xl lg:max-w-5xl">
            <Loader />
          </div>
        ) : (
          <>
            {/* Profile Section */}
            <div className="w-full max-w-2xl mb-12">
              <h1 className="text-2xl font-bold mb-6 text-center">About You</h1>
              <div className="flex flex-col space-y-6">
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className="w-full outline-none px-4 py-2 text-gray-700 rounded-lg bg-blue-50"
                  placeholder="Your username"
                  type="text"
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full outline-none px-4 py-2 text-gray-700 rounded-lg bg-blue-50"
                  placeholder="Your email"
                  type="email"
                />
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="w-full outline-none px-4 py-2 text-gray-700 rounded-lg bg-blue-50"
                  placeholder="********"
                  type="password"
                />
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleUserUpdate}
                    className="text-white font-semibold bg-gray-800 px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleUserDelete}
                    className="text-white font-semibold bg-red-700 px-6 py-2 rounded-md hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Posts Section */}
            <div className="w-full max-w-2xl lg:max-w-5xl mt-4">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Posts Saved by You!
              </h1>
              <div className="space-y-6">
                {savedPosts.length > 0 ? (
                  <>
                    {savedPosts.map((p) => (
                      <ProfilePosts
                        key={p._id}
                        p={p}
                        navigateToPost={navigateToPost}
                      />
                    ))}
                    <div className="text-center text-gray-700 mt-8 py-4 font-semibold italic text-xl">
                      No More Saved Posts To Display!
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-4">
                    <div className="text-center text-gray-700 font-semibold italic text-xl">
                      No saved posts yet!
                    </div>
                    <img
                      src="/noPosts.png"
                      alt=""
                      className="w-48 h-48 md:w-64 md:h-64"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-center text-gray-700 md:text-xl text-md">
                        Oops! It looks like your saved posts are playing hide
                        and seek! Go out there, explore the wonders of the
                        internet and save whatever you like here for a future
                        reference!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />

      <Toaster />
    </div>
  );
};

export default Profile;