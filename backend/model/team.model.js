import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  semester:{
    type:String,
    enum:['First','Third']
},
});

const groupSchema = new mongoose.Schema({
  name:{type:String},
  id: { type: Number, required: true},
  members: [memberSchema] // Array of member objects
});

const Group = mongoose.model('Group', groupSchema);

export { Group };
