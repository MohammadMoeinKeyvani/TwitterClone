const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schemas/UserSchema');


app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render("register.pug");
})

router.post("/", async (req, res, next) => {

    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;

    if(firstName && lastName && username && email && password) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email },
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "مشکلی پیش آمده.";
            res.status(200).render("register.pug", payload);
    
        })

        if(user == null) {
            // No user found

            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "ایمیل از قبل وجود دارد.";
            }
            else {
                payload.errorMessage = "نام کاربری قبلاً گرفته شده است.";
            }
            res.status(200).render("register.pug", payload);
        }
    }
    else {
        payload.errorMessage = "مطمئن شوید که تمام فیلدها دارای یک مقدار معتبر هستند.";
        res.status(200).render("register.pug", payload);
    }
})

module.exports = router;