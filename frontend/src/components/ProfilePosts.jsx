/* eslint-disable react/prop-types */
import DOMPurify from "dompurify";

const ProfilePosts = ({ p, navigateToPost }) => {
  const placeholderImage = "/noImage.png"; // Replace with your actual placeholder image path

  return (
    <div
      className="w-full flex flex-col cursor-pointer mt-8 md:flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4"
      onClick={() => navigateToPost(p._id)}
    >
      {p.photo && (
        <div className="w-full lg:w-[35%] h-[200px] flex justify-center items-center overflow-hidden group">
        <img
          src={p.photo || placeholderImage}
          alt=""
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          loading="lazy"
        />
      </div>
      )}
      <div className="flex flex-col w-full lg:w-[65%] space-y-2">
        <h1 className="text-xl font-bold mb-1 md:text-2xl">{p.title}</h1>
        <div className="flex flex-col mb-2 text-sm font-semibold text-gray-600 gap-1">
          <div className="flex gap-1">
            <p className="text-gray-700 italic">Written By:</p>
            <p className="text-blue-500 italic">@{p.username}</p>
          </div>
          <div className="flex gap-1">
            <p className="text-gray-700 italic">Last Updated On:</p>
            <p className="text-gray-700 italic">
              {new Date(p.updatedAt).toString().slice(0, 15)}
            </p>
            {/* <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p> */}
          </div>
        </div>
        <div className="">
          <div className="inline">
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(p.desc.slice(0, 200)),
              }}
            />
            <span className="text-blue-500">...Read more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePosts;
