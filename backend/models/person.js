const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to, url')
mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(?=\d{2,3}-{1}\d{4,}$).{9,}/.test(v)
      },
      message: () =>
        'Number must have at least 8 digits, and start with (XX-*) or (XXX-*)',
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, reutrnedObject) => {
    reutrnedObject.id = reutrnedObject._id.toString()
    delete reutrnedObject._id
    delete reutrnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
