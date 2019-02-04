const express = require('express');
const router  = express.Router();
const Room = require('../models/Room')

router.get('/', (req, res, next) => {
  res.render('index');
});


router.get('/rooms', (req,res,next)=>{
  Room.find({ isPublished: true })
  .then(rooms => {
    res.render('rooms', {rooms})
  })
})

// TODO: make these routes only available if connected 
router.get('/add-room', (req,res,next)=>{
  res.render('add-room')
})
router.post('/add-room', (req,res,next)=>{
  Room.create({
    name: req.body.name,
    description: req.body.description,
    isPublished: req.body.isPublished,
  })
  .then(() => {
    res.redirect('/rooms')
  })
  .catch(next)
})
router.get('/my-rooms', (req,res,next)=>{
  Room.find() // TODO: change the filter to only show the right rooms
  .then(rooms => {
    res.render('rooms', {rooms})
  })
  .catch(next)
})



module.exports = router;
