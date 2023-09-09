const express = require('express');
const { getadminUserList, AdminSignup } = require("../controllers/UserControllers");
const {  secureMiddleware } = require("../middleware/secureMiddleware");
const { userVerification } = require('../middleware/authentication');
const router = express.Router();

router.post("/Adminsignup",secureMiddleware, AdminSignup,(req, res) => {
   // The middleware has already verified the token and stored user information in req.user
   // You can access the user information here
   const { user } = req;
 
   // Your code to handle the protected resource
   res.json({ message: 'PERMISSION GRANTED FOR THE PROTECTED RESOURCE', user });
 });
router.post('/', userVerification)

router.get("/users", getadminUserList);

module.exports = router;
