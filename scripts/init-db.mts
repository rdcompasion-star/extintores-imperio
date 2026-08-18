// Se ejecuta una sola vez, en un solo proceso, antes de "next dev"/"next build".
// Evita que varios workers de Next intenten crear/migrar la misma base SQLite
// al mismo tiempo (causaba SQLITE_BUSY en Windows).
import "../src/lib/db";
import { ensureSeeded } from "../src/lib/seed";
import { ensureAdminUser } from "../src/lib/auth";

ensureSeeded();
await ensureAdminUser();

// eslint-disable-next-line no-console
console.log("Base de datos lista.");
