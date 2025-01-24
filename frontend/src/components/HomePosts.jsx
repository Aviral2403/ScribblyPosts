/* eslint-disable react/prop-types */
import DOMPurify from "dompurify";

const HomePosts = ({ post }) => {
  const truncatedDesc =
    post.desc.length > 250
      ? post.desc.slice(0, 250) +
        ' <span class="text-blue-500">...Read more</span>'
      : post.desc;

  // Placeholder image URL
  const placeholderImage = "/No-preview.png";

  return (
    <div className="w-full flex flex-col lg:flex-row gap-3 mt-16 space-y-6 lg:space-y-6">
      <div className="w-full lg:w-[35%] h-[250px] sm:h-[320px] lg:h-[220px] flex justify-center items-center group-hover:scale-110">
        <div className="group h-full w-full overflow-hidden">
          <img
            src={post.photo || placeholderImage}
            alt=""
            className="h-full w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      </div>
      <div className="w-full lg:w-[65%] flex flex-col">
        <h1 className="text-xl font-bold mb-1 lg:mb-2">{post.title}</h1>
        <div className="flex flex-col mb-2 text-sm font-semibold text-gray-600 gap-1">
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
        <div className="text-justify">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(truncatedDesc),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePosts;
