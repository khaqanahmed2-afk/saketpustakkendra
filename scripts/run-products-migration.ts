import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        console.log("Connecting to database...");
        await client.connect();

        console.log("Running products table migration...");

        const migrationSQL = fs.readFileSync(
            path.join(__dirname, "..", "migrations", "0003_create_products_table.sql"),
            "utf-8"
        );

        await client.query(migrationSQL);

        console.log("✅ Migration completed successfully!");
        console.log("Products table created with all required columns.");

    } catch (error) {
        console.error("❌ Migration failed:", error.message);
        throw error;
    } finally {
        await client.end();
    }
}

runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
