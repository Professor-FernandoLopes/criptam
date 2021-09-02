// aqui a chamada é no front no browser só quando o usuário clica neste caso

// useSession para ver se tem uma sessão do usuário
import { useSession, signIn } from 'next-auth/client';
// descomentar abaixo para fazer acesso autenticado
//import { useRouter } from 'next/router';
import styles from './styles.module.scss';
// está importando a api no front para que esta faça a requisição ao server side
import {api} from '../../services/api'
import {getStripeJs} from '../../services/stripe-js'
import { useRouter } from 'next/router';

interface SubscribeButtonProps {

priceId:string;
}

/* recebeu a props priceId como argumento da função entre chaves
identificou o tipo por meio da interface SubscribeButtonProps
e tipou neste componente também com a interface SubscribeButtonProps.
*/

// Vai trabalhar também com a props recebida

/* operações de segurança no next apenas podem ser feitas
getServerSideProps (SSR)
getStaticProps (SSG)
os dois acima apenas quando a página está sendo renderizada

API routes
api routes depois que a página já foi renderizada
*/
export function SubscribeButton({priceId}:SubscribeButtonProps) {
const [session] = useSession()
// descomentar abaixo para fazer acesso autenticado
//const router = useRouter()

async function handleSubscribe() {

    // se não tiver sessão manda ele para o sighIn
    if(!session) {
    signIn('google')
    return;
}

// descomentar para acessar sem autenticação

/*
if (session.activeSubscription) {
    router.push('/posts');
    return;
  }

*/


try {

// aqui eu estou fazendo uma requisição para a api route subscribe
const response = await api.post('/subscribe')

const {sessionId} = response.data;

const stripe = await getStripeJs();
// sessionId vem do nosso back no front
 await stripe.redirectToCheckout({sessionId})
}
catch(err) {
    alert(err.message);
}

}

// termina handleSubscribe

return(

<button type="button"
className={styles.subscribeButton}
onClick={handleSubscribe}
>

Buy now
</button>

)


}