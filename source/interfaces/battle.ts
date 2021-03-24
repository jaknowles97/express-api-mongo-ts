import { Document } from 'mongoose';

export default interface IBattle extends Document {
    robots: [string];
    winner: string;
}
