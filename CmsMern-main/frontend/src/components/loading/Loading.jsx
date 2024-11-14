const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute w-full h-full border-4 border-t-transparent border-red-500 rounded-full animate-spin delay-200"></div>
      </div>
    </div>
  );
};

export default Loading;
