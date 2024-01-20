import mongoose from 'mongoose';

const CoachSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  partner_site: {
    type: String,
    required: false,
  },
  mailing_address: {
    type: String,
    required: false,
  },
  media_waiver: {
    type: Boolean,
    required: true,
    default: false,
  },
  progress_stats: {
    type: Map,
    of: {
      type: Map,
      of: String,
    },
    required: false,
  },
  updates: {
    type: String,
    required: false,
  },
});

interface ICoach extends mongoose.Document {
  _id: string;
  user_id: string;
  partner_site: string;
  mailing_address: string;
  media_waiver: boolean;
  progress_stats: Map<string, Map<string, string>>;
  updates: string;
}

const Coach = mongoose.model<ICoach>('Coach', CoachSchema);

export { ICoach, Coach };
