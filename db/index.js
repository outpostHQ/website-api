import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/numl', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

export const Schema = mongoose.Schema;

export default mongoose;

db.on('error', console.error.bind(console, 'connection error:'));
