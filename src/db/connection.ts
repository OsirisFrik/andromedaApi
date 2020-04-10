import mongoose from 'mongoose';

export default (db: string): void => {
  const connect = () => {
    mongoose
      .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(() => {
        return console.log(`🎉Successfully connected to Mongo Atlas 🎉`);
      })
      .catch(error => {
        console.log("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
}