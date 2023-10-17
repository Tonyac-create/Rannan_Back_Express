import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"
import { DataController } from "./controller/DataController"
import { ContactController } from "./controller/ContactController"
import { AuthController } from "./controller/AuthController"
import { ShareController } from "./controller/ShareController"


export const Routes = [

// ROUTES FOR AUTH------------------------------
    {
        method: "post",
        route: "/auth/register",
        controller: AuthController,
        action: "register"
    },{
        method: "post",
        route: "/auth/login",
        controller: AuthController,
        action: "login"
    },{
        method: "get",
        route: "/auth/refreshToken",
        controller: AuthController,
        action: "refreshToken"
    }, 

// ROUTES FOR USER------------------------------
    {
        method: "get",
        route: "/api",
        controller: UserController,
        action: "userConnected"
    },{
        method: "get",
        route: "/user/reset",
        controller: UserController,
        action: "resetPassword"
    },{
        method: "put",
        route: "/api/user/account",
        controller: UserController,
        action: "updateUser"
    },{
        method: "get",
        route: "/api/user/profile/:id", // :id = user.id
        controller: UserController,
        action: "getProfile"
    },{
        method: "get",
        route: "/api/user/search",
        controller: UserController,
        action: ""
    }, 

// ROUTES FOR DATA------------------------------
    {
        method: "get", // Récupérer toutes les datas
        route: "/api/datas",
        controller: DataController,
        action: "all"
    },
    {
        method: "get", // Récupère une data par son id
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: "getOne"
    },{
        method: "get", // Récupère des datas avec user_id
        route: "/api/datas", // :id = user.id
        controller: DataController,
        action: "getDatasInUser"
    },{
        method: "put", // Update d'une data
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: "update"
    },{
        method: "delete", // Suppression d'une data
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: "remove"
    },{
        method: "post", // Création d'une data pour un user
        route: "/api/data",
        controller: DataController,
        action: "save"
    },{
        method: "get", // Récupération de liste users ou groups
        route: "/api/datas/shares",
        controller: ShareController,
        action: "getListUsers"
    },{
        method: "get",
        route: "/api/data/target",
        controller: ShareController,
        action: "getShares"
    },{
        method: "get",
        route: "/api/data/profile",
        controller: DataController,
        action: "getShare"
    },{
        method: "post", // Création d'un partage
        route: "/api/shares",
        controller: DataController,
        action: "createShare"
    },{
        method: "delete", // Supprimer un partage
        route: "/api/share/:id", // :id = share.id
        controller: DataController,
        action: "removeShare"
    },
    // Pour test
    {
        method: "get", // Récupérer tous les partages
        route: "/api/allshares", 
        controller: ShareController,
        action: "allShares"
    },

// ROUTES FOR CONTACT------------------------------
    {
        method: "get",
        route: "/api/contacts", 
        controller: ContactController,
        action: ""
    },{
        method: "delete",
        route: "/api/contact/:id", // :id = contact.id
        controller: ContactController,
        action: ""
    },{
        method: "post",
        route: "/api/contact", 
        controller: ContactController,
        action: ""
    },{
        method: "delete",
        route: "/api/validation/:id", // :id = validation.id
        controller: ContactController,
        action: ""
    },{
        method: "post",
        route: "/api/validation",
        controller: ContactController,
        action: ""
    },{
        method: "get",
        route: "/api/validations/user",
        controller: ContactController,
        action: ""
    },

// ROUTES FOR GROUPS------------------------------
    {
        method: "get",
        route: "/api/groups/user", 
        controller: GroupController,
        action: ""
    },{
        method: "get",
        route: "/api/groups/creator", 
        controller: GroupController,
        action: ""
    },{
        method: "get",
        route: "/api/group/:id", // :id = group.id
        controller: GroupController,
        action: ""
    },{
        method: "delete",
        route: "/api/group/:id", 
        controller: GroupController,
        action: ""
    },{
        method: "get",
        route: "/api/group/:id/setting", 
        controller: GroupController,
        action: ""
    },{
        method: "put",
        route: "/api/group/:id", 
        controller: GroupController,
        action: ""
    }

]