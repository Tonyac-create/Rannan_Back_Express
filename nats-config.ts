import { connect , NatsConnection, Payload } from 'nats';

let natsConnection: NatsConnection | null = null;

export async function createNatsConnection(): Promise<NatsConnection> {
    try {
        if(!natsConnection){
            natsConnection = await connect ({
                servers: [`nats://${process.env.NATS_IP}:${process.env.NATS_PORT}`]
            })
            console.log("Connexion Nats établie avec succès")
        }
        return natsConnection
    } catch (error) {
        console.error("Erreur lors de la connexion :" , error)
        return this.responseMaker.responseError(500, error.message);
    }
}

export async function closeNatsConnection(): Promise<void> {
    try {
        if(natsConnection){
            await natsConnection.close()
            console.log("Connexion NATS fermée avec succès")
            natsConnection = null
        }
    } catch (error) {
        console.error("Erreur lors de la fermeture de la connexion NATS :" , error)
        return this.responseMaker.responseError(500, error.message);
    }
}

export async function publishMessage(subject: string, data: any): Promise<void> {
    try {
        const nats = await createNatsConnection(); // Assurez-vous que createNatsConnection renvoie la connexion correcte
    // Publiez le message sur le sujet spécifié
        nats.publish(subject, JSON.stringify(data));
        console.log(`Message publié sur le sujet ${subject} :`, data);
    } catch (error) {
        console.error('Erreur lors de la publication du message NATS :', error);
        return this.responseMaker.responseError(500, error.message);
    } 
}

    // Réception du message(en attente de Baptiste)
//   export async function requestMessage(subject: string, data: any): Promise<any> {
//     try {
//       const nats = await createNatsConnection(); // Assurez-vous que createNatsConnection renvoie la connexion correcte
//  // console.log("nats",nats)
//       // Publiez le message sur le sujet spécifié
//       console.log(`Message publié sur le sujet ${subject} :`, data);
//         const res =await nats.request(subject, JSON.stringify(data));
//       console.log("res",res)
//       //console.log("Stringify",JSON.stringify(res))
      
      
//         return res
//     } catch (error) {
//       console.error('Erreur lors de la publication du message NATS :', error);
//       throw error;
//     }
//   }
  


