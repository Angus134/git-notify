const axios = require('axios'),

function mergeEvent(body){
    const { object_kind, user, object_attributes } = body.object_kind;, 
    const notifyMsg = `Build Notice:
事件: \t\t${'合并请求'}
发起者: \t\t\t${user.name}
合并来源: \t\t${object_attributes.source_branch}
合并目标: \t\t${object_attributes.target_branch}
请求时间：\t\t${object_attributes.created_at}
更新时间：\t\t${bject_attributes.updated_at}
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
