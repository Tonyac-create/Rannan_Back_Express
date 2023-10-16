import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"
import { DataController } from "./controller/DataController"
import { ContactController } from "./controller/ContactController"
import { AuthController } from "./controller/AuthController"


export const Routes = [

// ROUTES FOR AUTH------------------------------
    {
        method: "post", // Enregistrement et authentification d'un user
        route: "/auth/register",
        controller: AuthController,
        action: "register"
    },{
        method: "post", // Authentification d'un user
        route: "/auth/login",
        controller: AuthController,
        action: "login"
    },{
        method: "get", // Refresh du token user
        route: "/auth/refreshToken",
        controller: AuthController,
        action: "refreshToken"
    }, 

// ROUTES FOR USER------------------------------
    {
        method: "get", // route d'interception Middleware
        route: "/api",
        controller: UserController,
        action: "userConnected"
    },{
        method: "get", // Envoi d'un input "email" pour vérification + Envoi d'un mail pour reset password
        route: "/user/reset",
        controller: UserController,
        action: "resetPassword"
    },{
        method: "put", // Envoi d'inputs pour update user
        route: "/api/user/account",
        controller: UserController,
        action: "updateUser"
    },{
        method: "get", // Récupération de l'avatar & nickname d'un user
        route: "/api/user/profile/:id", // :id = user.id
        controller: UserController,
        action: "getProfile"
    },{
        method: "get", // Envoi d'un input pour Récupération d'un user dont le nickname est similaire.
        route: "/api/user/search",
        controller: UserController,
        action: ""
    }, 

// ROUTES FOR DATA------------------------------
    {
        method: "get", // Récupération le liste de toutes les datas que le user a enregistré
        route: "/api/datas",
        controller: DataController,
        action: ""
    },{
        method: "get", // Récupération une data via sont id
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: ""
    },{
        method: "put", // Envoi des inputs pour update une data
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: ""
    },{
        method: "delete", // Suppression d'une data via sont id
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: ""
    },{
        method: "post", // Envoi des inputs pour pour create une data
        route: "/api/data",
        controller: DataController,
        action: ""
    },{
        method: "get", // Récupération de la liste des target(user/group) a qui le user partage une data
        route: "/api/datas/shares",
        controller: DataController,
        action: ""
    },{
        method: "get", // Récupération de la liste des data partagé a une target(user/group) par le user
        route: "/api/data/target",
        controller: DataController,
        action: ""
    },{
        method: "get", // Récupération de la liste des datas que le user concerné partage avec le user token
        route: "/api/data/profile",
        controller: DataController,
        action: ""
    },{
        method: "post", // Envoi un target et une liste de data id pour créer les shares pour les datas entre le user Token et le Target
        route: "/api/shares",
        controller: DataController,
        action: ""
    },

// ROUTES FOR CONTACT------------------------------
    {
        method: "get", // Récupération de tout les contacts d'un user par son id
        route: "/api/contacts", 
        controller: ContactController,
        action: ""
    },{
        method: "delete", // Suppression d'un contact via sont id
        route: "/api/contact/:id", // :id = contact.id
        controller: ContactController,
        action: ""
    },{
        method: "post", // Création d'un contact entre 2 users + supprime la validation concerné
        route: "/api/contact", 
        controller: ContactController,
        action: ""
    },{
        method: "delete", // Suppression de la validation via son id
        route: "/api/validation/:id", // :id = validation.id
        controller: ContactController,
        action: ""
    },{
        method: "post", // Création d'une validation entre 2 users
        route: "/api/validation",
        controller: ContactController,
        action: ""
    },{
        method: "get", // Récupération de la liste des validations reçues et envoyées par le user
        route: "/api/validations/user",
        controller: ContactController,
        action: ""
    },

// ROUTES FOR GROUPS------------------------------
    {
        method: "get", // Récupération d'une liste des groupes dont le user est membre
        route: "/api/groups/user", 
        controller: GroupController,
        action: ""
    },{
        method: "get", // Récupération d'une liste des groupes dont le user est le créateur
        route: "/api/groups/creator", 
        controller: GroupController,
        action: ""
    },{
        method: "get", // Récupération d'un groupe via sont id
        route: "/api/group/:id", // :id = group.id
        controller: GroupController,
        action: ""
    },{
        method: "delete", // Suppression d'un groupe via sont id
        route: "/api/group/:id", 
        controller: GroupController,
        action: ""
    },{
        method: "get", // Récupération d'un groupe, de ces membres et des contacts du user via leurs id
        route: "/api/group/:id/setting", 
        controller: GroupController,
        action: ""
    },{
        method: "put", // Envoi d'inputs et d'une liste des membres pour update un groupe via sont id
        route: "/api/group/:id", 
        controller: GroupController,
        action: ""
    }

]