const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");

function getWebHost(callback) {
    const cmd = os.platform() === 'win32' ? 'set' : 'printenv';
    exec(cmd, (error, stdout, stderr) => {
        if (error || stderr) {
            console.error("Lỗi khi chạy printenv:", error || stderr);
            return callback(null);
        }

        const line = stdout.split('\n').find(line => line.startsWith('WEB_HOST='));
        if (line) {
            const host = line.split("=")[1].trim();
            return callback(host);
        } else {
            console.log("WEB_HOST không được tìm thấy, tiếp tục tìm...");
            setTimeout(() => getWebHost(callback), 5000);
        }
    });
}


function saveTextToJsonFile(url) {
    const filePath = path.join(__dirname, 'urls.json');
    const dataToSave = [[url]];

    try {
        fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
        console.log('✔ Đã ghi đè urls.json');
    } catch (err) {
        console.error('❌ Lỗi ghi file:', err);
    }
}

// Khởi động
let cachedWebHost = null;
function start() {
    if (cachedWebHost) {
        const url = "1997-" + cachedWebHost;
        const fullUrl = "https://" + url;
        startMainLoop(url);
        return;
    }
  
    getWebHost((webHost) => {
        if (!webHost) {
            // Nếu lỗi, thử lại sau 5 giây
            return setTimeout(start, 5000);
        }
  
        cachedWebHost = webHost; // lưu lại để không gọi lại lần sau
  
        const url = "1997-" + webHost;
        const fullUrl = "https://" + url;
        startMainLoop(url);
    });
  }

start(); // bắt đầu từ đây
