module.exports =(req,res,next)=>{
    res.responseHandler =(data,message="",status=200,count)=>{
    if((data instanceof Object && data.constructor !== Array)||
    (typeof date==="number" && isFinite(data))||
    data instanceof String
    ){
        data=[data]
    }
    else if(Array.isArray(data)){}
    else{
        data=[]
    }

    if(typeof message ==="string" || message instanceof String){
        message=message
    }
    return res.json({
        status,
        data,
        message,
        count
    })
    };
    next();
}