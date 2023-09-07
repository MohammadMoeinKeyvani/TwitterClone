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
    res.status(200).render("login.pug");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername },
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "مشکلی پیش آمده.";
            res.status(200).render("login.pug", payload);
    
        })

        if(user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if(result === true) {
                req.session.user = user;
                return res.redirect("/");
            }
        }

        payload.errorMessage = "نام کاربری یا رمز عبور نامعتبر است.";
        return res.status(200).render("login.pug", payload);
    }

    payload.errorMessage = "مطمئن شوید که هر فیلد دارای یک مقدار معتبر است.";
    res.status(200).render("login.pug");
})

module.exports = router;