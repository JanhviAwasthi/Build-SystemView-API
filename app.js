const { log } = require('console');
const http=require('http');
const os=require('os');
const process=require('process');
const url=require('url');

//!Format bytes to human readable format
function formatBytes(bytes,decimals=2){
    if(bytes===0)return '0 Bytes';
    const k=1024;
    const sizes=['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'];
    const i=Math.floor(Math.log(bytes)/Math.log(k));
    return parseFloat((bytes/Math.pow(k,i)).toFixed(decimals))+' '+sizes[i];
}

//!Format seconds to human readable format
function formatSeconds(seconds){
    const days=Math.floor(seconds/(3600*24));
    const hours=Math.floor((seconds%(3600*24))/3600);
    const minutes=Math.floor((seconds%3600)/60);
    const secs=Math.floor(seconds%60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

os.cpus()[0];
//Get CPU INFO
const getCpuInfo=()=>{
    const model=os.cpus()[0].model;
    const cores=os.cpus().length;
    const architecture=os.arch();
    const loadAvg=os.loadavg();
    return{
        model,
        cores,
        architecture,
        loadAvg
    }
};
getCpuInfo();
//Get Memory INFO
const getMemoryInfo=()=>{
    const total=formatBytes(os.totalmem());
    const free=formatBytes(os.freemem());
    const usage=((1-os.freemem()/os.totalmem())*100).toFixed(2)+'%';
    return { total, free, usage };
}
console.log(getMemoryInfo());

const getOsInfo=()=>{
    const platform=os.platform();
    const type=os.type();
    const release=os.release();
    const hostname=os.hostname();
    const uptime=formatSeconds(os.uptime());
    return({
        type,
        platform,
        release,
        hostname,
        uptime
    });
}
   


//get user info
const getUserInfo=()=>{
    const user=os.userInfo();
    return user;
}
//get network info
const getNetworkInfo=()=>{
    const interfaces=os.networkInterfaces();
    return interfaces;
};

//get process
const getProcessInfo=()=>{
    const pid=process.pid;
    const tittle=process.title;
    const version=process.version;
    const uptime=formatSeconds(process.uptime());
    cwd:process.cwd();
   
    return { pid, tittle, version, uptime, cwd:process.cwd(),
        memoryUsage:{
            rss:formatBytes(process.memoryUsage().rss),
            heapTotal:formatBytes(process.memoryUsage().heapTotal),
            heapUsed:formatBytes(process.memoryUsage().heapUsed),
            external:formatBytes(process.memoryUsage().external),

        },
        env:{
            NODE_ENV:process.env.NODE_ENV || "Not set",
        }
     };

};

//!HTTP Server
const server = http.createServer((req,res)=>{
    const parsedUrl=url.parse(req.url,true);
    res.setHeader('Content-Type','application/json');
    if(parsedUrl.pathname==='/'){
        res.statusCode=200;
        res.end(JSON.stringify({
            name:'System Info API',
            description:'Access system stats and information',
            routes:['/cpu','/memory','/users','/process','/network'],
        }));
    }
    else if(parsedUrl.pathname==='/cpu'){
        res.end(JSON.stringify(getCpuInfo(),null,2));
    }else if(parsedUrl.pathname==='/memory'){
        res.end(JSON.stringify(getMemoryInfo(),null,2));
    }else if(parsedUrl.pathname==='/os'){
        res.end(JSON.stringify(getOsInfo(),null,2));
    }else if(parsedUrl.pathname==='/users'){
        res.end(JSON.stringify(getUserInfo(),null,2));
    }else if(parsedUrl.pathname==='/network'){
        res.end(JSON.stringify(getNetworkInfo(),null,2));
    }else if(parsedUrl.pathname==='/process'){
        res.end(JSON.stringify(getProcessInfo(),null,2));
    }else{
        res.statusCode=404;
        res.end(JSON.stringify({error:'Route not found'}));
    }
});
//!Start the server
const PORT=8080;
server.listen(PORT,()=>{
    console.log(`Server running on port https://localhost:${PORT}`);
});


