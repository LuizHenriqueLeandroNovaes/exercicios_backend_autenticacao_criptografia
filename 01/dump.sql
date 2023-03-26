-- 1 - Deverá existir um banco de dados 
--chamado `catalogo_pokemons` com as tabelas
-- descritas abaixo e todo código de criação
-- das tabelas deverá se colocado no arquivo 
--`dump.sql`

create database catalogo_pokemons;

-- a) Tabela `usuarios` com os campos:

-- - id - identificador único do usuário 
--como chave primaria e auto incremento;
-- - nome - (obrigatório)
-- - email - (obrigatório e único)
-- - senha - (obrigatório)

create table usuarios (
    id serial primary key ,
    nome text not null ,
    email text not null unique ,
    senha text not null 
);

-- b) Tabela `pokemons` com os campos

-- - id - identificador único do pokemon 
-- como chave primaria e auto incremento;
-- - usuario_id - (obrigatório)
-- - nome - (obrigatório)
-- - habilidades - (obrigatótio)
-- - imagem
-- - apelido

create table pokemons (
    id serial primary key ,
    nome text not null ,
    habilidades text not null ,
    imagem text ,
    apelido text ,
    usuario_id integer not null references usuarios(id) 
);

