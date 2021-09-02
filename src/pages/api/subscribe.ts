// aqui é o server side que vai receber a requisição da api.
// e vai se comunicar com o mundo externo, ou seja, o stripe.
// tenho também elementos para fazer a autenticação.
/* Isto é fantástico. Aqui eu tenho um server que pode fazer
inclusive requisições para um banco de dados */
/* todos os arquivos inseridos dentro da pasta api dentro de pages são transformados
em rotas da minha api, do meu backend
*/ 
import {NextApiRequest, NextApiResponse} from 'next'
import {stripe} from '../../services/stripe'
import {query as q} from 'faunadb'

// para pegar a sessão do usuário dos cookies
import {getSession} from 'next-auth/client' 
import { fauna } from '../../services/fauna'
// localstorage só funciona no front, cookies funcionam no front e back
type User = {
    ref: {
        id:string;
    }
    data: {
        stripe_customer_id: string;
    }
}


export default async (req:NextApiRequest, res: NextApiResponse) => {
/* se a requisição for do tipo post eu crio uma sessão do stripe
do contrário (else) método não permitido (405)
*/
if(req.method === 'POST') {

// dentro do req tem os cookies de onde ele vai conseguir pegar a sessão do usuário
const session = await getSession({req})
const user = await fauna.query<User>(
q.Get(
q.Match(
q.Index('user_by_email'),
q.Casefold(session.user.email)

)
)
)

let customerId = user.data.stripe_customer_id

if(!customerId){
    
    // com os dados do customer eu preciso cadastrar ele no stripe
    const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata
        })
        await fauna.query(
            q.Update(
            q.Ref(q.Collection('users'),user.ref.id),
            {
                data: {
                    stripe_customer_id: stripeCustomer.id
                }
            }
            )
            ) // este é o id do customer no stripe
            customerId= stripeCustomer.id
}


// aqui cria a sessão
const stripeCheckoutSession = await stripe.checkout.sessions.create({
// aqui é o id do customer lá no stripe
customer: customerId,
payment_method_types:['card'],
// aqui é o endereço da pessoa
billing_address_collection: 'required',

// quais os items
line_items: [{
price: "price_1JJvVjIH7ycrfAqNDXK2qVVd",
quantity:1
}],

// pode ser subscription
mode:"payment",
allow_promotion_codes: true,
// para onde o usuário é redirecionado se ele efetua o pagamento
success_url: process.env.STRIPE_SUCCESS_URL,
// para onde ele vai se não conseguir efetuar o pagamento
cancel_url: process.env.STRIPE_CANCEL_URL

})
return res.status(200).json({sessionId: stripeCheckoutSession.id})
}

else {
res.setHeader('allow', 'POST')
res.status(405).end('Method not allowed')
}
}