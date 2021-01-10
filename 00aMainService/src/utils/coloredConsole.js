const chalk = require('chalk');


const redLog = (msg)=>{console.log(chalk.red(msg));};
const greenlog = (msg)=>{console.log(chalk.green(msg));};
const bluelog = (msg)=>{console.log(chalk.blue(msg));};


module.exports ={
   redLog,
   greenlog,
    bluelog
};