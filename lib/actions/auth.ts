"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";

export async function loginDemoAction(role: "ADMIN" | "MONTADOR") {
  // Pega o primeiro usuário com a role especificada
  const users = await prisma.user.findMany({ where: { role, ativo: true } });
  const user = users[0];

  if (!user) {
    redirect(`/login?erro=${encodeURIComponent("Usuário não encontrado no mock db.")}`);
  }

  await createSession({ sub: user.id, role: user.role, nome: user.nome });

  const destino = user.role === "ADMIN" ? "/admin" : "/montador";
  redirect(destino);
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
