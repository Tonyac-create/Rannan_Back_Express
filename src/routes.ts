import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"
import { DataController } from "./controller/DataController"
import { ContactController } from "./controller/ContactController"
import { ValidationController } from "./controller/ValidationController"


export const Routes = [

    // ------------------//ROUTES FOR USER------------------------------
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    }, {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    }, {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    }, {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove"
    },{
        method: "put", // Utilisez la méthode HTTP PUT pour la mise à jour
        route: "/users/:id", // Route pour mettre à jour un utilisateur en utilisant son ID
        controller: UserController,
        action: "update" // Nom de la méthode dans le UserController
    },
    

    // ------------------//ROUTES FOR GROUPS------------------------------

    {
        method: "get",
        route: "/groups",
        controller: GroupController,
        action: "all"
    }, {
        method: "get",
        route: "/groups/:id",
        controller: GroupController,
        action: "groupsByCreatorId"
    }, {
        method: "post",
        route: "/groups",
        controller: GroupController,
        action: "save"
    }, {
        method: "post",
        route: "/groups/user/:id",//:id = user_id
        controller: GroupController,
        action: "addUserInGroup"
    },{
        method: "delete",
        route: "/groups/:id",
        controller: GroupController,
        action: "remove"
    },{
        method: "put", // Utilisez la méthode HTTP PUT pour la mise à jour
        route: "/groups/:id", // Route pour mettre à jour un groupe en utilisant son ID
        controller: GroupController,
        action: "update" // Nom de la méthode dans le UserController
    },

    // ------------------//ROUTES FOR DATA------------------------------
    , {
        method: "get",
        route: "/datas",
        controller: DataController,
        action: "all"
    }, {
        method: "get",
        route: "/datas/:id",
        controller: DataController,
        action: "getOne"
    }, { 
        method: "post",
        route: "/datas",
        controller: DataController,
        action: "save"
    }, { 
        method: "put",
        route: "/datas/:id",
        controller: DataController,
        action: "update"
    }, {
        method: "delete",
        route: "/datas/:id",
        controller: DataController, 
        action: "remove"
    },

    // ------------------//ROUTES FOR CONTACT------------------------------
    {
        method: "get",
        route: "/allContacts/:id",
        controller: ContactController,
        action: "all"
    },  {
        method: "get",
        route: "/contact/:id", //Adapter routes quand token disponible
        controller: ContactController,
        action: "oneByUser"
    },  {
        method: "get",
        route: "/contacts/:id",
        controller: ContactController,
        action: "oneByRelation"
    },{
        method: "post",
        route: "/contacts",
        controller: ContactController,
        action: "save"
    },  {
        method: "delete",
        route: "/contacts/:id",
        controller: ContactController,
        action: "remove"
    },
    
    // ------------------//ROUTES FOR VALIDATION------------------------------
    {
        method: "post",
        route: "/validations",
        controller: ValidationController,
        action: "save"
    },{
        method: "put",
        route: "/validation/:id",
        controller: ValidationController,
        action: "update"
    },{
        method: "get",
        route: "/sentvalidations/:userId",
        controller: ValidationController,
        action: "allByUser"
    },{
        method: "get",
        route: "/validations/:contactId",
        controller: ValidationController,
        action: "allByContact"
    },{
        method: "delete",
        route: "/validation/:id",
        controller: ValidationController,
        action: "remove"
    }
    
]