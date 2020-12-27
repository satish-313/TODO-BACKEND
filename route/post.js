const router = require('express').Router();
const mongoose = require('mongoose');
const verify = require('../verifyToken');
const TODO = require('../models/Todo');
const TodoUser = require('../models/User')

router.get('/', verify, async (req, res) => {

  try {
    const userId = await TodoUser.findById(req.username._id)
    const result = await TodoUser.findById(userId._id).populate("TODO")
    const data = { todaData: result.TODO, auth: true, user:userId.username }
    res.send(data)
  } catch (error) {
    console.log(error)
    res.status(405).send(error)
  }
})

router.post('/post', verify, async (req, res) => {
  const userId = await TodoUser.findById(req.username._id)
  // post data

  const TodoItem = new TODO({
    username: userId,
    todo: req.body.todo
  })

  // saving in database
  try {
    const saveTodo = await TodoItem.save()
    const result = await TodoUser.findById(userId).populate("TODO")
    const data = { todaData: result.TODO }
    res.send(data)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.delete('/post/:id', verify, async (req, res) => {
  const { id } = req.params

  try {
    //const todoss = await TODO.aggregate([{$match:{username: mongoose.Types.ObjectId(`${req.username._id}`)}},{new:true}])
    //const todosss = await todoss.findByIdAndDelete(id)
    await TODO.findByIdAndDelete(id);
    const todos = await TODO.aggregate([{ $match: { username: mongoose.Types.ObjectId(`${req.username._id}`) } }])
    //console.log(todos)
    res.send(todos)
  } catch (error) {
    res.send(error)
  }
})

router.post('/post/:id', verify, async (req, res) => {
  const { id } = req.params
  const post = req.body
  try {
    await TODO.findByIdAndUpdate(id, post)
    const todos = await TODO.aggregate([{ $match: { username: mongoose.Types.ObjectId(`${req.username._id}`) } }])
    res.send(todos)
  } catch (error) {
    res.send(error)
  }
})

module.exports = router;