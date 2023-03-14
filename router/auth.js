const express = require('express');
const router = express.Router();
require("../db/conn");
const User = require("../modal/userSchema");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Authenticate = require('../middleware/authenticate');

router.get('/', (req, res) => {
    res.send("hello world from the server from router");
});

// register user using promises
// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body;

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "Plz fill the field properly" });
//     }

//     User.findOne({ email: email }).then((userExist) => {
//         if (userExist) {
//             return res.status(422).json({ error: "Email already exist" });
//         }

//         const user = new User({
//             name: name,
//             email: email,
//             phone: phone,
//             work: work,
//             password: password,
//             cpassword: cpassword
//         });

//         user.save().then((user) => {
//             res.status(201).json({ message: "user registered successfully" });
//         }).catch((err) => {
//             res.status(500).json({ error: "Failed to registered" });
//         }

//         );

//     }).catch((err) => {
//         res.status(500).json({ error: "something went wrong" });
//     });

// });


// register user using async and await
router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Plz fill the field properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password is not matching" });
        } else {
            const user = new User({
                name: name,
                email: email,
                phone: phone,
                work: work,
                password: password,
                cpassword: cpassword
            });
            await user.save();
            res.status(201).json({ message: "user registered successfully" });
            
        }
    } catch (err) {
        console.log(err);
    }
});


// login route
router.post('/signin', async (req, res) => {
    // console.log(req.body);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Plz fill the data" })
        }

        const userLogin = await User.findOne({ email: email });

        // console.log(userLogin);
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            // console.log(isMatch);

            const token = await userLogin.generateAuthToken();
            // console.log(token);

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "invalid credentials" });
            } else {
                res.json({ message: "user login Successfully" });
            }
        } else {
            res.status(400).json({ error: "invalid credentials" });
        }

    } catch (err) {
        console.log(err);
    }
})

// about 
router.get('/about',Authenticate,  (req, res)=>{
    
    res.send(req.rootUser);
});

// get user data for contact us and home page
router.get('/getdata',Authenticate, (req, res)=>{
    res.send(req.rootUser);
});

router.post('/contact',Authenticate, async (req, res) => {
    try{
        const {name, email, phone, message} = req.body;

        if(!name || !email || !phone || !message){
            console.log("error in contact form");
            return res.json({error: "plzz fill the contact form"});
        }

        const userContact = await User.findOne({_id: req.userID}); //userID is coming from authenticate

        if(userContact) {

            const userMessage = await userContact.addMessage(name, email, phone, message);
            
            await userContact.save();

            res.status(201).json({message: "user contact successfully"});

        }


    }catch(err){
        console.log(err);
    }
})

// logout page
router.get('/logout', (req, res) => {
    console.log('logout');
    res.clearCookie('jwtoken', {path: '/'})
    res.status(200).send('user logout');
})


module.exports = router;