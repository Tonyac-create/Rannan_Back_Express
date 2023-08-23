import { UserController } from "./controller/UserController"
import { GroupController } from "./controller/GroupController"

export const Routes = [
//ROUTES FOR USER
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
    

//ROUTES FOR GROUP

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
]