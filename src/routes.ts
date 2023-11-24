import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"
import { DataController } from "./controller/DataController"
import { ContactController } from "./controller/ContactController"
import { AuthController } from "./controller/AuthController"
import { ShareController } from "./controller/ShareController"
import { ValidationController } from "./controller/ValidationController"


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
        route: "/api/auth/refreshToken",
        controller: AuthController,
        action: "refreshToken"
    },{
        method: "put",
        route: "/api/auth/disconnect",
        controller: AuthController,
        action: "disconnect"
    },

// ROUTES FOR USER------------------------------
    {
        method: "get",
        route: "/api",
        controller: UserController,
        action: "userConnected"
    },    {
        method: "put",
        route: "/api/checkPassword",
        controller: UserController,
        action: "checkPassword"
    },{
        method: "post",
        route: "/user/reset",
        controller: UserController,
        action: "resetPassword"
    },{
        method: "put",
        route: "/api/user/account",
        controller: UserController,
        action: "updateUser"
    },{
        method: "put",
        route: "/api/user/password",
        controller: UserController,
        action: "updatePassword"
    },{
        method: "get",
        route: "/api/user/profile/:id", // :id = user.id
        controller: UserController,
        action: "getProfile"
    },{
        method: "post",
        route: "/api/user/search",
        controller: UserController,
        action: "userSearch"
    },{
        method: "delete",
        route: "/api/user",
        controller: UserController,
        action: "removeUser"
    },
    {
        method: "get",
        route: "/api/user/relation/:id",
        controller: UserController,
        action: "getUserRelation"
    },

// ROUTES FOR DATA------------------------------
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
        method: "post", // Récupération de liste users ou groups
        route: "/api/datas/shares",
        controller: ShareController,
        action: "getListUsers"
    },{
        method: "post", // Récupérer une liste des datas partagé avec l’utilisateur ou le groupe lié
        route: "/api/datas/target",
        controller: ShareController,
        action: "getShares"
    },{
        method: "post",
        route: "/api/datas/profile",
        controller: ShareController,
        action: "getSharesBetweenUsers"
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
    {
        method: "get", // Récupérer tous les partages
        route: "/api/allshares", 
        controller: ShareController,
        action: "allShares"
    },
    {
        method: "get", // Récupérer un partage
        route: "/api/share/:id", 
        controller: ShareController,
        action: "getShareById"
    },
    {
        method: "delete", // supprimer partage entre 2 users
        route: "/api/share/user/:id", 
        controller: ShareController,
        action: "deleteShareByUsers"
    },

// ROUTES FOR CONTACT & VALIDATIONS------------------------------
    {
        method: "get",
        route: "/api/contacts", 
        controller: ContactController,
        action: "all"
    },{
        method: "delete",
        route: "/api/contact/:id", // :id = contact.id
        controller: ContactController,
        action: "remove"
    },{
        method: "post",
        route: "/api/contact", 
        controller: ContactController,
        action: "save"
    },{
        method: "delete",
        route: "/api/validation/:id", // :id = validation.id
        controller: ValidationController,
        action: "remove"
    },{
        method: "post",
        route: "/api/validation",
        controller: ValidationController,
        action: "save"
    },{
        method: "get",
        route: "/api/validations/user",
        controller: ValidationController,
        action: "all"
    },

// ROUTES FOR GROUPS------------------------------
    {
        method: "post",
        route: "/api/group", 
        controller: GroupController,
        action: "save"
    },{
        method: "get",
        route: "/api/groups/member", 
        controller: GroupController,
        action: "memberGroupList"
    },{
        method: "get",
        route: "/api/groups/creator", 
        controller: GroupController,
        action: "creatorGroupList"
    },{
        method: "get",
        route: "/api/group/:id", // :id = group.id
        controller: GroupController,
        action: "getGroupDetail"
    },{
        method: "delete",
        route: "/api/group/:id", //:id = group.id
        controller: GroupController,
        action: "remove"
    },{
        method: "get",
        route: "/api/group/:id/setting", 
        controller: GroupController,
        action: "getGroupDetailForSetting"
    },{
        method: "put",
        route: "/api/group/:id", 
        controller: GroupController,
        action: "update"
    },{
        method: "put",
        route: "/api/group/:id/add", 
        controller: GroupController,
        action: "addMember"
    },{
        method: "put",
        route: "/api/group/:id/remove", 
        controller: GroupController,
        action: "removeMember"
    }

]