/* Funciona de forma semelhante ao app, mas é carregado uma única vez na aplicação,
 como se fosse o html do public do react */
// nextScript tem que ficar no final de tudo.
// a explicação está na aula configurando fonte externa
// o Main substitui o id=root do html o HTML substitui o html, toda a aplicação,
// renderizada no id=root
// NextScript é onde ficam os arquivos js para a aplicação funcionar

import Document, {Html,Head,Main,NextScript} from 'next/document';

export default class Mydocument extends Document {
render() {
return(

    <Html>
   
    <Head>
    <link rel="preconnect" href="https://fonts.gstatic.com"/>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet"/>
<link rel= "shortcut icon" href="/favicon.png" type="image/png"/>

    </Head>
   
   
    <body>
    
    <Main/>
   
    <NextScript/>

    </body>


    </Html>


)


}


}