import { connect , JSONCodec, NatsConnection } from 'nats';

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
        throw error
        // return this.responseMaker.responseError(500, error.message);    // !!! A voir quand erreur de serveur, ça crash
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
        throw error
        // return this.responseMaker.responseError(500, error.message);
    }
}

export async function publishMessage(subject: string, data: any): Promise<void> {
    try {
        const nats = await createNatsConnection(); // Assurez-vous que createNatsConnection renvoie la connexion correcte
    // Publiez le message sur le sujet spécifié
        nats.publish(subject, JSON.stringify(data));
        console.log(`Message publié sur le sujet ${subject} :`, data);
        return data
    } catch (error) {
        console.error('Erreur lors de la publication du message NATS :', error);
        throw error
        // return this.responseMaker.responseError(500, error.message);
    } 
}

export async function requestMessage(subject: string, data: any): Promise<any> {
    try {
        const nats = await createNatsConnection(); // Assurez-vous que createNatsConnection renvoie la connexion correcte
    // create a codec
        const jc = JSONCodec();
        let result : any

    // Publiez le message sur le sujet spécifié
        let response = await nats
        .request(subject,jc.encode({id:"123465", data}), { timeout: 5000 })
        .then((m) => {
            result = jc.decode(m.data);
            return result;
        })
        .catch((err) => {
            console.log("err", err)
        });
    // return response
        return response?.response
    } catch (error) {
        console.error('Erreur lors de la publication du message NATS :', error);
        throw error
        // return this.responseMaker.responseError(500, error.message);
    }
}
  


