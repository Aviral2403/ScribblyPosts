import { useContext, useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

const EditPost = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const postId = useParams().id;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "blockquote",
    "code-block",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

  const fetchPost = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/api/posts/${postId}`);

      // Verify post ownership
      if (res.data.userId !== user._id) {
        navigate("/");
        return;
      }

      setTitle(res.data.title);
      setDesc(res.data.desc);
      setCats(res.data.categories);

      if (res.data.photo) {
        setFile(res.data.photo);
        setPreviewUrl(res.data.photo);
      }
    } catch (err) {
      console.error("Error fetching post:", err);
      setError(err.response?.data || "Failed to fetch post details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (selectedFile) {
      try {
        if (!selectedFile.type.startsWith("image/")) {
          throw new Error("Please select an image file");
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
          throw new Error("File size should be less than 5MB");
        }

        setLoading(true);
        const base64 = await convertToBase64(selectedFile);

        const response = await axios.post(`${URL}/api/upload`, {
          file: base64,
        });

        if (response.data && response.data.url) {
          setFile(response.data.url);
          setPreviewUrl(response.data.url);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        console.error("Error handling file:", err);
        setError(err.message || "Failed to process image");
        setFile(null);
        setPreviewUrl("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (!title.trim()) {
        throw new Error("Title is required");
      }

      if (!desc.trim()) {
        throw new Error("Description is required");
      }

      const post = {
        title: title.trim(),
        desc,
        username: user.username,
        userId: user._id,
        categories: cats,
        photo: file,
      };

      const res = await axios.put(
        `${URL}/api/posts/${postId}?token=${localStorage.getItem("token")}`,
        post,
        { withCredentials: true }
      );

      toast.success("Post updated successfully!", {
        duration: 5000,
      });
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.error("Error updating post:", err);
      const errorMessage =
        err.response?.data || err.message || "Failed to update post";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = (i) => {
    setCats((prev) => prev.filter((_, index) => index !== i));
  };

  const addCategory = () => {
    if (cat.trim()) {
      setCats((prev) => [...prev, cat.trim()]);
      setCat("");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPost();
  }, [postId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-[200px] mt-4 sm:mt-8 flex-1 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="self-start sm:self-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 hover:text-blue-600 font-semibold rounded-lg flex items-center transition-colors duration-200"
          >
            <span className="mr-1 sm:mr-2 text-semibold">←</span> Back
          </button>
          <h1 className="font-bold text-2xl sm:text-3xl text-gray-800 text-center sm:flex-1 mt-3 sm:mt-0">
            Update Post
          </h1>
          <div className="hidden sm:block w-[76px]"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form className="w-full flex flex-col space-y-3 sm:space-y-4 md:space-y-6 mt-4 mb-4">
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Enter post title"
            className="px-3 sm:px-4 py-2 text-sm sm:text-base outline-none border-2 border-gray-300 rounded-lg"
            required
          />

          <div className="space-y-3">
            <div className="relative">
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                disabled={loading}
              />
              <button
                type="button"
                className={`px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-blue-800 transition-colors ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Choose Image
              </button>
            </div>

            {previewUrl && (
              <div className="relative w-full max-w-md mx-auto">
                <img
                  src={previewUrl}
                  alt="Post preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    setError("Failed to load image preview");
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl("");
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-red-100 transition-colors"
                >
                  <TiDelete className="text-red-600 text-xl" />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base outline-none border-2 border-gray-300 rounded-lg flex-1 sm:flex-none sm:w-64"
                placeholder="Enter post category"
                type="text"
              />
              <button
                type="button"
                onClick={addCategory}
                className="whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold cursor-pointer rounded-md text-white bg-gray-800 hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md text-center"
              >
                Add Category
              </button>
            </div>

            <div className="flex flex-wrap gap-2 px-2 sm:px-4">
              {cats?.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-center items-center space-x-2 px-2 py-1 rounded-md bg-gray-900 text-gray-100 text-sm sm:text-base"
                >
                  <p>{c}</p>
                  <button
                    type="button"
                    onClick={() => deleteCategory(i)}
                    className="text-white bg-black rounded-full cursor-pointer p-1 text-sm hover:bg-red-600 transition-colors"
                  >
                    <TiDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="quill-container">
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              value={desc}
              onChange={setDesc}
              className="h-64 sm:h-96 mb-12"
              placeholder="Enter post description"
            />
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`mb-4 w-full sm:w-[60%] md:w-[40%] lg:w-[20%] mx-auto font-semibold px-4 py-2 text-base sm:text-lg md:text-xl rounded-lg text-white bg-gray-800 hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
