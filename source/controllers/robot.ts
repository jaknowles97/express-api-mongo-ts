import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Robot from '../models/robot';

const createRobot = (req: Request, res: Response, next: NextFunction) => {
    let { name, color, attack, defense } = req.body;

    const robot = new Robot({
        _id: new mongoose.Types.ObjectId(),
        name,
        color,
        attack,
        defense
    });

    return robot
        .save()
        .then((result) => {
            return res.status(201).json({
                robot: result
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getAllRobots = (req: Request, res: Response, next: NextFunction) => {
    Robot.find()
        .exec()
        .then((robots) => {
            return res.status(200).json({
                robots,
                count: robots.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getRobot = (req: Request, res: Response, next: NextFunction) => {
    // * Note to self, usually params are added to the url like http://localhost:1337/api/robots/get?id=1234
    //   but any time i did that with postman req.params.id would return like 'id=1234' instead of just the id itself.
    //   by testing and logging i found that http://localhost:1337/api/robots/get/1234 works correctly
    //  I assume it would be an issue with my 404 error handling on server.ts
    console.log(req.params.id);
    Robot.findById(req.params.id)
        .exec()
        .then((robot) => {
            return res.status(200).json({ robot });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message, error });
        });
};

const updateRobot = (req: Request, res: Response, next: NextFunction) => {
    let { id, name, color, attack, defense } = req.body;
    const updatedRobot = { name, color, attack, defense };
    //  https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    //  By default, findByIdAndUpdate() returns the document as it was before update was applied.
    //  If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.
    Robot.findByIdAndUpdate(id, updatedRobot, { new: true })
        .exec()
        .then((robot) => {
            res.status(201).json({
                robot
            });
        })
        .catch((error) => res.status(500).json({ message: error.message, error }));
};

const deleteRobot = (req: Request, res: Response, next: NextFunction) => {
    Robot.findByIdAndDelete(req.params.id)
        .exec()
        .then(() => res.status(200).json({ message: 'success' }))
        .catch((error) => res.status(500).json({ message: error.message, error }));
};

export default { createRobot, getAllRobots, getRobot, updateRobot, deleteRobot };
