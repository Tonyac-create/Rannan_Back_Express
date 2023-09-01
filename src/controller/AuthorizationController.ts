import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { AuthorizationService } from "../service/AuthorizationService";

export class AuthorizationController{
    private authorizationService = new AuthorizationService();

    //Création d'une autorisation pour un user

    //Création d'une autorisation pour un groupe

    //Récupération de toutes les authorisations qu'un user a donné (id createur)

    //Récupération de toutes les authorisations qu'un user a reçu (id du target)

    //Récupération de toutes les authorisations qu'un groupe a (id du groupe)

    //Récupation de toutes les authorisations d'une data précise (id de la data)

    //Récupération d'un authorisation précise (id de l'authorisation)

    //Supprimer une authorisation
}