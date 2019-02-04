const express = require('express');
const router  = express.Router();
const Room = require('../models/Room')
const { isConnected, checkAdmin, checkRole } = require('../middlewares')


router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/rooms', (req,res,next)=>{
  Room.find({ isPublished: true })
  .populate('_owner') // change the field `_owner` by the document in the db
  .then(rooms => {
    res.render('rooms', {rooms})
  })
})

// TODO: make these routes only available if connected 
router.get('/add-room', isConnected, (req,res,next)=>{
  res.render('add-room')
})
router.post('/add-room', isConnected, (req,res,next)=>{
  Room.create({
    name: req.body.name,
    description: req.body.description,
    isPublished: req.body.isPublished,
    _owner: req.user._id // req.user is the connected user
  })
  .then(() => {
    res.redirect('/rooms')
  })
  .catch(next)
})
router.get('/my-rooms', isConnected, (req,res,next)=>{
  // Find only the rooms where `_owner` is the connected user _id 
  Room.find({
    _owner: req.user._id
  })
  .populate('_owner') // change the field `_owner` by the document in the db
  .then(rooms => {
    res.render('rooms', {rooms})
  })
  .catch(next)
})

router.get('/admin/rooms', 
  // checkAdmin, 
  checkRole('ADMIN'),
  (req,res,next)=>{
    Room.find()
    .populate('_owner')
    .then(rooms => {
      res.render('rooms', {rooms})
    })
    .catch(next)
  }
)


module.exports = router;
