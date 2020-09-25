const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('../config/passport');
const Comment = require("../models/Comment")
const Info = require("../models/Info")

router.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
    .then((user) => res.status(201).json({ user }))
    .catch((err) => res.status(500).json({ err }));
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  const { user } = req;
  res.status(200).json({ user });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.status(200).json({ msg: 'Logged out' });
});

router.get('/profile', isAuth, (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).json({ user : req.user}))
    .catch((err) => res.status(500).json({ err }));
});

router.put("/photo", async (req, res) => {
  const { photo } = req.body
  await User.findByIdAndUpdate(req.user.id, { photo })
  res.status(200).json({ message: "success" })
})


function isAuth(req, res, next) {
  req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}


//UsersView
router.get("/search", isAuth, async(req, res) => {
  const users = await User.find()
  res.status(200).json({ users })
})

//User Detail//
router.get("/search/:userId", async(req, res)=>{
  const user  = await User.findById(req.params.userId)
  res.status(200).json({ user })
});


//Create comment 
router.post("/search/:userId",async(req, res) => {
  const {userId} = req.params;
  const {context} = req.body
  const owner = req.user.name
  const newComment = await Comment.create({
    context,
    ownerId : req.user.id,
    owner : owner,
  })
  console.log(newComment)
  await User.findByIdAndUpdate(userId, {$push : {comments : newComment}})
  res.status(201).json({ newComment })
}
) 

//Create info
//Info page
router.get("/profile/info", isAuth, async (req, res)=>{
  const allInfos = await Info.find().populate("infos")
  res.status(200).json({ allInfos });
})

//Info create
router.post("/profile/info", isAuth, async(req, res) => {
  const {title, photo, description} = req.body
  const owner = req.user.name
  const newInfo = await Info.create({
    title,
    photo,
    description,
    ownerId : req.user.id,
    owner : owner,
  })
  console.log(newInfo)
  await User.findByIdAndUpdate(req.user.id, {$push : {infos :  newInfo}})
  res.status(200).json({newInfo})
})

//Edit info
router.get("/profile/info/:infoId", async(req, res)=>{
  const info  = await Info.findById(req.params.infoId)
  res.status(200).json({ info })
});

router.put("/profile/info/:infoId", isAuth, async(req,res)=>{
  const {title,photo, description} = req.body
  
  let newPhoto;
  if(photo){
    newPhoto = photo
  }

  const {infoId} = req.params;
  const owner = req.user.name
  const updateInfo = await Info.findByIdAndUpdate(infoId, {
    title,
    photo: newPhoto,
    description,
    ownerId : req.user.id,
    owner : owner,
  })
  console.log(updateInfo)
  res.status(200).json({updateInfo})
})

//Delete info
router.delete("/profile/info/:infoId", isAuth, async(req,res)=>{
  const {infoId} = req.params;
  await Info.findByIdAndDelete(infoId)
  res.status(200).json({message : "delete success"})
})


module.exports = router;
