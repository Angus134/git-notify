const axios = require('axios'),

function pushEvent(body){
    const { object_kind,  } = body.object_kind;

    const notifyMsg = `Build Notice:
事件: \t\t${}
分支: \t\t\t${gitBranch.sync()}
IP地址: \t\t${ip.address()}
时间: \t\t\t${moment().format('MM-DD H:mm')}
最近commit记录(七天): 
--------------------------
${gitLogMsg}

--------------------------`;
    // console.log(notifyMsg);
    axios({
        method: 'POST',
        url: robotUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            msgtype: 'text', 
            text: {
                content: notifyMsg
            }
        }
    })
}
