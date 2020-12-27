const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const todoSchema = new mongoose.Schema({
  username:{type: Schema.Types.ObjectId,ref:"TodoUser"},
  todo:{type:String,required:true},
  date:{type:Date, default:Date.now}
})

module.exports = mongoose.model('TODO', todoSchema)