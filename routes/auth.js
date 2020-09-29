const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('../config/passport');
const Comment = require("../models/Comment")
const Info = require("../models/Info")
const StudyMaterial = require("../models/StudyMaterial.js")



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

router.get("/profile/editProfile",  isAuth,  async(req,res)=>{
  const user = await User.findById(req.user._id);
  console.log(user);
  res.status(200).json({ user })
})

router.put("/profile/editProfile",  isAuth, async(req, res)=>{
  const {learnLanguage, hobby, about} = req.body;
  const updatedPorfile = await User.findByIdAndUpdate(req.user._id,{
    learnLanguage,
    hobby,
    about
  })
  console.log(updatedPorfile);
  res.status(200).json({updatedPorfile})
})


function isAuth(req, res, next) {
  req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}


//UsersView
router.get("/search",  async(req, res) => {
  const users = await User.find()
  res.status(200).json({ users })
})

//User Detail//
router.get("/search/:userId", isAuth, async(req, res)=>{
  const user  = await User.findById(req.params.userId)
  res.status(200).json({ user })
});


//Create comment 
router.post("/search/:userId", isAuth, async(req, res) => {
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

//view comments
router.get("/profile/msgs",  isAuth, async(req, res)=>{
  const user = await User.findById(req.user._id)
  res.status(200).json({user})
})

//Delete confirm page
router.get("/msgs/:msgId",  isAuth, async(req, res)=>{
  const{ msgId } = req.params; 
  const msg = await Comment.findById(msgId)
  res.status(200).json({msg})
})


//Delete comment
router.delete("/msgs/:msgId",  isAuth, async(req, res)=>{
  const{ msgId } = req.params;  
  const msgDelete = await Comment.findById(msgId)
  console.log(msgDelete)
  await User.findByIdAndUpdate(req.user.id, {$pull : {comments : msgDelete}})
  res.status(201).json({message : "delete success"})
})

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

//Info delete confirm page
router.get("/info/:infoId",  isAuth, async(req, res)=>{
  const { infoId } = req.params; 
  const info = await Info.findById(infoId)
  res.status(200).json({info})
})

//Delete info
router.delete("/info/:infoId",  isAuth, async(req, res)=>{
  const { infoId } = req.params;  
  const info = await Info.findById(infoId)
  await User.findByIdAndUpdate(req.user.id, {$pull : {infos : info}})
  res.status(200).json({message : "deleted"})
})

//Update info
router.put("/info/:infoId", isAuth, async(req,res)=>{
  const { infoId }= req.params;
  const {title, photo, description} = req.body;
  const owner = req.user.name
  const updatedInfo =  await Info.findByIdAndUpdate(infoId, {
    title,
    photo,
    description,
    ownerId : req.user.id,
    owner : owner
  })
  res.status(200).json({message : "updated"})
})

//material
router.get("/profile/material",isAuth, async(req, res)=>{
  const materials = await StudyMaterial.find().populate("materials");
  res.status(200).json({ materials });
})

//create material
router.post("/profile/material", isAuth, async(req, res)=>{
  const {title, photo, description} = req.body;
  const owner = req.user.name
  const newMaterial = await StudyMaterial.create({
    title,
    photo,
    description,
    ownerId : req.user.id,
    owner : owner
  })
  console.log(newMaterial)
  await User.findByIdAndUpdate(req.user.id, {$push : {materials : newMaterial}})
  res.status(200).json({newMaterial})
})

//Delete confirm page
router.get("/material/:materialId",  isAuth, async(req, res)=>{
  const { materialId } = req.params; 
  const material = await StudyMaterial.findById(materialId)
  res.status(200).json({material})
})

//Delete StudyMaterial
router.delete("/material/:materialId",  isAuth, async(req, res)=>{
  const { materialId } = req.params;  
  console.log(materialId)
  const material = await StudyMaterial.findById(materialId)
  await User.findByIdAndUpdate(req.user.id, {$pull : {materials : material}})
  res.status(200).json({material})
})

module.exports = router;
