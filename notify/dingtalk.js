
import https from 'https';
// FrontEnd DLP & DP Notice test
const accessToken = '959b431b88fca903411f2c712a3776ec374e74839f48071df8524af8e31a1541';
export function sendMsg2DingTalk(message, token = accessToken) { // 通知钉钉机器人
    const dingPath = `/robot/send?access_token=${token}`;
    const data = {
        msgtype: 'text',
        text: {
            content: message
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
