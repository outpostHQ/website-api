import mongoose, { Schema } from './index.js';

const snippetSchema = new Schema({
  code: {
    type: String,
    maxlength: 65025,
  },
});

export const Snippet = mongoose.model('Snippet', snippetSchema);
