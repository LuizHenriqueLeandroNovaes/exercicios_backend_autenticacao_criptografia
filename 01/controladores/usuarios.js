const bcrypt = require('bcrypt');
const pool = require('../conexao');
const senhaJwt = require('../senhaJwt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req , res) => {

    const {nome, email, senha} = req.body;

    try {
        const emailExiste = await pool.query(
            'select * from usuarios where email = $1'
            , [email]
        );

        if(emailExiste.rowCount > 0){
            return res.status(400).json(
                {mensagem: 'Email já existe'}
            );
        }
        
        const senhaCriptografada = await bcrypt.hash(senha,10);

        const query = `
        insert into usuarios (nome, email, senha)
        values ($1, $2, $3) returning *
        `
        const {rows} = await pool.query(query,[nome, email, senhaCriptografada]);    

        const{senha: _, ...usuario} = rows;
        
        return res.status(201).json(usuario);
    } catch (error) {
        return res.status(500).json(
            {mensagem: 'Erro interno do serviço'}
        );  
    }

}


const login = async (req , res) => {

    const {email, senha} = req.body;

    try {
        
        const { rows , rowCount } = await pool.query(
            'select * from usuarios where email = $1'
            , [email]
        );

        const { senha: senharows , ...usuario } = rows[0];

        
        
        if(rowCount === 0){
            return res.status(400).json(
                {mensagem: 'Email ,ou senha inválida'}
            );
        }
        
        const senhaCorreta = await bcrypt.compare(senha,senharows);
        
        if(!senhaCorreta){
            return res.status(400).json(
                {mensagem: 'Email ,ou senha inválida'}
                );
            }
            
            
            const token = jwt.sign({ id: usuario.id}, senhaJwt,{expiresIn: '8h'});
            console.log("chegou aqui !!!!!!!!!!");
        
        return res.json({
            usuario,
            token
        });

    } catch (error) {
        return res.status(500).json(
            {mensagem: 'Erro interno do serviço'}
        );  
    }

}

module.exports = {
    cadastrarUsuario,
    login
}

