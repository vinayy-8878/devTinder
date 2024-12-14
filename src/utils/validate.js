const validator=require("validator");
const signUpValidation=(req)=>{
    const {firstName,emailId,password}=req.body;
    if(!firstName){
        throw new Error("Please enter your first name.")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("The entered email is invalid.")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password.")
    }
}


const  loginValidation=(req)=>{
    const {emailId,password}=req.body;
   if(!validator.isEmail(emailId) || !emailId){
        throw new Error("Please enter a valid email.")
    }
    else if(!password){
        throw new Error("Please enter your password.")
    }
}

const validateEditProfileData=(req)=>{
const allowedEditFields=["firstName","lastName","emailId","age","gender","skills","about","photoUrl"]
console.log(req.body)
const isEditAllowed=Object.keys(req.body).every(field=>allowedEditFields.includes(field));

return isEditAllowed;
}
 module.exports={signUpValidation,loginValidation,validateEditProfileData}