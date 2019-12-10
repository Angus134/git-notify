
import https from 'https';
// FrontEnd DLP & DP Notice test
// const accessToken = '17ccb4edf2a916d88731a814e558d56efaf493f70e9020761bd2ae0f5759f1f8'; // 啦啦啦测试群
// const accessToken = 'db1310928c16d4f7a7aa12b7fbb905e2cc5b42557b6e7d233265f07044fbf585'; //  web消息通知群
export function sendMsg2DingTalk(opt = {}, token) { // 通知钉钉机器人
    // @成员需要手机号
    const members = {
        wangjia: '18618239312',
        danfeng: '15091675108',
        shumei: '13522749761',
        wuping: '17610613629',
        chenhao: '18667000652',
        王佳: '18618239312',
        丹凤: '15091675108',
        淑美: '13522749761',
        吴平: '17610613629',
        陈浩: '18667000652',
        Angus: '17610613629'
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
