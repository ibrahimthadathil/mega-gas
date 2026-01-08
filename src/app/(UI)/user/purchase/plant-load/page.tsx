  import PlantLoadSection from "@/app/(UI)/user/purchase/_UI/plant-load";

  export  default function Home({ searchParams }: {searchParams:{id:string}}) {
    const recordId =  searchParams?.id;

    return (
      <main className="min-h-screen bg-background p-3 md:p-8">
        <PlantLoadSection recordId={recordId} />
      </main>
    );
  }
