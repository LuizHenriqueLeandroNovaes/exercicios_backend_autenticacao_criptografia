const pool = require('../conexao');

const cadastrarPokemon = async (req,res) => {

    const {nome, apelido, habilidades, imagem} = req.body;
    
    try {
        
        const query = `
        insert into pokemons (usuario_id, nome, apelido, habilidades, imagem)
        values ($1 , $2 , $3 , $4 , $5)
        `;
        
        const params = [req.usuario.id,nome , apelido, habilidades,imagem];
        
        const {rows} = await pool.query(query,params);
        
        return res.status(201).json(rows[0]);
    
} catch (error) {
    return res.status(500).json(
        {mensagem: 'Erro interno do servidor'}
    );
    
  }
}

const atualizarApelidoPokemon = async (req,res) => {

    const {apelido} = req.body;
    const {id} = req.params;
    
    try {
        
        const {rowCount} = await pool.query( `
        select * from pokemons where id = $1 and usuario_id = $2 `,
        [id, req.usuario.id]
        );

        if(cadastrarPokemon.rowCount === 0){
            return res.status(404).json({mensagem: 'Pokemon não existe'});
        }
        
        const queryAtualizar = `
        update pokemons set apelido = $1 where id = $2`;

        const {rows} = await pool.query(queryAtualizar,[apelido,id]);
        
    return res.status(201).json(rows[0]);
    
} catch (error) {
    return res.status(500).json(
        {mensagem: 'Erro interno do servidor'}
    );
    
  }
}

const listarPokemons = async (req,res) => {
    
    try {
        
        const {rows: pokemons} = await pool.query(`
            select id, nome, habilidades, apelido, imagem from pokemons where usuario_id = $1`,
            [req.usuario.id]
            );
      
        for (const pokemon of pokemons) {
            pokemon.habilidades = pokemon.habilidades.split(', ');
            pokemon.usuario = req.usuario.nome;
        }

    return res.json(pokemons);
    
} catch (error) {
    return res.status(500).json(
        {mensagem: 'Erro interno do servidor'}
    );
    
  }
}

const detalharPokemon = async (req,res) => {

    const {id}  = req.params;
    
    try {
        
        const {rows, rowCount} = await pool.query(`
            select * from pokemons where id = $1 and usuario_id = $2`,
            [id, req.usuario.id]
        );

        if(rowCount === 0){
            return res.status(404).json(
                {mensagem: 'Pokemon não existe'}
            );
        } 
        
        const pokemon = rows[0];
      
        pokemon.habilidades = pokemon.habilidades.split(', ');
        pokemon.usuario = req.usuario.nome;

        return res.json(pokemon);
    
} catch (error) {
    return res.status(500).json(
        {mensagem: 'Erro interno do servidor'}
    );
    
  }
}

const excluirPokemon = async (req,res) => {

    const {id} = req.params;
    
    try {
        
        const {rows , rowCount} = await pool.query(
            `select id, nome, habilidades, apelido, imagem from pokemons where id = $1 and usuario_id = $2`,
            [id, req.usuario.id]
        )
        
        if (rowCount === 0){
            return req.status(404).json(
                {mensagem: 'Pokemon não exite'
            });
        }

        await pool.query(`delete from pokemons where id = $1`,[id]);
        
        return res.status(200).json();
} catch (error) {
    return res.status(500).json(
        {mensagem: 'Erro interno do servidor'}
    );
    
  }
}



module.exports = {
    cadastrarPokemon,
    atualizarApelidoPokemon,
    listarPokemons,
    detalharPokemon,
    excluirPokemon
}