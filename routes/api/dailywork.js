const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleware/auth');
                                      
const User = require('../../models/User');
const UserDetail = require('../../models/UserDetail');
const Group = require('../../models/Group');
const DailyWork = require('../../models/DailyWork');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route PUT api/addupdatedailywork
//@desc add or update dailywork
//@access private
router.post('/addupdatedailywork',[auth,[
    check('groupid','groupid is required').not().isEmpty(),
    check('leaderid','leaderid is required').not().isEmpty(),
    check('work','work is required').not().isEmpty(),
    check('date','date is required').not().isEmpty()
]],
async (req,res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
  } 
  const {groupid, leaderid, work, date } = req.body;
      //build a profile object
      const dailyworkFields = {};
      if (groupid) dailyworkFields.groupid = groupid;
      if (leaderid) dailyworkFields.leaderid = leaderid;
      if (work) dailyworkFields.work = work;
      if (date) dailyworkFields.date = date;
  
  try{      
  //see if user exists
  let dailywork = await DailyWork.findOne({groupid:groupid, date:date});

  if(dailywork){
  //  return res.status(400).json({errors: [{msg: "User Already exists"}]});
    dailywork = await DailyWork.findOneAndUpdate(
        { groupid: req.body.groupid,
          date:date }
        , { $set: dailyworkFields }
        , { new: true }
    );
    return res.json(dailywork);
  }

  //create group
  dailywork = new DailyWork(dailyworkFields);
  await dailywork.save();
  res.json(dailywork);
}
  catch(err){
   console.error(err.message);
   res.status(500).send('Server Error');
  }
});


//@route POST api/getdailyworkbydate
//@desc get group
//@access Public
router.post('/getdailyworkbydate',[auth,[
    check('groupid','groupid is required').not().isEmpty(),
    check('date','date is required').not().isEmpty()
]],
async (req,res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
  } 
  const {groupid, date} = req.body;
  try{  
  //see if user exists
  let work = await DailyWork.findOne({groupid:groupid, date:date});
  if(work){
    return res.json(work);
  }else{
    return res.json(`No Work found by that leader on ${date}`);
  } 
}
  catch(err){
   console.error(err.message);
   res.status(500).send('Server Error');
  }
});

//@route POST api/getdailyworkbulk
//@desc get group
//@access Public
router.post('/getdailyworkbulk',[auth,[
  check('groupid','groupid is required').not().isEmpty(),
  check('fromdate','fromdate is required').not().isEmpty(),
  check('todate','todate is required').not().isEmpty()
]],
async (req,res) => { 
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
} 
const {groupid, fromdate, todate} = req.body;
try{  
//see if work exists
let work = await DailyWork.find({groupid:groupid,  date:{"$gte": fromdate, "$lt": todate} });
if(work){
  return res.json(work);
}else{
  return res.json(`No Work found by that leader on ${date}`);
} 
}
catch(err){
 console.error(err.message);
 res.status(500).send('Server Error');
}
});


//@route DELETE  api/deleteworkdetail/ 
//@desc DELETE deleteworkdetail 
//@access PRIVATE
router.post('/deleteworkdetail',  [auth, [
    check('groupid', 'groupid is required').not().isEmpty(),
    check('date','date is required').not().isEmpty()
]], async (req, res) => {
    try {

        //Remove Group
        await DailyWork.findOneAndRemove({ groupid: req.body.groupid , date:req.body.date});
        res.json("work deleted");
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