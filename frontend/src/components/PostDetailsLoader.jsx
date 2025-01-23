const PostDetailsLoader = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Back Button Skeleton */}
      <div className="px-4 md:px-16 lg:px-[150px] mt-8">
        <div className="flex items-center mb-4">
          <div className="h-6 w-32 bg-gray-400 rounded"></div>
        </div>

        {/* Image Skeleton */}
        <div className="w-full h-[400px] bg-gray-400 rounded-lg"></div>

        {/* Title Skeleton */}
        <div className="mt-8">
          <div className="h-10 w-3/4 bg-gray-400 rounded mb-4"></div>
        </div>

        {/* Save Post Skeleton */}
        <div className="flex items-center space-x-2 mb-2 mt-4">
          <div className="h-6 w-32 bg-gray-400 rounded"></div>
          <div className="h-6 w-6 bg-gray-400 rounded"></div>
        </div>

        {/* Author Info Skeleton */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="h-5 w-48 bg-gray-400 rounded"></div>
          <div className="h-5 w-56 bg-gray-400 rounded"></div>
        </div>

        {/* Content Skeleton */}
        <div className="mt-8 space-y-4">
          <div className="h-4 w-full bg-gray-400 rounded"></div>
          <div className="h-4 w-full bg-gray-400 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-400 rounded"></div>
          <div className="h-4 w-full bg-gray-400 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-400 rounded"></div>
        </div>

        {/* Categories Skeleton */}
        <div className="mt-8">
          <div className="h-6 w-32 bg-gray-400 rounded mb-4"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-24 bg-gray-400 rounded-lg"></div>
            <div className="h-8 w-20 bg-gray-400 rounded-lg"></div>
            <div className="h-8 w-28 bg-gray-400 rounded-lg"></div>
          </div>
        </div>

        {/* Comments Section Skeleton */}
        <div className="mt-8 mb-16">
          <div className="h-6 w-32 bg-gray-400 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="h-20 w-full bg-gray-400 rounded"></div>
              <div className="h-20 w-full bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>

        {/* Comment Input Skeleton */}
        <div className="w-full flex flex-col md:flex-row mb-12 gap-4">
          <div className="md:w-[80%] h-10 bg-gray-400 rounded-lg"></div>
          <div className="md:w-[20%] h-10 bg-gray-400 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsLoader;