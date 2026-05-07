import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

async function authorizeEmail(formData: FormData) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  
  const email = formData.get("email") as string;
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({ where: { email }, data: { isAuthorized: true } });
  } else {
    await prisma.user.create({ data: { email, isAuthorized: true, role: "JUDGE" } });
  }
  revalidatePath("/admin/users");
}

async function removeAuth(email: string) {
  "use server";
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");
  
  await prisma.user.update({ where: { email }, data: { isAuthorized: false } });
  revalidatePath("/admin/users");
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" }
  });

  return (
    <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-black mb-8 tracking-widest uppercase text-white drop-shadow-[0_0_10px_rgba(225,0,0,0.5)]">
        Gestión de Jurados
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-card border border-border p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider text-primary">Invitar Jurado</h2>
            <form action={authorizeEmail} className="flex flex-col gap-4">
              <Input name="email" type="email" label="Correo Electrónico" required />
              <Button type="submit" className="mt-2">Autorizar</Button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left">
              <thead className="bg-black/50 border-b border-border">
                <tr>
                  <th className="p-4 text-xs tracking-widest uppercase text-zinc-400 font-bold">Email</th>
                  <th className="p-4 text-xs tracking-widest uppercase text-zinc-400 font-bold">Estado</th>
                  <th className="p-4 text-xs tracking-widest uppercase text-zinc-400 font-bold text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => {
                  const removeAuthWithEmail = removeAuth.bind(null, u.email!);
                  return (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 font-mono text-sm">{u.email}</td>
                      <td className="p-4">
                        {u.isAuthorized || u.role === "ADMIN" ? (
                          <span className="text-green-500 text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]">Autorizado</span>
                        ) : (
                          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Pendiente</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {(u.isAuthorized && u.role !== "ADMIN") && (
                          <form action={removeAuthWithEmail}>
                            <Button variant="danger" size="sm">Revocar</Button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-zinc-500 uppercase tracking-widest text-xs font-bold">No hay usuarios registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
