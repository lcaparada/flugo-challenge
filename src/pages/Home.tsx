import { Avatar, Button } from "@mui/material";
import { collaboratorsMock } from "@/data/collaborators";
import { CollaboratorsList } from "@/components";

export default function Home() {
  return (
    <div className="w-full bg-background min-h-screen px-8 py-6">
      <header className="items-end w-full flex justify-end">
        <Avatar alt="User" src="/static/images/avatar/1.jpg" />
      </header>

      <main className="mt-8">
        <section className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-text-primary">
            Colaboradores
          </h1>
          <Button variant="contained" color="primary">
            Novo Colaborador
          </Button>
        </section>

        <CollaboratorsList collaborators={collaboratorsMock} />
      </main>
    </div>
  );
}
