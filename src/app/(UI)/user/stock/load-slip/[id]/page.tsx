import TripSheet from "@/app/(UI)/user/stock/_UI/trip-sheet";

export default function Home({
  searchParams,
  params,
}: {
  params: { id: string };
  searchParams: { mode?: "add" | "edit" };
}) {
  const mode = searchParams.mode as "add" | "edit";
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <TripSheet key={params.id} loadSlipId={params.id} mode={mode} />
    </main>   
  );
}
