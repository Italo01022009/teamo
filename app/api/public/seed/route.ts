import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function GET() { return seedDemo(); }
export async function POST() { return seedDemo(); }

async function seedDemo() {
  try {
    const PRO_EMAIL = "profissional@demo.com";
    const RES_EMAIL = "responsavel@demo.com";
    const PASS = "demo123";

    async function ensureUser(email: string, nome: string, tipo: "profissional" | "responsavel") {
      const list = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (list.error) throw list.error;
      const existing = list.data.users.find((u) => u.email === email);
      if (existing) return existing.id;
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email, password: PASS, email_confirm: true, user_metadata: { nome, tipo },
      });
      if (error) throw error;
      return data.user!.id;
    }

    const proId = await ensureUser(PRO_EMAIL, "Dra. Ana Souza", "profissional");
    const resId = await ensureUser(RES_EMAIL, "Mariana (mae)", "responsavel");

    await supabaseAdmin.from("profiles").upsert([
      { id: proId, nome: "Dra. Ana Souza", email: PRO_EMAIL, tipo: "profissional" },
      { id: resId, nome: "Mariana (mae)", email: RES_EMAIL, tipo: "responsavel" },
    ]);

    return Response.json({ ok: true, proId, resId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "erro";
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
