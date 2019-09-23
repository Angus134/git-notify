
import fs from 'fs';
import moment from 'moment';
import marked from 'marked';
import Router from 'koa-router';
import jenkins from '../plugins/jenkins';
import {
    sendMsg2DingTalk
} from '../notify/dingtalk';
import {
    mergeEventMsg,
    commentEventMsg
} from '../notify/message';
import {
    executeShell
} from '../plugins/cmd';

const router = new Router();

// 写入log文件
function writeFile(body) {
    const {
        object_kind,
        user,
        object_attributes
    } = body;

    if (object_attributes.merge_status === 'can_be_merged') {
        const str = `
--------------------  ${user.username} ${moment(+new Date(object_attributes.updated_at)).format('YY-MM-DD H:mm')}  --------------------

${object_attributes.description}

`
        fs.appendFile('log.txt', str, (err) => {
            console.log(err)
        })
    }
}

router.get('/git-notify/master1', async (ctx) => {
    ctx.response.body = 'you need access dev[post]';
})

router.post('/git-notify/master1', async (ctx) => {
    const body = ctx.request.body
    console.info(body, '****')
    if (body && body.object_kind) {
        switch (body.object_kind) {
            case 'push': executeShell('sh', ['./shell.sh'], (text) => { console.log(text) })
              break;
            case 'merge_request':
                {
                    sendMsg2DingTalk(mergeEventMsg(body))
                    writeFile(body)
                }
                break;
            case 'note':
                sendMsg2DingTalk(commentEventMsg(body))
                break;
            default:
                break
        }
    }
    ctx.response.body = 'ok';
})

export default router;