import { NextFunction, Request, Response } from "express";
import { ResponseInterface } from "../interface/ResponseInterface";
import { ResponseMaker } from "../utils/ResponseMaker";
import { RequestWithUser } from "../interface/RequestWithUser.interface";
import { publishMessage, requestMessage } from "../utils/nats-config";

export class DataController {
  // Services
  private responseMaker = new ResponseMaker();

  // Récupération de toute les datas d'un user_id
  async getDatasInUser(
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ): Promise<ResponseInterface> {
    try {
      const id = +request.user.user_id;
      return await requestMessage("getAllDatasOneUser", id);
    } catch (error) {
      if (error.status && error.message) {
        response
          .status(error.status)
          .json({ error: error.message, date: new Date() });
      } else {
        response.status(500).json({ error: error.message, date: new Date() });
      }
    }
  }

  // Récupération d'une data par son id
  async getOne(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<ResponseInterface> {
    // Récupération via l'id de la data
    try {
      const id = request.params.id;
      return await requestMessage("getOneData", id);
    } catch (error) {
      if (error.status && error.message) {
        response
          .status(error.status)
          .json({ error: error.message, date: new Date() });
      } else {
        response.status(500).json({ error: error.message, date: new Date() });
      }
    }
  }

  // Création d'une data par userid
  async save(request: RequestWithUser, response: Response, next: NextFunction) {
    const { type, name, value } = request.body;
    try {
      // Récupération du token
      const user_id = request.user.user_id;
      if (!user_id) {
        throw { status: 400, message: "user inexistant" };
      }

      const result = await publishMessage("createData", {
        type,
        name,
        value,
        user_id,
      });
      response.status(200).json(result);
    } catch (error) {
      if (error.status && error.message) {
        response
          .status(error.status)
          .json({ error: error.message, date: new Date() });
      } else {
        response.status(500).json({ error: error.message, date: new Date() });
      }
    }
  }

  // Modification d'une data avec son id
  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const _id = request.params.id;
      const { type, name, value } = request.body;
      const result = await publishMessage("updateData", {
        _id,
        type,
        name,
        value,
      });
      response.status(200).json(result);
    } catch (error) {
      if (error.status && error.message) {
        response
          .status(error.status)
          .json({ error: error.message, date: new Date() });
      } else {
        response.status(500).json({ error: error.message, date: new Date() });
      }
    }
  }

  // Suppression d'une data
  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id;
      const result = await publishMessage("removeData", id);
      response.status(200).json(result);
    } catch (error) {
      if (error.status && error.message) {
        response
          .status(error.status)
          .json({ error: error.message, date: new Date() });
      } else {
        response.status(500).json({ error: error.message, date: new Date() });
      }
    }
  }
}
