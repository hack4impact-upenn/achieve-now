import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner_site: {
    type: String,
    required: true,
  },
  mailing_address: {
    type: String,
    required: true,
  },
  media_waiver: {
    type: Boolean,
    required: true,
  },
  progress_stats: {
    type: Map,
    of: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    required: true,
  },
});

interface ICoach extends mongoose.Document {
  _id: string;
  user_id: string;
  partner_site: string;
  mailing_address: string;
  media_waiver: boolean;
  progress_stats: Map<string, Map<string, any>>;
}

export default mongoose.model<ICoach>('Coach', CoachSchema);
