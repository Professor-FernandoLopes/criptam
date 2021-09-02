import {FaGoogle} from 'react-icons/fa'

import styles from './styles.module.scss'
import {FiX} from 'react-icons/fi'
// useSession retorna informação sobre se o usuário tem ou não uma sessão ativa
import{signIn, signOut, useSession} from 'next-auth/client'

export function SignInButton() {

// verificar se o usuário está logado
/* a informação sobre se o usuário está logado ou não precisa ser compartilhada com todas os
componentes e o next usa o context api para isso.
Serve para verificar se o usuário tem uma sessão ativa
*/
const [session] = useSession()


// se o usuário tem uma sessão, mostra o botão com as informações do usuário.
return session ?(

<button type="button" 
className={styles.signInButton}
onClick = {()=> signOut()}
>



<FaGoogle color="#04d361"/>
{session.user.name}
<FiX color="#a52716" className={styles.closeIcon}/>
</button>

):

// do contrário mostra o botão de logar
( 

<button type="button" 
className={styles.signInButton}
// pode alterar o provedor
onClick = {()=> signIn('google')}
>
<FaGoogle color="#3528af"/>
Sign in with Google
</button>

);
}