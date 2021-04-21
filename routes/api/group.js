const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const UserDetail = require('../../models/UserDetail');
const Group = require('../../models/Group');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route PUT api/addupdategroup
//@desc add or update user
//@access Public
router.post('/addupdategroup',[auth,[
    check('groupid','groupid is required').not().isEmpty(),
    check('leaderid','leaderid is required').not().isEmpty(),
    check('owners','owners is required').not().isEmpty()
]],
async (req,res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
  } 
  const {groupid, leaderid, owners } = req.body;
      //build a profile object
      const groupFields = {};
      if (groupid) groupFields.groupid = groupid;
      if (leaderid) groupFields.leaderid = leaderid;
      
      if (owners) groupFields.owners = owners;

  try{  
  //see if user exists
  let group = await Group.findOne({groupid:groupid});

  if(group){
  //  return res.status(400).json({errors: [{msg: "User Already exists"}]});
    group = await Group.findOneAndUpdate(
        { groupid: req.body.groupid }
        , { $set: groupFields }
        , { new: true }
    );
    return res.json(group);
  }
  //create group
  group = new Group(groupFields);
  await group.save();

  res.json(group);

 
}
  catch(err){
   console.error(err.message);
   res.status(500).send('Server Error');
  }
});

//@route PUT api/getgroupbyid
//@desc get group
//@access Public
router.post('/getgroupbyid',[auth,[
    check('groupid','groupid is required').not().isEmpty()
]],
async (req,res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
  } 
  const {groupid} = req.body;
  try{  
  //see if user exists
  let group = await Group.findOne({groupid:groupid});
  if(group){
    return res.json(group);
  }else{
    return res.json("No Group found by that id");
  } 
}
  catch(err){
   console.error(err.message);
   res.status(500).send('Server Error');
  }
});

//@route DELETE  api/userdetail/ 
//@desc DELETE PROFILE, USER,POSTS 
//@access PRIVATE
router.post('/deletegroup',  [auth, [
    check('groupid', 'groupid is required').not().isEmpty()
]], async (req, res) => {
    try {

        //Remove Group
        await Group.findOneAndRemove({ groupid: req.body.groupid });
        res.json("group deleted");
    }
    catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no userdetail for this userid' });
        }
        res.status(500).send('server error');
    }
});


module.exports = router;