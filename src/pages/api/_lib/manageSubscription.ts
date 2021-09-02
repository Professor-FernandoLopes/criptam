import { query as q } from 'faunadb';

import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

// buscar o usuário no banco do fauna com o id customer id
// para eu conseguir buscar um usuário pelo stripe customer id eu preciso criar um índice
// salvar os dados da subscription do usuário no fauna db

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  const userRef = await fauna.query(
    q.Select(
      'ref',
      q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId)),
    ),
  );

  // busca os dados da subinscrição do usuário no stripe.
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  // se for uma create action então cria uma nova subscription
  // se estiver criando uma subscription basicamente salva ela no banco
  // do contrário
  if (createAction) {
    await fauna.query(
      q.Create(q.Collection('subscriptions'), { data: subscriptionData }),
    );
  } else {
    // atualiza a subscription existente
    await fauna.query(
      /* o replace substitui a subscription por completo
      para tanto é preciso passar a ref da subscription
      
      Vai ter que criar um índice no fauna para conseguir buscar a subscription pelo id dela.
      */
      q.Replace(
       /* buscar apenas um campo que é a ref de um registro que faz match com o índice
       subscription_by_id e passa o id da subscription
       */
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('subscription_by_id'), subscriptionId)),
        ),
        // como segundo parâmetro do replace eu vou passar quais dados eu quero atualizar
        { data: subscriptionData },
      ),
    );
  }
}