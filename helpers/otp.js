
const accountSID=process.env.ACCOUNT_SID;
const serviceID=process.env.SERVICE_ID;
const authToken=process.env.AUTH_TOKEN;
const client =require('twilio')(accountSID,authToken)



module.exports={

    sendOTP:(phoneNumber,mobileNumber)=>{
        phoneNumber=`+91${phoneNumber}`;
        if(phoneNumber==mobileNumber){
            client
        .verify
           .services(serviceID)
           .verifications
           .create({
            to:phoneNumber,
            channel:sms
           }).then((data)=>{
            result.message='OTP send to your registered Phonenumber'
           });
        }else{
            return message='Please enter your registered Phone Number';
        }
       
    },


     verifyOTP:(OTPValue,phoneNumber)=>{
        return new Promise(async(response,reject)=>{
            phoneNumber=`+91${phoneNumber}`
            let OTP=''
            let OTPVerify
            OTPValue.forEach(digit => {
                OTP+=digit;                
            });
            if(OTP.length==6){
                await client
                .verify
                .services(serviceID)
                .verificationChecks
                .create({
                    to:phoneNumber,
                    code:OTP
                }).then((data)=>{
                    if(data.status=='verified'){
                    OTPVerify=true;
                }else{
                    OTPVerify=false
            }})
                
                }else{
                    OTPVerify=false
                }
                response(OTPVerify)
                
            })
        },
     

    }