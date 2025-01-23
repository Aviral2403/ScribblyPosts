const Loader = () => {
  return (
    <div className="w-full animate-pulse">
      {[1, 2, 3].map((item) => (
        <div 
          key={item} 
          className="w-full flex flex-col lg:flex-row gap-3 mt-20 space-y-6 lg:space-y-6"
        >
          {/* Image skeleton */}
          <div className="w-full lg:w-[35%] h-[250px] sm:h-[320px] lg:h-[220px] bg-gray-400 rounded"></div>
          
          {/* Content skeleton */}
          <div className="w-full lg:w-[65%] flex flex-col gap-4">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-400 rounded w-3/4"></div>
            
            {/* Author info skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-400 rounded w-1/4"></div>
              <div className="h-4 bg-gray-400 rounded w-2/5"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
              <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;



