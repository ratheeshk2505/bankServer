const db = require('./db')
const jwt = require('jsonwebtoken')
  
// let user={
//     1000: {p_name:"Ram", ac_no:1000, uname:"ram", p_word1:"ram123", balance:5000, transaction:[]},
//     1001: {p_name:"Ravi", ac_no:1001, uname:"ravi", p_word1:"ravi123", balance:2000, transaction:[]},
//     1002: {p_name:"Raman", ac_no:1002, uname:"raman", p_word1:"raman123", balance:3000, transaction:[]},
//     1003: {p_name:"Raju", ac_no:1003, uname:"raju", p_word1:"raju123", balance:2500, transaction:[]}
//   }

  const createAccount = (p_name, ac_no, uname, p_word1, balance) =>
  {
    return db.User.findOne({ac_no})
    .then(user=>{
      if(user){
        return{
          statusCode:422,
          status:false,
          message:"User Already Exist"
        }
      }
      else{
        const newUser = new db.User({
          p_name,ac_no,uname,p_word1,balance,transaction:[]
        })
        newUser.save()
        return{
          statusCode:200,
          status:true,
          message:"User Registered Successfully.. Please Login."
        } 
      }
    })
    // // console.log("register called");
    // if(ac_no in user){
    //   return{
    //     statusCode:422,
    //     status:false,
    //     message:"User Already Exist"
    //   }
    // }
    // else{
    //   user[ac_no]={p_name,ac_no,uname,p_word1,balance,transaction:[]}
    //   // console.log(user);
    //   return{
    //     statusCode:200,
    //     status:true,
    //     message:"User Registered Successfully.. Please Login."
    //   }     
    // }
    
  }

  const authenticate = (ac_no,p_word1) => {
    return db.User.findOne({ac_no,p_word1})
    .then(user=>{
      if(user){
        const token = jwt.sign({currentAccNo:ac_no},'supersecretkey123')
        return{
          statusCode:200,
          status:true,
          message:"Login Successfull.",
          token,
          currUser:user.p_name
        } 
      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Invalid Credentials."
        }
      }
      
    })
    // if(ac_no in user){
    //   if(pswrd == user[ac_no]["p_word1"]){
    //     currentUser=user[ac_no]["p_name"]
    //     //acno=ac_no
    //     // req.session.currentAccNo=ac_no
    //     // JWT token generation
    //     const token = jwt.sign({currentAccNo:ac_no},'supersecretkey123')
    //   return{
    //     statusCode:200,
    //     status:true,
    //     message:"Login Successfull.",
    //     token
    //   } 
    // }
    // else{
    //     return {
    //       statusCode:422,
    //       status:false,
    //       message:"Invalid Password."
    //     } 
    // }}
    // else{
    //   return {
    //     statusCode:422,
    //     status:false,
    //     message:"Invalid User."
    //   }
    // }
  }

  const deposit = (ac_no, p_word1, amount) =>{
    var n_amount=parseInt(amount)
    return db.User.findOne({ac_no,p_word1})
    .then(user=>{
      if(!user){
        return {
          statusCode:422,
          status:false,
          message:"Invalid Credentials."
        }
      }
      else{
        user.balance += n_amount
        user.transaction.push({amount:n_amount, type:"CREDIT"})
        user.save()
        return {
          statusCode:200,
          status:true,
          message:"Amount ₹" + n_amount + " Credited Successfully. New balance is ₹" +  user.balance
        }
      }
    })
    // if(ac_no in user){
    //   if(p_word1 == user[ac_no]["p_word1"]){
    //     user[ac_no]["balance"] += n_amount
    //     user[ac_no]["transaction"].push({amount:n_amount, type:"CREDIT"})
    //   return {
    //     statusCode:200,
    //     status:true,
    //     message:"Amount ₹" + n_amount + " Credited Successfully. New balance is ₹" +  user[ac_no]["balance"]
    //   }
    // }
    // else{
    //   return {
    //     statusCode:422,
    //     status:false,
    //     message:"Invalid Password."
    //   } 
    // }}
    // else{
    //   return {
    //     statusCode:422,
    //     status:false,
    //     message:"Invalid User."
    //   }
    // }
  }

  const withdraw = (req,ac_no, p_word1, amount) =>{
    var n_amount=parseInt(amount)
    return db.User.findOne({ac_no,p_word1})
    .then(user=>{
      if(!user){
        // console.log("invalid credential");
        return {
          statusCode:422,
          status:false,
          message:"Invalid Credentials."
        }
      }
      else{
        if(req.currAccNo != user.ac_no){
          return{
            statusCode:422,
              status:false,
              message:"Operation Denied."
          }
        }
        else{
          if(user.balance<n_amount){
            return {
              statusCode:422,
              status:false,
              message:"Insufficient balance."
            }
          }
          else{
              user.balance -= n_amount
              user.transaction.push({amount:n_amount, type:"DEBIT"})
              user.save()
            return {
              statusCode:200,
              status:true,
              message:"Amount ₹" + n_amount + " Debited from Acc No:" + ac_no + ". New balance is ₹" +  user.balance
            }
          }
        }       
      }
    })

    // if(ac_no in user){
    //   if(p_word1 == user[ac_no]["p_word1"]){
    //     if(n_amount>user[ac_no]["balance"]){
    //       return {
    //         statusCode:422,
    //         status:false,
    //         message:"Insufficient balance."
    //       }
    //     }
    //     else{
    //       user[ac_no]["balance"] -= n_amount
    //       user[ac_no]["transaction"].push({amount:n_amount, type:"DEBIT"})
    //       return {
    //         statusCode:200,
    //         status:true,
    //         message:"Amount ₹" + n_amount + " Debited from Acc No:" + ac_no + ". New balance is ₹" +  user[ac_no]["balance"]
    //       }
    //     }
    // }
    // else{
    //   return {
    //     statusCode:422,
    //     status:false,
    //     message:"Invalid Password."
    //   } 
    // }}
    // else{
    //   return {
    //     statusCode:422,
    //     status:false,
    //     message:"Invalid User."
    //   }
    // }
  }

  const getTransactions = (req,ac_no) =>{
    return db.User.findOne({ac_no})
    .then(user=>{
      if(user){
        if(req.currAccNo != user.ac_no){
          return {
            statusCode:422,
            status:false,
            message:"Operation Denied."
          }
        }
        else{
          return{
            statusCode:200,
            status:true,
            transaction: user.transaction       
          }
        }
      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Invalid User."
        }
      }
    })
    // if(ac_no in user){
    //   return{
    //     statusCode:200,
    //     status:true,
    //     transaction: user.transaction       
    //   }
    // }
    // else{
    //   return {
    //     statusCode:422,
    //     status:false,
    //     message:"Invalid User."
    //   }
    // }
  }

  const deleteAcc = (ac_no)=>{
    return db.User.deleteOne({ac_no})
    .then(user=>{
      if (user){
        return{
          statusCode:200,
          status:true,
          message: "Account Deleted Successfully"      
        }
      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Operation Denied."
        }
      }
    })
  }

  module.exports={
    createAccount, authenticate, deposit, withdraw, getTransactions, deleteAcc
  }