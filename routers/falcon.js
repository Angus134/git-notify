
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

router.get('/git-notify/master', async (ctx) => {
    console.info('ctx')
    ctx.response.body = 'you need access dev[post]';
})

router.post('/git-notify/master', async (ctx) => {
    const body = ctx.request.body
    console.info(body, '****')
    <!-- if (body && body.object_kind) {
        switch (body.object_kind) {
            case 'merge_request':
                {
                    // executeShell('sh', ['./shell.sh'], (text) => { console.log(text) })
                    sendMsg2DingTalk(mergeEventMsg(body))
                    jenkins.triggerSomething(body);
                    writeFile(body)
                }
                break;
            case 'note':
                sendMsg2DingTalk(commentEventMsg(body))
                break;
            case 'push':
                sendMsg2DingTalk(commentEventMsg(body))
                break;
            default:
                break
        }
    } -->
    ctx.response.body = 'ok';
})

// Merge LOG  路由 
router.get('/log', async (ctx, next) => {
    ctx.response.body = marked(fs.readFileSync('log.txt', 'utf-8'))
    await next()
})

router.post('/signin', async (ctx, next) => {
    var name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'admin' && password === 'front') {
        ctx.response.body = `<a href='/bushu4'>${'.4 部署'}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

export default router;