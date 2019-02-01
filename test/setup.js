const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost:27017/notedowntest', {useNewUrlParser: true});
  mongoose.connection
    .once('open', () => {
      console.log('Connected to test db');
      done();
    })
    .on('error', error => console.warn('Error', error));
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
       // note: collection.remove() has been depreceated.        
       await collection.deleteOne(); 
  }
});