import { Document } from 'mongoose';

export default interface IRobot extends Document {
    name: string;
    color: string;
    attack: number;
    defense: number;
}
