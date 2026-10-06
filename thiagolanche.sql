-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 14/09/2026 às 05:16
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `thiagolanche`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nome_categoria` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nome_categoria`) VALUES
(1, 'PRENSADOS'),
(2, 'HOT DOGS'),
(3, 'LANCHES GOURMET'),
(9, 'BEBIDAS');

-- --------------------------------------------------------

--
-- Estrutura para tabela `estoque`
--

CREATE TABLE `estoque` (
  `id_estoque` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estoque`
--

INSERT INTO `estoque` (`id_estoque`, `id_produto`, `quantidade`) VALUES
(32, 39, 20),
(33, 40, 8),
(34, 41, 10),
(35, 42, 15),
(36, 43, 10),
(37, 44, 12);

--
-- Acionadores `estoque`
--
DELIMITER $$
CREATE TRIGGER `trg_estoque_quantidade_positiva` BEFORE UPDATE ON `estoque` FOR EACH ROW BEGIN
    IF NEW.quantidade < 0 THEN
        SET NEW.quantidade = 0;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `ingredientes`
--

CREATE TABLE `ingredientes` (
  `id_ingredientes` int(11) NOT NULL,
  `nome_ingrediente` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `ingredientes`
--

INSERT INTO `ingredientes` (`id_ingredientes`, `nome_ingrediente`) VALUES
(1, 'Pão'),
(2, 'Queijo'),
(3, 'Presunto'),
(4, 'Tomate'),
(5, 'Alface'),
(6, 'Hamburguer'),
(7, 'Bacon'),
(8, 'Frango'),
(9, 'Catupiry'),
(10, 'Cheddar'),
(11, 'Salsicha'),
(12, 'Milho'),
(13, 'Batata palha'),
(14, 'Calabresa'),
(15, 'Egg'),
(16, 'Pão brioche'),
(17, 'Molho da casa'),
(18, 'Cebola roxa');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `id_produto` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `nome_lanches` varchar(100) NOT NULL,
  `preco` float(10,2) NOT NULL,
  `popular` tinyint(1) DEFAULT 0,
  `ingredientes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`id_produto`, `id_categoria`, `nome_lanches`, `preco`, `popular`, `ingredientes`) VALUES
(1, 1, 'x-salada', 22.00, 0, 'Pão, queijo, presunto, tomate, hamburguer e alface'),
(2, 1, 'x-bacon', 30.00, 0, 'Pão, queijo, presunto, tomate, hamburguer, bacon e alface'),
(3, 1, 'x-tudo', 55.00, 0, 'Frango, bacon, milho, catupiry, cheddar, tomate, alface, salamesa e bacon'),
(4, 1, 'x-calabresa', 30.00, 0, 'Pão, queijo, presunto, tomate, hamburguer, calabresa e alface'),
(5, 1, 'x-frango', 29.00, 0, 'Pão, salsicha, frango, tomate, hamburguer e alface'),
(6, 1, 'x-frango-catupiry', 33.00, 0, 'Pão, salsicha, frango, tomate, hamburguer, alface e catupiry'),
(7, 1, 'x-frango-cheddar', 33.00, 0, 'Pão, salsicha, frango, tomate, hamburguer, alface e cheddar'),
(8, 1, 'x-itapema', 23.00, 0, 'Pão, queijo, presunto, tomate, hamburguer, batata palha e alface'),
(9, 2, 'dog Carne', 22.00, 0, 'Pão, salsicha, carne e batata palha'),
(10, 2, 'dog Bacon', 27.00, 0, 'Pão, 2 salsichas, milho, queijo, tomate, bacon e batata palha'),
(11, 2, 'dog-misto', 24.00, 0, 'Pão, salsichas, carne, frango e batata palha'),
(12, 2, 'dog-calabresa', 27.00, 0, 'Pão, salsicha, milho, queijo, tomate, calabresa e batata palha'),
(13, 2, 'dog-frango', 22.00, 0, 'Pão, 2 salsichas, frango e batata palha'),
(14, 2, 'dog-egg-calabresa', 30.00, 0, 'Pão, 2 salsichas, milho, queijo, tomate, calabresa, 2 eggs e batata palha'),
(15, 3, 'gourme-cheddar', 30.00, 0, 'Pão brioche, hamburguer, queijo, tomate, alface, cheddar, molho da casa e cebola roxa'),
(16, 3, 'gourmet-triplo-bacon', 28.00, 0, 'Pão brioche, hamburguer, queijo, tomate, alface, bacon, molho da casa e cebola roxa'),
(17, 3, 'gourmet-da-casa', 22.00, 0, 'Pão brioche, hamburguer, queijo, tomate, alface, molho da casa e cebola roxa'),
(18, 3, 'smash Burguer', 16.00, 0, 'Pão brioche, hamburguer e queijo'),
(37, 1, 'x-tudo-dobro', 65.00, 0, NULL),
(39, 9, 'Coca-Cola Lata', 6.00, 0, 'Refrigerante 350ml'),
(40, 9, 'Guaraná Lata', 6.00, 0, 'Refrigerante 350ml'),
(41, 9, 'Suco Natural', 8.00, 0, 'Suco de fruta natural 300ml'),
(42, 9, 'Água Mineral', 4.00, 0, 'Água mineral 500ml'),
(43, 9, 'coca cola 1L', 12.00, 0, NULL),
(44, 9, 'coca cola 2l', 15.00, 0, NULL);

--
-- Acionadores `produto`
--
DELIMITER $$
CREATE TRIGGER `trg_produto_cria_estoque` AFTER INSERT ON `produto` FOR EACH ROW BEGIN
    DECLARE v_nome_categoria VARCHAR(100);

    SELECT nome_categoria INTO v_nome_categoria
    FROM categoria
    WHERE id_categoria = NEW.id_categoria;

    IF UPPER(v_nome_categoria) = 'BEBIDAS' THEN
        INSERT INTO estoque (id_produto, quantidade) VALUES (NEW.id_produto, 0);
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_produto_preco_positivo` BEFORE UPDATE ON `produto` FOR EACH ROW BEGIN
    SET NEW.preco = ABS(NEW.preco);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto_ingredientes`
--

CREATE TABLE `produto_ingredientes` (
  `id_produto` int(11) NOT NULL,
  `id_ingredientes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto_ingredientes`
--

INSERT INTO `produto_ingredientes` (`id_produto`, `id_ingredientes`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 6),
(2, 7),
(3, 4),
(3, 5),
(3, 7),
(3, 8),
(3, 9),
(3, 12),
(3, 14),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(4, 6),
(4, 14),
(5, 1),
(5, 4),
(5, 5),
(5, 6),
(5, 8),
(5, 11),
(6, 1),
(6, 4),
(6, 6),
(6, 8),
(6, 9),
(6, 11),
(7, 1),
(7, 4),
(7, 6),
(7, 8),
(7, 10),
(7, 11),
(8, 1),
(8, 2),
(8, 3),
(8, 4),
(8, 6),
(8, 13),
(9, 1),
(9, 6),
(9, 11),
(9, 13),
(10, 1),
(10, 7),
(10, 11),
(10, 13),
(11, 1),
(11, 6),
(11, 8),
(11, 11),
(11, 13),
(12, 1),
(12, 11),
(12, 12),
(12, 13),
(12, 14),
(13, 1),
(13, 8),
(13, 11),
(13, 13),
(14, 1),
(14, 11),
(14, 12),
(14, 13),
(14, 14),
(14, 15),
(15, 2),
(15, 4),
(15, 5),
(15, 6),
(15, 10),
(15, 16),
(15, 17),
(15, 18),
(16, 2),
(16, 4),
(16, 5),
(16, 6),
(16, 7),
(16, 16),
(16, 17),
(16, 18),
(17, 2),
(17, 4),
(17, 5),
(17, 6),
(17, 16),
(17, 17),
(17, 18),
(18, 2),
(18, 6),
(18, 16);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nome`, `email`, `senha`) VALUES
(1, 'Admin', 'adminthiagolanches@gmail.com', '123456'),
(5, 'luna', 'luna@gmail.com', '$2y$10$IGVeuW8yG.ZAMPJ2vOgKou8FBM2.jW2XxODcKrroRVP..1LgB/Z0i');

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_cardapio_completo`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_cardapio_completo` (
`id_produto` int(11)
,`nome_lanches` varchar(100)
,`preco` float(10,2)
,`popular` tinyint(1)
,`ingredientes` text
,`id_categoria` int(11)
,`nome_categoria` varchar(100)
,`quantidade_estoque` int(11)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_estatisticas_categoria`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_estatisticas_categoria` (
`id_categoria` int(11)
,`nome_categoria` varchar(100)
,`total_produtos` bigint(21)
,`preco_medio` double(14,6)
,`preco_maximo` float(10,2)
,`preco_minimo` float(10,2)
,`total_em_estoque` decimal(32,0)
);

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vw_produtos_acima_media`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vw_produtos_acima_media` (
`id_produto` int(11)
,`nome_lanches` varchar(100)
,`preco` float(10,2)
,`nome_categoria` varchar(100)
);

-- --------------------------------------------------------

--
-- Estrutura para view `vw_cardapio_completo`
--
DROP TABLE IF EXISTS `vw_cardapio_completo`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_cardapio_completo`  AS SELECT `p`.`id_produto` AS `id_produto`, `p`.`nome_lanches` AS `nome_lanches`, `p`.`preco` AS `preco`, `p`.`popular` AS `popular`, `p`.`ingredientes` AS `ingredientes`, `c`.`id_categoria` AS `id_categoria`, `c`.`nome_categoria` AS `nome_categoria`, coalesce(`e`.`quantidade`,0) AS `quantidade_estoque` FROM ((`produto` `p` join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) left join `estoque` `e` on(`e`.`id_produto` = `p`.`id_produto`)) ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_estatisticas_categoria`
--
DROP TABLE IF EXISTS `vw_estatisticas_categoria`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_estatisticas_categoria`  AS WITH stats AS (SELECT `produto`.`id_categoria` AS `id_categoria`, count(0) AS `total_produtos`, avg(`produto`.`preco`) AS `preco_medio`, max(`produto`.`preco`) AS `preco_maximo`, min(`produto`.`preco`) AS `preco_minimo` FROM `produto` GROUP BY `produto`.`id_categoria`), estoque_por_produto AS (SELECT `estoque`.`id_produto` AS `id_produto`, `estoque`.`quantidade` AS `quantidade` FROM `estoque`)  SELECT `c`.`id_categoria` AS `id_categoria`, `c`.`nome_categoria` AS `nome_categoria`, `s`.`total_produtos` AS `total_produtos`, `s`.`preco_medio` AS `preco_medio`, `s`.`preco_maximo` AS `preco_maximo`, `s`.`preco_minimo` AS `preco_minimo`, coalesce((select sum(`e`.`quantidade`) from (`estoque_por_produto` `e` join `produto` `p` on(`p`.`id_produto` = `e`.`id_produto`)) where `p`.`id_categoria` = `c`.`id_categoria`),0) AS `total_em_estoque` FROM (`categoria` `c` join `stats` `s` on(`c`.`id_categoria` = `s`.`id_categoria`)) ORDER BY `c`.`id_categoria` ASC`id_categoria`  ;

-- --------------------------------------------------------

--
-- Estrutura para view `vw_produtos_acima_media`
--
DROP TABLE IF EXISTS `vw_produtos_acima_media`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_produtos_acima_media`  AS SELECT `p`.`id_produto` AS `id_produto`, `p`.`nome_lanches` AS `nome_lanches`, `p`.`preco` AS `preco`, `c`.`nome_categoria` AS `nome_categoria` FROM (`produto` `p` join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) WHERE `p`.`preco` > (select avg(`produto`.`preco`) from `produto`) ORDER BY `p`.`preco` DESC ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Índices de tabela `estoque`
--
ALTER TABLE `estoque`
  ADD PRIMARY KEY (`id_estoque`),
  ADD UNIQUE KEY `uk_estoque_produto` (`id_produto`);

--
-- Índices de tabela `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`id_ingredientes`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`id_produto`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Índices de tabela `produto_ingredientes`
--
ALTER TABLE `produto_ingredientes`
  ADD PRIMARY KEY (`id_produto`,`id_ingredientes`),
  ADD KEY `id_ingredientes` (`id_ingredientes`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `estoque`
--
ALTER TABLE `estoque`
  MODIFY `id_estoque` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de tabela `ingredientes`
--
ALTER TABLE `ingredientes`
  MODIFY `id_ingredientes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `id_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `estoque`
--
ALTER TABLE `estoque`
  ADD CONSTRAINT `fk_estoque_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`) ON DELETE CASCADE;

--
-- Restrições para tabelas `produto`
--
ALTER TABLE `produto`
  ADD CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Restrições para tabelas `produto_ingredientes`
--
ALTER TABLE `produto_ingredientes`
  ADD CONSTRAINT `produto_ingredientes_ibfk_1` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`),
  ADD CONSTRAINT `produto_ingredientes_ibfk_2` FOREIGN KEY (`id_ingredientes`) REFERENCES `ingredientes` (`id_ingredientes`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
