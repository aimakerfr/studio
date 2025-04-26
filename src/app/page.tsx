
import CustomizationForm from "@/components/customization-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="text-center mb-12 px-4">
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent-foreground to-secondary-foreground">
           Starter Pack Customizer
         </h1>
         <p className="text-lg text-muted-foreground">
            Bring your action figure ideas to life!
         </p>
      </div>
      <CustomizationForm />
    </main>
  );
}
