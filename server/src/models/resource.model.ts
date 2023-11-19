import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

interface IResource extends mongoose.Document {
  _id: string;
  title: string;
  type: string;
  link: string;
  description: string;
}

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export { IResource, Resource };
