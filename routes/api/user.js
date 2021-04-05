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

//@route GET api/users
//@desc Register user route
//@access Public
router.post('/registeruser',[
    check('name','Name is required').not().isEmpty(),
    check('userid','id is required').not().isEmpty(),
    check('isowner','isOwner is required').not().isEmpty(),
    check('email','Please enter email').isEmail(),
    check('password','Enter password').isLength({min:1})
],
async (req,res) => { 
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
  }

  const {name, userid, email, password, isowner } = req.body;
 
  try{  
  //see if user exists
  let user = await User.findOne({userid:userid});

  if(user){
    return res.status(400).json({errors: [{msg: "User Already exists"}]});
  }

    
  //get users gravatar
  const avatar = gravatar.url(email,{
      s: '200'
      ,r: 'pg'
      ,d: 'mm'
  })

  user = new User({
       name
       ,userid
       ,email
       ,isowner
      ,avatar
      ,password       
  })
  //Encrypt Password
  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(password, salt);
  await user.save();

  //Return sonwebtoken
   const payload = {
       user: {
           id: user.id
       }
   }
  jwt.sign(
      payload, 
      config.get('jwtSecret')
      ,{ expiresIn: 360000},
      (err, token) => {
          if(err) throw err;
          res.json({ token });
      }
      );
}
  catch(err){
   console.error(err.message);
   res.status(500).send('Server Error');
  }
});


//@route GET api/userDetail/me
//@desc Get current user profile
//@access Private
router.post('/getcurrentuser', auth, async (req, res) => {
    try {
        const userdetail = await UserDetail.findOne({ user: req.user.id  }).populate('user', ['name', 'avatar', 'isowner']);
        if (!userdetail) {
            return res.status(400).json({ msg: 'There is no userdetail' });
        }
        res.json(userdetail);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route POST api/profile 
//@desc Create or update userDetail
//@access Private

router.post('/updateuserdetail', [auth, [
    check('userid', 'userid is required').not().isEmpty(),
    check('designation', 'Designation is required').not().isEmpty(),
    check('mobile', 'mobile is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        userid,
        designation,
        address,
        mobile
    } = req.body;

    //build a profile object
    const userFields = {};
    userFields.user = req.user.id;
    if (userid) userFields.userid = userid;
    if (designation) userFields.designation = designation;
    if (address) userFields.address = address;
    if (mobile) userFields.mobile = mobile;

    try {
        let userdetail = await UserDetail.findOne({ userid: req.body.userid });

        if (userdetail) {
            //update
            userdetail = await UserDetail.findOneAndUpdate(
                { userid: req.body.userid }
                , { $set: userFields }
                , { new: true }
            );
            return res.json(userdetail);
        }
        //create profile
        userdetail = new UserDetail(userFields);
        await userdetail.save();

        res.json(userdetail);
        // console.log(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});

//@route GET api/profile/userid/:userid 
//@desc get  userDetail from userid  
//@access Public
router.post('/getuserdetail/:userid', async (req, res) => {
    try {
        const userdetail = await UserDetail.findOne({ userid: req.params.userid }).populate('user', ['name', 'avatar','isowner']);
        if (!userdetail) return res.status(400).json({ msg: 'There is no userdetail for this userid' });
        res.json(userdetail);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'There is no profile for this userid' });
        }

        res.status(500).send('server error');
    }
});

//@route DELETE  api/userdetail/ 
//@desc DELETE PROFILE, USER,POSTS 
//@access PRIVATE
router.post('/deleteuser',  [auth, [
    check('userid', 'userid is required').not().isEmpty()
]], async (req, res) => {
    try {

        //Remove UserDetail
        await UserDetail.findOneAndRemove({ userid: req.body.userid });
        //Remove User
        await User.findOneAndRemove({ userid: req.body.userid });
        res.json("userdetail deleted");
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