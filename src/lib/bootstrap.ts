import "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { ensureAdminUser } from "@/lib/auth";

ensureSeeded();
await ensureAdminUser();
