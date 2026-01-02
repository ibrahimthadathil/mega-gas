import TripSheet from "@/app/(UI)/user/stock/_UI/trip-sheet"

export default function Home({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <TripSheet loadSlipId={params.id}/>
    </main>
  )
}


