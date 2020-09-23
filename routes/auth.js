const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('../config/passport');

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

router.get("/search", isAuth, async(req, res) => {
  const users = await User.find()
  res.status(200).json({ users })
})

router.put("/photo", async (req, res) => {
  const { photo } = req.body
  await User.findByIdAndUpdate(req.user.id, { photo })
  res.status(200).json({ message: "ok" })
})

function isAuth(req, res, next) {
  req.isAuthenticated() ? next() : res.status(401).json({ msg: 'Log in first' });
}

//User Detail//
router.get("/search/:userId", async(req, res)=>{
  const user  = await User.findById(req.params.user)
  res.status(200).json({ user })
});

module.exports = router;
