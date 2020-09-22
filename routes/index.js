const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ msg: 'Working' });
});


//User Detail//
router.get("/search/:userId", async(req, res)=>{
  const user  = await User.findById(req.params.userId)
  res.status(200).json({ user })
});


module.exports = router;
