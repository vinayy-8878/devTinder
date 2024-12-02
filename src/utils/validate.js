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
 module.exports={signUpValidation}