import Lottie from "react-lottie";
import { animationDefaultOptions } from "@/lib/utils";

export const EmptyChatContainer = () => {

  return <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
    <Lottie
    isClickToPauseDisabled={true}
    height={200}
    width={200}
    options={animationDefaultOptions}
    />
    <div className="text-opacity-80 text-white flex flex-col items-center mt-10 lg:text-4xl text-3xl
    transition-all duration--300 text-center">
      <h3 className="poppins-medium">
        Hi<span className="text-purple-500 ">!</span> Welcome to
        <span className="text-purple-500"> Syncronous</span> Chat App
        <span className="text-purple-500">.</span>
      </h3>
    </div>
  </div>
}

export default EmptyChatContainer;