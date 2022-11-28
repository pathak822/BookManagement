const userModel = require('../models/userModel')
const jwt=require("jsonwebtoken")
// const bookModel = require('../models/bookModel')
const emailValidator = require('email-validator')

let regexValidation = new RegExp(/^[a-zA-Z]+([\s][a-zA-Z]+)*$/);
let regexValidNumber = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
const passwordFormat = /^[a-zA-Z0-9@]{6,10}$/

const createUser = async  (req, res)=> {
try {
    let data = req.body
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "plzz give some data" })

    const { title, name, phone, email, password, address} = data//-----

    if (!title || !name || !phone || !email ||!password) {
        return res.status(400).send({ status: false, msg: "Please Enter mandatory details" })}
    
    if (title != "Mr" && title != "Miss" && title != "Mrs"){
        return res.status(400).send({ msg: "Please write title like Mr, Mrs, Miss" });
    }
    if (!regexValidation.test(name)) return res.status(400).send({ status: false, msg: "Please Enter Valid Name" })
   if (!regexValidNumber.test(phone)) return res.status(400).send({ status: false, msg: "Please Enter Valid Phone Number" })
    if (!emailValidator.validate(email)) return res.status(400).send({ status: false, msg: "Please Enter Valid email ID" })
    
    const validPassword = passwordFormat.test(password)
    if (!validPassword){return res.status(400).send({ status: false, msg: " Incorrect Password, It should be of 6-10 digits with atlest one special character, alphabet and number" });}

    const chkPhone= await userModel.findOne({phone:phone,email:email, isDeleted: false })
    if (chkPhone)return res.status(400).send({ status: false, msg: "Phone/email already exists" });//----


    const user= await userModel.create(data);return  res.status(201).send({ status: true, Data: user })
  } catch (error) {res.status(500).send({ status: false, msg: error.message })}
}
// ---------------login----
const loginData = async function (req, res) {
    try {
      let userdata = req.body
      
      let {email,password}=userdata


      let userInfo = await userModel.findOne({ email: email, password: password });
      if (!userInfo){
        return res.status(400).send({ Status: false, massage: "Plase Enter Valid UserName And Password" })}
  
      let userToken = jwt.sign({
        UserId: userInfo._id.toString()
      },
        'Blook-Project',{expiresIn:"18000s"}
      )
      return res.status(200).send({Status: true, Msg: " Your JWT Token is successful generated",  MyToken: userToken })
    }
    catch (err) {
     return res.status(500).send({ status: false, errer: err })
    }
  }



module.exports = { createUser,loginData};