const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String,required:true},
  date:{type:Date,default:Date.now}
  },
  {toJSON:{virtuals:true}}
);

userSchema.virtual("TODO",{
  ref:"TODO",
  foreignField: "username",
  localField:"_id"
})

module.exports = mongoose.model('TodoUser',userSchema);

