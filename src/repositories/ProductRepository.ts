import { Product } from "../entities/Product"
import pool  from "../config/database"
import { RowDataPacket } from "mysql2"
import type { ResultSetHeader } from "mysql2";

interface ProductRow extends RowDataPacket {
    id: number;
    nome: string;
    preco: number;
    popular: number;
    ingredientes: string | null;
    categoria: string;

}

interface IngredientNameRow extends RowDataPacket {
    id_ingredientes: number;
    nome_ingrediente: string;
}

interface CountRow extends RowDataPacket {
    total: number;
}

export interface IngredienteProduto {
    id_ingrediente: number;
    quantidade: number;
}

interface ReceitaRow extends RowDataPacket {
    id_categoria: number;
    id_ingrediente: number | null;
    quantidade: number | null;
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

    async findById(id: number): Promise<Product | null> {
        const sql = "select p.id_produto as id, p.nome_lanches as nome, p.preco, p.popular, p.ingredientes, c.nome_categoria as categoria from produto as p inner join categoria as c on p.id_categoria = c.id_categoria where p.id_produto = ?"
        const [rows] = await pool.query<ProductRow[]>(sql, [id])
        if (rows.length === 0) {
            return null;
        }

        const produto = new Product(
            rows[0].id,
            rows[0].nome,
            rows[0].preco,
            rows[0].popular === 1,
            rows[0].ingredientes ?? "",
            rows[0].categoria,
        )

        return produto;
    }

    
    async create(nome: string, preco: number, popular: boolean, id_categoria: number, ingredientes: IngredienteProduto[]): Promise<number> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const idsUnicos = ingredientes.map(i => i.id_ingrediente);

            const nomes = await this.findIngredientNamesByIds(idsUnicos, connection);

            if (nomes.length !== idsUnicos.length) {
                throw new Error("Um ou mais ingredientes não existem");
            }

            const descricao = nomes.join(", ");

            const sql = `insert into produto (nome_lanches, preco, popular, id_categoria, ingredientes) values (?, ?, ?, ?, ?)`;

            const [result] = await connection.execute<ResultSetHeader>(sql, [nome, preco, popular ? 1 : 0, id_categoria, descricao]);

            const idProduto = result.insertId;

            for (const ingrediente of ingredientes) {
                await connection.execute(`insert into produto_ingredientes (id_produto, id_ingredientes, quantidade) values (?, ?, ?)`, [idProduto, ingrediente.id_ingrediente, ingrediente.quantidade]);
            }

            await connection.commit();

            return idProduto;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }


    async update(id: number, nome: string, preco: number, popular: boolean, id_categoria: number, ingredientes: IngredienteProduto[]): Promise<boolean> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [produtos] = await connection.query<RowDataPacket[]>("select id_produto from produto where id_produto = ? for update",[id]);

            if (produtos.length === 0) {
                await connection.rollback();
                return false;
            }

            const idsUnicos = ingredientes.map(i => i.id_ingrediente);

            const nomes = await this.findIngredientNamesByIds(idsUnicos, connection);

            if (nomes.length !== idsUnicos.length) {
                throw new Error("Um ou mais ingredientes não existem");
            }

            const descricao = nomes.join(", ");

            const sql = `update produto set nome_lanches = ?, preco = ?, popular = ?, id_categoria = ?, ingredientes = ? where id_produto = ?`;

            await connection.execute<ResultSetHeader>(sql, [nome, preco, popular ? 1 : 0, id_categoria, descricao, id]);

            await connection.execute("delete from produto_ingredientes where id_produto = ?", [id]);

            for (const ingrediente of ingredientes) {
                await connection.execute(`INSERT INTO produto_ingredientes (id_produto, id_ingredientes, quantidade) VALUES (?, ?, ?)`, [id, ingrediente.id_ingrediente, ingrediente.quantidade]);
            }

            await connection.commit();

            return true;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }
    
    
    async delete(id: number): Promise<boolean> {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [rows] = await connection.query<RowDataPacket[]>("select id_produto from produto where id_produto = ? FOR UPDATE", [id]);

            if (rows.length === 0) {
                await connection.rollback();
                return false;
            }

            await connection.execute("delete from produto_ingredientes where id_produto = ?", [id]);

            const [result] = await connection.execute<ResultSetHeader>("delete from produto where id_produto = ?", [id]);

            await connection.commit();

            return result.affectedRows > 0;

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    async findIngredientNamesByIds(ids: number[], connection: Awaited<ReturnType<typeof pool.getConnection>>): Promise<string[]> {
        if (ids.length === 0) {
            return [];
        }

        const placeholders = ids.map(() => "?").join(", ");
        const sql = `select id_ingredientes, nome_ingrediente from ingredientes where id_ingredientes in (${placeholders})`;
        const [rows] = await connection.query<IngredientNameRow[]>(sql, ids);
        const nomesPorId = new Map<number, string>();
        rows.forEach(row => {
            nomesPorId.set(row.id_ingredientes, row.nome_ingrediente);
        });

        const nomes = ids.map(id => nomesPorId.get(id)).filter((nome): nome is string => nome !== undefined);

        return nomes;
    }

    async isUsedInStock(id: number): Promise<boolean> {
        const sql = `select count(*) as total from estoque where id_produto = ?`;

        const [rows] = await pool.query<CountRow[]>(sql, [id]);

        return rows[0].total > 0;
    }

    
    async categoryExists(id_categoria: number): Promise<boolean> {
        const sql = `select count(*) as total from categoria where id_categoria = ?`;

        const [rows] = await pool.query<CountRow[]>(sql, [id_categoria]);

        return rows[0].total > 0;
    }

    async ingredientsExist(ids: number[]): Promise<boolean> {
        const idsUnicos = [...new Set(ids)];

        if (idsUnicos.length === 0) {
            return true;
        }

        const placeholders = idsUnicos.map(() => "?").join(", ");

        const sql = `select count(*) as total from ingredientes where id_ingredientes in (${placeholders})`;

        const [rows] = await pool.query<CountRow[]>(sql, idsUnicos);

        return rows[0].total === idsUnicos.length;
    }

    
    async findRecipeByProductId(id: number): Promise<{id_categoria: number; ingredientesDetalhados: IngredienteProduto[]; }> {
        const sql = `select p.id_categoria, pi.id_ingredientes AS id_ingrediente, pi.quantidade from produto p left join produto_ingredientes pi on pi.id_produto = p.id_produto where p.id_produto = ? order by pi.id_ingredientes`;
        const [rows] = await pool.query<ReceitaRow[]>(sql, [id]);

        return {
            id_categoria: rows[0].id_categoria,
            ingredientesDetalhados: rows.filter((row) => row.id_ingrediente !== null && row.quantidade !== null).map((row) => ({id_ingrediente: row.id_ingrediente!, quantidade: row.quantidade!}))
        };
    }

}   