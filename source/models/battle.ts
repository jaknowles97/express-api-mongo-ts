import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import IBattle from '../interfaces/battle';

const BattleSchema: Schema = new Schema(
    {
        robots: [{ type: Schema.Types.ObjectId, ref: 'Robot' }],
        winner: { type: Schema.Types.ObjectId, ref: 'Robot' }
    },
    {
        timestamps: true
    }
);

BattleSchema.post<IBattle>('save', function () {
    logging.info('Mongo', 'Checkout the book we just saved: ', this);
});

export default mongoose.model<IBattle>('Battle', BattleSchema);
