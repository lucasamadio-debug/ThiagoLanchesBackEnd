import { Product } from "../entities/Product"
import pool  from "../config/database"
import { RowDataPacket } from "mysql2"

interface ProductRow extends RowDataPacket {
    id: number;
    nome: string;
    preco: number;
    popular: number;
    ingredientes: string | null;
    categoria: string;

}

export class ProductRepository {
    async findAll():Promise<Product[]> {
        const sql = "select p.id_produto as id, p.nome_lanches as nome, p.preco, p.popular, p.ingredientes, c.nome_categoria as categoria from produto as p inner join categoria as c on p.id_categoria = c.id_categoria"
        const [rows] = await pool.query<ProductRow[]>(sql);
        return rows.map((row) => {
            return new Product(
                row.id,
                row.nome,
                row.preco,
                row.popular === 1,
                row.ingredientes ?? "",
                row.categoria
            )
        });
    }
}