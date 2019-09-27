
import https from 'https';
// FrontEnd DLP & DP Notice test
const accessToken = '783b9756c9c5c8bd2507bf7ed0278a9b0ced58d26d9ecf6a51a31622c3c2b124';
export function sendMsg2DingTalk(message, token = accessToken) { // 通知钉钉机器人
    // @成员需要手机号
    const members = {
        wangjia: '18618239312',
        danfeng: '15091675108',
        shumei: '13522749761',
        wuping: '17610613629'
    }
    const dingPath = `/robot/send?access_token=${token}`;
    const data = {
        msgtype: 'text',
        text: {
            content: message
        },
        at: {
            "atMobiles": [
            members.wuping
            ], 
            "isAtAll": false
        }
    }
    const postData = JSON.stringify(data)
    console.log(postData, 'postData')
    const options = {
        hostname: 'oapi.dingtalk.com',
        port: 443,
        path: dingPath,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            
            'Content-Length': Buffer.byteLength(postData),
        }
    };
    const req = https.request(options, (res) => {
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
            console.log(res, chunk)
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {});
    req.write(postData);
    req.end();
}
