import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  teachers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
});

interface ISchool extends mongoose.Document {
  _id: string;
  name: string;
  teachers: [string];
  info: string;
}

const School = mongoose.model<ISchool>('School', SchoolSchema);

export { ISchool, School };
