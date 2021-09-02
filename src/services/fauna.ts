import {Client} from 'faunadb';

// serve para fazer a conexão da aplicação com o banco
export const fauna = new Client({

secret: process.env.FAUNADB_KEY
});