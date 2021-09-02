import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
// query é o "sql" do fauna
import {query as q} from 'faunadb'

// no fauna os índices são importantes porque com base neles eu busco as informações
/* aqui vai fazer a conexão do google com o fauna
por isso precisei importar o provider para ter acesso a session e o fauna
*/

import {fauna} from '../../../services/fauna'
export default NextAuth({
  // estratégias de autenticação
  // jwt(Storage)
  /* next auth (fazer autenticação com redes sociais, não querer armazenar token no backend)
    faz a autenticação pelas api routes
  */
  
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    // ...add more providers here
  ],

  //jwt:{
  //  signingKey: process.env.signingKey
 // },

  // A database is optional, but required to persist accounts in a database
 // database: process.env.DATABASE_URL,]

 /* é preciso salvar informações no banco de dados porque quando o usuário se inscrever
 no stripe eu preciso saber qual usuário se inscreveu no stripe, então eu preciso
 ter algum tipo de id desse usuário.
 Vou precisar também salvar as informações do subscription do usuário no banco
 */

 // callbacks são funções que são executadas de forma automática pelo next/auth assim que acontece alguma ação.

 callbacks: {
  async session(session) {
    try {
      const userActiveSubscription = await fauna.query(
        q.Get(
          q.Intersection([
            q.Match(
              q.Index('subscription_by_user_ref'),
              q.Select(
                'ref',
                q.Get(
                  q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email),
                  ),
                ),
              ),
            ),
            q.Match(q.Index('subscription_by_status'), 'active'),
          ]),
        ),
      );

      return {
        ...session,
        activeSubscription: userActiveSubscription,
      };
    } catch {
      return {
        ...session,
        activeSubscription: null,
      };
    }
  },
 
  // verifica se o usuário está cadastrado
 
  async signIn(user, account, profile) {
    const { email } = user;

    
    try {
      await fauna.query(
        // antes de criar a coleção verifica se já não foi criada
        q.If(
          q.Not(
            q.Exists(
              q.Match(q.Index('user_by_email'), q.Casefold(user.email)),
            ),
          ), 
          
          // se não existe cria a coleção users passando o email como data
          q.Create(q.Collection('users'), {
            data: { email },
          }),
        // se existe busca Get(como se fosse um select) o usuário
          q.Get(q.Match(q.Index('user_by_email'), q.Casefold(user.email))),
        ),
      );

      return true;
    } catch {
      return false;
    }
  },
},
});