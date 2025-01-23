import { useContext, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { TiDelete } from "react-icons/ti";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL } from "../url";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ImagePreviewSkeleton = () => (
  <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin" />
  </div>
);

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
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
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

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
    if (selectedFile) {
      setIsUploading(true);
      try {
        const base64 = await convertToBase64(selectedFile);
        
        const response = await axios.post(URL + "/api/upload", {
          file: base64
        });
  
        setFile(response.data.url);
        setImagePreview(response.data.url);
      } catch (err) {
        console.error("Error uploading image:", err);
        setFile(null);
        setImagePreview(null);
      } finally {
        setIsUploading(false);
      }
    } else {
      setFile(null);
      setImagePreview(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
      photo: file,
      photoId: null
    };
  
    try {
      const res = await axios.post(
        `${URL}/api/posts/create?token=${localStorage.getItem("token")}`,
        post,
        { withCredentials: true }
      );
      navigate(`/posts/post/${res.data._id}`);
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  const addCategory = () => {
    if (cat.trim()) {
      setCats((prevCats) => [...prevCats, cat]);
      setCat("");
    }
  };

  const deleteCategory = (index) => {
    setCats((prevCats) => prevCats.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative flex justify-center items-center 
                   bg-cover bg-center bg-no-repeat
                   xs:bg-[url('/PhoneBg.png')] 
                   sm:bg-[url('/TabletBg.png')]
                   md:bg-[url('/TabletBg.png')] 
                   lg:bg-[url('/loginBg.png')] 
                   bg-[url('/loginBg.png')]
                   before:content-[''] 
                   before:absolute 
                   before:inset-0 
                   before:bg-black 
                   before:bg-opacity-50"
        style={{ minHeight: "100vh" }}>
        <div className="relative z-10 px-6 md:px-20 py-8 w-full max-w-4xl">
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <button
                onClick={() => navigate("/")}
                className="self-start sm:self-auto px-4 py-2 text-gray-700 hover:text-blue-600 font-medium font-semibold rounded-lg flex items-center transition-colors duration-200"
              >
                <span className="mr-2">←</span> Back
              </button>
              <h1 className="font-bold text-3xl text-gray-800 text-center sm:flex-1 mt-4 sm:mt-0">
                Publish A Post
              </h1>
              <div className="hidden sm:block w-[76px]"></div>
            </div>
            
            <form className="space-y-6" onSubmit={handleCreate}>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter post title"
                className="w-full px-4 py-3 outline-none border border-blue-300 rounded-lg text-gray-700 placeholder-gray-700 focus:ring-2 focus:ring-blue-400 transition bg-blue-100"
                required
              />

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-blue-800 transition-colors duration-200"
                  >
                    Choose File
                  </button>
                </div>
                
                {isUploading ? (
                  <ImagePreviewSkeleton />
                ) : (
                  imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 text-black bg-white rounded-md hover:text-red-600 transition-colors duration-200"
                      >
                        <TiDelete size={20} />
                      </button>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <input
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                    className="w-full sm:w-full flex-1 px-4 py-3 outline-none border border-blue-300 rounded-lg text-gray-700 placeholder-gray-600 focus:ring-2 focus:ring-blue-400 transition bg-blue-100"
                    placeholder="Enter post category"
                    type="text"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="px-6 py-2 font-medium rounded-lg w-full sm:w-auto text-white bg-gray-800 hover:bg-blue-800 transition-colors duration-200 transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {cats.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-lg text-gray-100"
                    >
                      <p className="text-gray-100">{c}</p>
                      <TiDelete
                        className="cursor-pointer text-red-400"
                        onClick={() => deleteCategory(i)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-96">
                <ReactQuill
                  theme="snow"
                  value={desc}
                  onChange={setDesc}
                  modules={modules}
                  formats={formats}
                  className="h-80"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-semibold rounded-lg text-lg text-white bg-gray-800 hover:bg-blue-800 transition-colors duration-200 transition duration-200 transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
              >
                Create Post
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;