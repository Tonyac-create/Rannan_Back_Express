import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"
import { DataController } from "./controller/DataController"
import { ContactController } from "./controller/ContactController"
import { ValidationController } from "./controller/ValidationController"
import { AuthController } from "./controller/AuthController"


export const Routes = [

// ------------------//ROUTES FOR USER------------------------------
    {
        method: "get", // Récupération de tout les users
        route: "/users",
        controller: UserController,
        action: "all"
    },{
        method: "get", // Récupération d'un user par son id
        route: "/user/:id", // :id = user.id
        controller: UserController,
        action: "one"
    },{
        method: "post", // Enregistrer un nouveau user
        route: "/user",
        controller: UserController,
        action: "save"
    },{
        method: "put", // Mettre a jour un user par son id
        route: "/user/:id", // :id = user.id
        controller: UserController,
        action: "update"
    }, {
        method: "delete", // Supprimer un user par son id
        route: "/user/:id", // :id = user.id
        controller: UserController,
        action: "remove"
    },
    

// ------------------//ROUTES FOR GROUPS------------------------------
    {
        method: "get", // Récupération de tout les groupes
        route: "/groups",
        controller: GroupController,
        action: "all"
    },{
        method: "get", // Récupération d'un groupe par son id
        route: "/group/:id", // :id = group.id
        controller: GroupController,
        action: "one"
    },{
        method: "post", // Enregistrer un nouveau groupe
        route: "/group",
        controller: GroupController,
        action: "save"
    },{
        method: "put", // Mettre a jour un groupe par son id
        route: "/group/:id", // :id = group.id
        controller: GroupController,
        action: "update"
    },{
        method: "delete", // Supprimer un groupe par son id
        route: "/group/:id", // :id = group.id
        controller: GroupController,
        action: "remove"
    },{
        method: "get", // Récupération de tout les groupes par le creator_id
        route: "/groups/creator/:id", // :id = group.creator_id
        controller: GroupController,
        action: "groupsByCreatorId"
    },{
        method: "get", // Récupération de tout les groupes d'un user par l'id du user
        route: "/groups/user/:id", // :id = user.id
        controller: GroupController,
        action: "allUserGroups"
    },{
        method: "post", // Ajouter un user dans un groupe
        route: "/group/user", //
        controller: GroupController,
        action: "addUserInGroup"
    },{
        method: "delete", // Supprimer un user d'un groupe
        route: "/group/user",//
        controller: GroupController,
        action: "deleteUserInGroup"
    },

    // ------------------//ROUTES FOR CONTACT------------------------------
    {
        method: "get", // Récupération de tout les contacts d'un user par son id
        route: "/contacts/user/:id", // :id = user.id
        controller: ContactController,
        action: "all"
    },{
        method: "get", // Récupération d'un contact (relation) par son id
        route: "/contact/:id", // :id = contact.id
        controller: ContactController,
        action: "one"
    },{
        method: "post", // Enregistrer un nouveau contact
        route: "/contact",
        controller: ContactController,
        action: "save"
    },  {
        method: "delete", // Supprimer un contact par son id
        route: "/contact/:id", // :id = contact.id
        controller: ContactController,
        action: "remove"
    },

// ------------------//ROUTES FOR VALIDATION------------------------------
    {
        method: "get", // Récupération de toutes les validations envoyé par un user par son id
        route: "/validations/:id", // :id = user.id => user_id
        controller: ValidationController,
        action: "allByUser"
    },{
        method: "get", // Récupération de toutes les validations reçu par un user par son id
        route: "/validations/user/:id", // :id = user.id => contact_id
        controller: ValidationController,
        action: "allByContact"
    },{
        method: "post", // Enregistrer une nouvelle validation
        route: "/validation",
        controller: ValidationController,
        action: "save"
    },{
        method: "put", // Mettre a jour une validation
        route: "/validation/:id", // :id = validation.id
        controller: ValidationController,
        action: "update"
    },{
        method: "delete", // Supprimer une validation
        route: "/validation/:id", // :id = validation.id
        controller: ValidationController,
        action: "remove"
    },

// ------------------//ROUTES FOR DATA------------------------------
    {
        method: "get", // Récupération de toutes les datas d'un user par son id
        route: "/datas/:id",  // :id = user.id
        controller: DataController,
        action: "getDatasInUser"
    },{
        method: "get", // Récupération d'une data par son id
        route: "/data/:id", // :id = data.id
        controller: DataController,
        action: "getOne"
    },{ 
        method: "post", // Enregistrer une nouvelle data
        route: "/data",
        controller: DataController,
        action: "save"
    },{ 
        method: "put", // Mettre a jour une data
        route: "/data/:id", // :id = data.id
        controller: DataController,
        action: "update"
    },{
        method: "delete", // Supprimer une data
        route: "/datas/:id", // :id = data.id
        controller: DataController, 
        action: "remove"
    },

// ------------------//ROUTES FOR AUTHORIZATION------------------------------
    {
        method: "get", // Récupération de toutes les authorisations d'une target
        route: "/auths", //
        controller: AuthController,
        action: "all"
    },{
        method: "get", // Récupération d'une authorisation par son id
        route: "/auth/:id", // :id = authorisation.id
        controller: AuthController,
        action: "getOne"
    },{ 
        method: "post", // Enregistrer une nouvelle authorisation
        route: "/auth",
        controller: AuthController,
        action: "save"
    },{
        method: "delete", // Supprimer une authorisation
        route: "/auth/:id", // :id = authorization.id
        controller: AuthController, 
        action: "remove"
    }
]