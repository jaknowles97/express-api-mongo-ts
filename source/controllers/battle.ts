import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Battle from '../models/battle';
import Robot from '../models/robot';
import IRobot from '../interfaces/robot';
import robot from '../models/robot';

const createBattle = (req: Request, res: Response, next: NextFunction) => {
    const battleSystem = (bot1: IRobot, bot2: IRobot) => {
        console.log(
            `----------------------battle initiated!------------------------
                ${bot1.name} hp: ${bot1.defense + 50} atk: ${bot1.attack}
                 VS
                ${bot2.name} hp: ${bot2.defense + 50} atk: ${bot1.attack}
            `
        );
        //  used to keep track of the battle stats
        const status = {
            attacking: true,
            robot1: {
                id: bot1._id,
                hp: bot1.defense + 50,
                atk: bot1.attack
            },
            robot2: {
                id: bot2._id,
                hp: bot2.defense + 50,
                atk: bot2.attack
            }
        };

        // turn based battle loop... Did someone say spaghetti?
        do {
            if (status.robot1.hp <= 0) {
                const battle = new Battle({
                    robots: [bot1, bot2],
                    winner: bot2._id
                });
                return battle.save().then((result) => {
                    return Robot.findByIdAndUpdate(bot1._id, { $push: { battles: result._id }, new: true }).then(() => {
                        Robot.findByIdAndUpdate(bot2._id, { $push: { battles: result._id }, new: true }).then(() => res.status(201).json({ battle: result }));
                    });
                });
            } else if (status.robot2.hp <= 0) {
                const battle = new Battle({
                    robots: [bot1, bot2],
                    winner: bot1._id
                });
                return battle.save().then((result) => {
                    return Robot.findByIdAndUpdate(bot1._id, { $push: { battles: result._id }, new: true }).then(() => {
                        Robot.findByIdAndUpdate(bot2._id, { $push: { battles: result._id }, new: true }).then(() => res.status(201).json({ battle: result }));
                    });
                });
            }
            // decide who is attacking and then calculate the damage
            if (status.attacking) {
                status.robot2.hp -= status.robot1.atk;
                console.log(`${robots[1].name} got attacked! hp: ${status.robot2.hp}`);
            } else {
                status.robot1.hp -= status.robot2.atk;
                console.log(`${robots[0].name} got hit! hp: ${status.robot1.hp}`);
            }

            status.attacking = !status.attacking;
        } while (status.robot1.hp > 0 || status.robot2.hp > 0);
    };

    const robots: any = [];
    Robot.findById(req.body.robot1)
        .exec()
        .then((robot) => {
            robots.push(robot);
        });
    Robot.findById(req.body.robot2)
        .exec()
        .then((robot) => {
            robots.push(robot);
        })
        .then(() => battleSystem(robots[0], robots[1]));
};

const getAllBattles = (req: Request, res: Response, next: NextFunction) => {
    Battle.find()
        .exec()
        .then((battles) => {
            return res.status(200).json({
                battles,
                count: battles.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getBattle = (req: Request, res: Response, next: NextFunction) => {
    // * Note to self, usually params are added to the url like http://localhost:1337/api/robots/get?id=1234
    //   but any time i did that with postman req.params.id would return like 'id=1234' instead of just the id itself.
    //   by testing and logging i found that http://localhost:1337/api/robots/get/1234 works correctly
    //  I assume it would be an issue with my 404 error handling on server.ts

    Battle.findById(req.params.id)
        .exec()
        .then((battle) => {
            return res.status(200).json({ battle });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message, error });
        });
};

export default { createBattle, getAllBattles, getBattle };
