//express import 
const express = require('express')
// const session = require('express-session')
const dataServices = require('./services/data.services')
const jwt = require('jsonwebtoken')
const cors = require('cors')

// app creation
const app = express()
app.use(express.json())
// allow resource sharing
app.use(cors({
    // origin:'http://localhost:4200',
    origin:'http://localhost:4200',
    credentials:true
}))

// session usage
// app.use(session({
//     secret:'randomkey',
//     // resave true: need to save unmodified values in session
//     // resave false: need not to save unmodified values in session
//     resave:false,
//     saveUninitialized:false
// }))

// middleware application specific, works in entire application
// app.use((req,res,next)=>{
//     console.log("middelware")
//     next()
// })

// middleware - router specific
// const authMiddleWare = (req,res,next)=>{
//     if(!req.session.currentAccNo){
//         const result = ({
//           statusCode:401,
//           status:false,
//           message:"Please Login to Transact..."
//         })
//         res.status(result.statusCode).json(result)
//       }else{
//           next()
//       }
// }

// token validation
const jwtMiddleWare = (req,res,next)=>{
    try{
        const token = req.headers["x-token"]
        const data = jwt.verify(token,'supersecretkey123')
        req.currAccNo=data.currentAccNo
        // console.log(req.currAccNo);
        next()
    }
    catch{
        const result = ({
            statusCode:401,
            status:false,
            message:"Please Login to Transact..."
          })
          res.status(result.statusCode).json(result)
    }
    
}

// http methods
app.get('/', (req,res)=>{
    res.send("GET Method - Read")
})

app.put('/', (req,res)=>{
    res.send("PUT Method - Update Completely")
})

app.post('/', (req,res)=>{
    res.send("POST Method - Create")
})
 
app.patch('/', (req,res)=>{
    res.send("PATCH Method - Update Partially")
})

app.delete('/', (req,res)=>{
    res.send("DELETE Method - Delete")
})

// token testing
app.post('/token', jwtMiddleWare, (req,res)=>{
    res.send("Current Account Number is: "+req.currAccNo)
})

app.post('/createAcc', (req,res)=>{
    dataServices.createAccount(req.body.p_name, req.body.ac_no, req.body.uname, req.body.p_word1, req.body.balance).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

app.post('/authenticate', (req,res)=>{
    dataServices.authenticate(req.body.ac_no, req.body.p_word1).then(result=>{
        res.status(result.statusCode).json(result)
    })
    

})

app.post('/deposit', jwtMiddleWare, (req,res)=>{
    dataServices.deposit(req.body.ac_no, req.body.p_word1, req.body.amount).then(result=>{
        res.status(result.statusCode).json(result)
    })

})

app.post('/withdraw', jwtMiddleWare, (req,res)=>{
    dataServices.withdraw(req,req.body.ac_no, req.body.p_word1, req.body.amount).then(result=>{
        res.status(result.statusCode).json(result)
    })

})

app.post('/transactions', jwtMiddleWare, (req,res)=>{
    dataServices.getTransactions(req,req.body.ac_no).then(result=>{
        res.status(result.statusCode).json(result)
    })

})

app.delete('/deleteAcc/:ac_no', jwtMiddleWare, (req,res)=>{
    dataServices.deleteAcc(req.params.ac_no).then(result=>{
        res.status(result.statusCode).json(result)
    })

})


// to set port, 3000: default for server
app.listen(3000, ()=>{
    console.log("Server Started Successfully at Port: 3000");
})

