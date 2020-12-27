const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {registertionValidation,loginValidation} = require('../validation')
const TodoUser = require('../models/User')

router.post('/register', async (req,res) => {
  //validation
  const {error} = registertionValidation(req.body)
  if(error) return res.send(error.details[0].message)

  // if user or email exit in database
  const emailExit = await TodoUser.findOne({email:req.body.email})
  if(emailExit) return res.send('Email exit')
  const usernameExit = await TodoUser.findOne({username:req.body.username})
  if(usernameExit) return res.send('username exit')

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password,salt);

  const user = new TodoUser({
    username:req.body.username,
    email:req.body.email,
    password: hashPassword
  })
  try {
    const saveUser = await user.save()
    res.send(saveUser.username)
  } catch (error) {
    res.status(404).send(error)
  }
})

//Login
router.post('/login', async (req,res) => {
  const {error} = loginValidation(req.body)
  if(error) return res.send(error.details[0].message)

  const usernameExit = await TodoUser.findOne({username:req.body.username})
  if(!usernameExit) return res.send('Invalid credential')

  // password
  const validPassword = await bcrypt.compare(req.body.password,usernameExit.password)
  if(!validPassword) return res.send('Invalid credential')

  //creating jwt token
  const token = jwt.sign({_id:usernameExit._id},process.env.TOKEN_SECRET, { expiresIn: "1d" })
  res.header('auth-token',token).json({auth:true})
})

module.exports = router;
