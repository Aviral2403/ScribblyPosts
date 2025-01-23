import { useNavigate, useParams } from "react-router-dom";
import Comments from "../components/Comment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { AiOutlineArrowLeft } from "react-icons/ai";
import axios from "axios";
import { URL } from "../url";
import { useEffect, useState, useCallback, useContext } from "react";
import { UserContext } from "../context/UserContext";
import DOMPurify from "dompurify";
import PostDetailsLoader from "../components/PostDetailsLoader";
import toast, { Toaster } from 'react-hot-toast';

const PostDetails = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id: postId } = useParams();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [post, setPost] = useState({
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const placeholderImage = "/No-preview.png";

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/api/posts/${postId}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load post');
    }
  }, [postId]);

  const fetchPostComments = async () => {
    try {
      const res = await axios.get(`${URL}/api/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load comments');
    }
  };

  const checkSavedStatus = async () => {
    try {
      const res = await axios.get(
        `${URL}/api/users/check-saved/${user._id}/${postId}`
      );
      setIsSaved(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${URL}/api/posts/${postId}?token=${localStorage.getItem("token")}&userId=${user._id}`,
        { withCredentials: true }
      );
      toast.success('Post deleted successfully!');
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleSavePost = async () => {
    try {
      await axios.put(
        `${URL}/api/users/save-post/${postId}?token=${localStorage.getItem(
          "token"
        )}`,
        { userId: user._id },
        { withCredentials: true }
      );
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Post removed from saved' : 'Post saved successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save post');
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment first');
      return;
    }
    
    setCommentLoading(true);
    try {
      const response = await axios.post(
        `${URL}/api/comments/create?token=${localStorage.getItem("token")}`,
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      
      // Add the new comment to the existing comments array
      setComments(prevComments => [...prevComments, response.data]);
      setComment(""); // Clear the input field
      toast.success('Comment added successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPost();
      await fetchPostComments();
      if (user && postId) {
        await checkSavedStatus();
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchPost, user, postId]);

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePost}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="px-4 md:px-16 lg:px-[150px] mt-8 min-h-screen mb-4">
        {loading ? (
          <PostDetailsLoader />
        ) : (
          <>
            <div className="flex items-center mb-4">
              <button
                className="flex items-center text-gray-800 hover:underline hover:text-blue-500 font-semibold"
                onClick={() => navigate("/")}
              >
                <AiOutlineArrowLeft className="mr-2 font-semibold" /> Back to Home
              </button>
            </div>

            {((post.photo && typeof post.photo === "string" && post.photo.trim()) ||
              placeholderImage) && (
              <img
                className="w-full mx-auto max-h-[500px] object-cover"
                src={
                  post.photo && typeof post.photo === "string" && post.photo.trim()
                    ? post.photo
                    : placeholderImage
                }
                alt="Post"
                loading="lazy"
              />
            )}

            <div className="mt-4 md:mt-8">
              <h1 className="text-3xl font-bold text-black md:text-4xl mb-2">
                {post.title}
              </h1>

              {user && (
                <div className="flex items-center space-x-2 mb-2 mt-4">
                  <span className="font-semibold text-md italic">Save This Post</span>
                  <button
                    onClick={handleSavePost}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
                  </button>
                </div>
              )}

              {user?._id === post?.userId && (
                <div className="flex items-center justify-start space-x-2 mb-4">
                  <button
                    className="cursor-pointer text-gray-800 p-2 hover:scale-110"
                    onClick={() => navigate(`/edit/${postId}`)}
                    aria-label="Edit post"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="cursor-pointer text-gray-800 hover:scale-110"
                    onClick={() => setShowDeleteModal(true)}
                    aria-label="Delete post"
                  >
                    <MdDelete />
                  </button>
                </div>
              )}

              <div className="flex flex-col text-md font-semibold text-gray-600 gap-1 mt-2">
                <div className="flex gap-1">
                  <p className="text-gray-700 italic">Written By:</p>
                  <p className="text-blue-500 italic">@{post.username}</p>
                </div>
                <div className="flex gap-1">
                  <p className="text-gray-700 italic">Last Updated On:</p>
                  <p className="text-gray-700 italic">
                    {new Date(post.updatedAt).toString().slice(0, 15)}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-8 max-w-none text-justify">
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.desc),
                  }}
                  className="quill-content text-lg leading-relaxed prose-lg max-w-none"
                />
              </div>
            </div>

            <div className="mt-8 font-semibold">
              <p className="w-full text-lg mb-4">Categories:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(post.categories) && post.categories.length > 0 ? (
                  post.categories.map((c, i) => (
                    <div
                      key={i}
                      className="bg-gray-800 text-gray-100 rounded-lg px-3 py-1"
                    >
                      {c}
                    </div>
                  ))
                ) : (
                  <p>No categories available</p>
                )}
              </div>
            </div>

            <div className="flex flex-col mt-6 mb-16">
              <h3 className="mt-6 mb-4 font-semibold text-lg">Comments:</h3>
              {comments && comments.length > 0 ? (
                comments.map((c) => <Comments key={c._id} c={c} post={post} />)
              ) : (
                <div className="text-gray-700 italic text-lg">
                  <p className="font-semibold">No comments yet!</p>
                  <p>
                    Be the first one to comment on{" "}
                    <span className="text-blue-500">@{post.username}</span>'s post.
                  </p>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col mt-4 md:flex-row mb-12">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Write a comment"
                className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0 rounded-lg bg-blue-50 md:mr-2 placeholder-gray-600"
              />
              <button
                onClick={postComment}
                disabled={commentLoading || !comment.trim()}
                className={`bg-gray-800 text-sm text-white px-2 py-2 md:w-[30%] md:px-4 mt-4 md:mt-0 rounded-lg md:ml-2 hover:bg-blue-600 ${
                  (commentLoading || !comment.trim()) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {commentLoading ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </>
        )}
      </div>
      <DeleteConfirmationModal />
      <Toaster position="top-right" />
      <Footer />
    </div>
  );
};

export default PostDetails;
