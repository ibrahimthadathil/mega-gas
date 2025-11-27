export default function Loading({height}:{height?:string}) {
  return (
    <div className={`flex justify-center text-indigo-400 items-center ${height ? height:"h-screen"} `}>
      <p>Loading...</p>
    </div>
  );
}
