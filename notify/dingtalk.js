
import https from 'https';
export function sendMsg2DingTalk(opt = {}, token) { // 通知钉钉机器人
    // @成员需要手机号
    const members = {
        zhangsan: '1234567890',
        张三: '1234567890'
    }
    const operator = opt.user
    const dingPath = `/robot/send?access_token=${token}`;
    const data = {
        msgtype: 'text',
        text: {
            content: opt.msg
        },
        at: {
            "atMobiles": [
            members[operator]
            ],
            "isAtAll": false
        }
    }
    const postData = JSON.stringify(data)
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

    req.on('error', (e) => {
        console.info(e, 'error')
    });
    req.write(postData);
    req.end();
}
