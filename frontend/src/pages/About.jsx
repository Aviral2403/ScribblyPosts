import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContext } from "../context/UserContext";

const ImageSkeleton = () => (
  <div className="w-full h-full bg-gray-400 animate-pulse rounded-lg"></div>
);

const BloggerLandingPage = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({
    hero: false,
    memories: false,
    community: false
  });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const heroBackgrounds = [
    { color: "bg-[#bc382e]", image: "/hero1.png" },
    { color: "bg-[#4583aa]", image: "/hero2.png" },
    { color: "bg-[#388d80]", image: "/hero3.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(
        (prevIndex) => (prevIndex + 1) % heroBackgrounds.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (imageKey) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageKey]: true
    }));
  };

  const handleCreateBlogClick = () => {
    if (user) {
      navigate("/write");
    } else {
      navigate("/login");
    }
  };

  const handleGetStartedClick = () => {
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />

      {/* Hero Section */}
      <div
        className={`h-screen transition-colors duration-1000 ${heroBackgrounds[currentBgIndex].color}`}
      >
        <div className="container mx-auto px-4 h-full pt-16">
          <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-8 pb-16">
            <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
                Publish your passions, your way
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Create a unique and beautiful blog easily.
              </p>
              <button
                onClick={handleCreateBlogClick}
                className="w-full sm:w-auto bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm sm:text-lg hover:bg-gray-800 hover:text-white transition-colors hover:shadow-lg"
                style={{ boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)" }}
              >
                CREATE YOUR BLOG
              </button>
            </div>

            <div className="w-full lg:w-1/2 max-w-2xl mx-auto lg:mx-0">
              <div className="relative">
                {!imagesLoaded.hero && <ImageSkeleton />}
                <img
                  src={heroBackgrounds[currentBgIndex].image}
                  alt="Blogging illustration"
                  className={`w-full rounded-lg shadow-xl transition-opacity duration-500 ${
                    imagesLoaded.hero ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.5)" }}
                  loading="lazy"
                  onLoad={() => handleImageLoad('hero')}
                />
                <div className="absolute inset-0 rounded-lg bg-black bg-opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen">
        {/* Think, Write, Share Section */}
        <div className="bg-gray-800 flex flex-col justify-center text-center py-16">
          <div className="container mx-auto px-4 flex flex-col justify-center">
            <div className="flex flex-col justify-center text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 tracking-wider">
                THINK • WRITE • SHARE!
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Express your ideas, share your stories, and connect with readers
                worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Hang Onto Your Memories Section */}
        <div className="bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
              <div className="w-full lg:w-1/2 relative h-[300px] lg:h-[400px]">
                {!imagesLoaded.memories && <ImageSkeleton />}
                <img
                  src="/memories.png"
                  alt="Memories illustration"
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    imagesLoaded.memories ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad('memories')}
                />
              </div>
              <div className="w-full lg:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 tracking-wider mb-4">
                  Hang On to Your Memories!
                </h2>
                <p className="text-lg text-gray-300">
                  Create a space for your memories to live forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[90vh] bg-[#1C425B]">
        {/* Express Yourself Section */}
        <div className="flex flex-col justify-center text-center py-16">
          <div className="container mx-auto px-4 flex flex-col justify-center">
            <div className="flex flex-col justify-center text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-wider">
                DISCOVER • ENGAGE • GROW!
              </h2>
              <p className="mt-4 text-sm md:text-lg text-gray-200 max-w-2xl mx-auto">
                Your voice matters. <span className="font-bold">ScribblyPosts</span> is the perfect platform to
                share your thoughts, ideas, and creativity with a community of
                like-minded individuals. Explore diverse blog posts, engage with fellow bloggers, and grow your presence in the community.
              </p>
            </div>
          </div>
        </div>

        {/* Inspire & Influence Section */}
        <div className="bg-[#1C425B] py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
              <div className="w-full lg:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-wider mb-4">
                  INSPIRE & INFLUENCE!
                </h2>
                <p className="text-gray-200 text-sm md:text-lg">
                  Your blog has the power to inspire and influence. Share your
                  experiences, insights, and stories to make a meaningful impact
                  on your readers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[90vh]">
        {/* Build a Community Section */}
        <div className="bg-gray-800 flex flex-col justify-center text-center py-16">
          <div className="container mx-auto px-4 flex flex-col justify-center">
            <div className="flex flex-col justify-center text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 tracking-wider">
                BUILD A COMMUNITY!
              </h2>
              <p className="mt-4 text-sm md:text-lg text-gray-300 max-w-2xl mx-auto">
                At <span className="font-bold">ScribblyPosts</span>, we believe in the power of community. Connect with other like-minded bloggers, share experiences, and support one another in your journey.
              </p>
            </div>
          </div>
        </div>

        {/* Collaborate & Grow Section */}
        <div className="bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
              <div className="w-full lg:w-1/2 relative h-[300px] lg:h-[400px]">
                {!imagesLoaded.community && <ImageSkeleton />}
                <img
                  src="/community.png"
                  alt="Community illustration"
                  className={`w-full h-full object-cover rounded-lg transition-opacity duration-500 ${
                    imagesLoaded.community ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad('community')}
                />
              </div>
              <div className="w-full lg:w-1/2 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 tracking-wider mb-4">
                  COLLABORATE & GROW!
                </h2>
                <p className="text-sm md:text-lg text-gray-300">
                  Growth comes from collaboration. By sharing your insights and learning from others, you can expand your knowledge, improve your craft, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Background Image */}
      <div className="relative min-h-[400px] lg:min-h-[60vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/footerImg.png")',
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Join millions of others
              </h2>
              <p className="text-md sm:text-xl text-white/90 max-w-2xl mx-auto">
                Whether sharing your expertise, breaking news, or whatever's on
                your mind, you're in good company on <span className="font-bold">ScribblyPosts</span>.
              </p>
              <button
                className="w-full sm:w-auto bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm sm:text-lg hover:bg-gray-800 hover:text-white transition-colors shadow:md"
                onClick={handleGetStartedClick}
                style={{ boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)" }}
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BloggerLandingPage;