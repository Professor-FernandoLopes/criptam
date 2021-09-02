// as imagens ficam dentro do public
// não precisa importar

import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink'
export default function Header(){




return(

<header className={styles.headerContainer}>

<div className={styles.headerContent}>

<nav>
<ActiveLink activeClassName={styles.active} href="/"> 
<a> Home</a>
</ActiveLink>
<ActiveLink activeClassName={styles.active} href="/posts"> 
<a> Posts</a>
</ActiveLink>
</nav>

<SignInButton/>
</div>

</header>


)


}