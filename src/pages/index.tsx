/* antes do server side props era utilizado o useEffect e useState, 
onde dentro do useEffect ia uma função assíncrona  que fazia a requisição.
Nesse caso o useEffect substituía o componentDidMount, e o resultado era 
armazenado no state da applicação. 
*/

/*
ServerSideRendering funciona apenas em uma página.
Se um componente precisar de uma informação server side rendering,
eu preciso importar o componente na página e repassar a informação como props.
*/

/* Tudo que for retornado como props do getServerSideProps pode ser passado
para a página como props e acessado na página no browser,
ou repassado para um componente devidamente importado.
Lembrando que se esta informação for colocada dentro de getServerSideProps
ela não vai aparecer no browser, porque tal função é executada só no server.
 */
import Head from "next/head"
import { SubscribeButton } from "../components/SubscribeButton"
import styles from './home.module.scss'
//import {GetServerSideProps} from "next"
//client side
//Server side
// Static
import {GetStaticProps} from "next"
import {stripe} from '../services/stripe'

interface HomeProps{
// basicamente tenho o objeto descrito na getServerSideProps


product: {
   priceId: string;
   amount: string;
 };


}

//se o product é do tipo HomeProps então ele pode receber ter priceId e Amount
// passei o objeto/valor product no lugar da chave props e tipei ele
export default function Home({product}:HomeProps) {

return (
<>

<Head>
<title> Home|Criptam</title>
</Head>

<main className={styles.contentContainer}>

<section className={styles.hero}>
<span> 👏 Hey, Welcome </span>
<h1> News about the <span> Criptam </span> world. </h1>
<p>
Buy Cryptam <br/>
<span> for {product.amount} </span>
</p>

<SubscribeButton priceId={product.priceId}/>

</section>
<img src="/images/logo2.png" alt="girl coding"/>

</main>

</>
)
}
/* passou o priceId que veio da api stripe como props para 
o componente <SubscribeButton/> que foi importado. PriceId é do tipo string
*/
/* GetStaticProps funciona apenas para informações estáticas: 

lembra do bem vindo diego aparecendo para todos os usuários. Se for para mudar é GetServerSidePropos
*/
export const getStaticProps:GetStaticProps = async()=> {

const price = await stripe.prices.retrieve('price_1InLFhIH7ycrfAqNFQuj5bXu',
{ expand:['product'] })

const product = {
   priceId: price.id,
   amount: new Intl.NumberFormat('en-US', {
     style: 'currency',
     currency: 'EUR',
   }).format(price.unit_amount / 100),
 };

 return {
 props: {
    product,
 }, revalidate: 60 * 60 * 24, // 24horas

}

}

// props do return pode ser passado como parâmetro para a função do componente
// props funciona como se fosse uma chave
// com o expand product você consegue buscar todas as informações do produto
// retrieve é quando busca um preço apenas
// o getServerSideProps é executado no servidor node não no browser