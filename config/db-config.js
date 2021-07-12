const mongoose = require('mongoose')
const dbUrl= process.env.MONGO_URI || 'mongodb://localhost:27017/picasso'
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB