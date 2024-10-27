const mongoose = require('mongoose');


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const db_password = process.argv[2];


const dbName = 'Note';
const notee = process.argv[3];
const importance = process.argv[4] === "true";
const url = `mongodb+srv://engalihaitham:${db_password}@cluster0.rat1u.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema,'note');

const note = new Note({
  content: notee,
  important: importance,
});
// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })
note.save().then(() => {
  console.log('note saved!');
  mongoose.connection.close();
});
