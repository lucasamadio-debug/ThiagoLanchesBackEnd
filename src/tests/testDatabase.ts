import pool from "../config/database";

async function testConnection() {
    try {
        await pool.query("SELECT 1");
        console.log("MySQL conectado com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao MySQL:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

testConnection();