import { Flame } from "lucide-react";

export default function Loading({height}:{height?:string}) {
  return (
    <div className={`flex justify-center text-blue-600 font-semibold font-mono items-center flex-col ${height ? height:"h-screen"} `}>
      <Flame color="#f27021" className="w-8 h-8 animate-bounce"/>
      <p>Loading</p>
    </div>
  );
}
