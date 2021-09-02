
// se eu quiser que algo repita em todas as páginas coloca aqui dentro
// é recarregado toda vez que o usuário troca de tela

// engloba todos os components

// quando a página atualiza as informações do usuário da sessão
// chegarão por meio do pageProps
// Está por fora de toda a página, é o ponto de entrada da aplicação
/* Se o usuário que acessar a home ele vai acessar este componente e
a home ou outro 
component é mostrada no lugar do Component */
// a explicação está na aula configurando fonte externa

// o Header é aproveitado dentro de todas as páginas porque está dentro do App
import Header from '../components/Header/index'
import {AppProps} from 'next/app'
import '../styles/global.scss'

// o provider é para que outros componentes saibam se o usuário está ou não logado
import {Provider as NextAuthProvider} from 'next-auth/client'

/* basicamente quando é dado um f5 na página a informação se o usuário está logado
ou não é passado para a pageProps, e aí a informação está sendo repassada
para o NextAuthProvider
 */
function MyApp({Component, pageProps}:AppProps) {

return(  

/* agora com o NextAuthProvider todos os childs tem acesso a informação sobre se
o usuário está logado ou não.
quando houver o reload da página as informações sobre se o usuário está logado ou não
serão passadas pelo pageProps.session
*/
<NextAuthProvider session={pageProps.session}>

<Header/>
<Component {...pageProps}/>

</NextAuthProvider>
)
}

export default MyApp