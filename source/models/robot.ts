import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import IRobot from '../interfaces/robot';

const RobotSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        color: { type: String, required: true },
        attack: { type: Number, required: true },
        defense: { type: Number, required: true },
        battles: [{ type: Schema.Types.ObjectId, ref: 'Battle' }]
    },
    {
        timestamps: true
    }
);

RobotSchema.post<IRobot>('save', function () {
    logging.info('Mongo', 'Checkout the book we just saved: ', this);
});

export default mongoose.model<IRobot>('Robot', RobotSchema);
