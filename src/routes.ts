import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"
import { DataController } from "./controller/DataController"
import { ContactController } from "./controller/ContactController"
import { AuthController } from "./controller/AuthController"
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
        method: "get",
        route: "/api/datas",
        controller: DataController,
        action: ""
    },{
        method: "get",
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: ""
    },{
        method: "put",
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: ""
    },{
        method: "delete",
        route: "/api/data/:id", // :id = data.id
        controller: DataController,
        action: ""
    },{
        method: "post",
        route: "/api/data",
        controller: DataController,
        action: ""
    },{
        method: "get",
        route: "/api/datas/shares",
        controller: DataController,
        action: ""
    },{
        method: "get",
        route: "/api/data/target",
        controller: DataController,
        action: ""
    },{
        method: "get",
        route: "/api/data/profile",
        controller: DataController,
        action: ""
    },{
        method: "post",
        route: "/api/shares",
        controller: DataController,
        action: ""
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