
import Router from 'koa-router';
import {
    executeShell
} from '../plugins/cmd';

const router = new Router();

router.get('/lion-design/webhook', async (ctx) => {
    ctx.response.body = 'you need access dev[post]';
})

router.post('/lion-design/webhook', async (ctx) => {
    const body = ctx.request.body
    if (body && body.object_kind) {
        switch (body.object_kind) {
            // case 'push': executeShell('sh', ['./shell.sh'], (text) => { console.log(text) })
            // break;
            case 'merge_request':
                if (body.object_attributes.merge_status === 'can_be_merged' &&
                    body.object_attributes.target_branch === 'master') {
                    executeShell('sh', ['./shells/update-lion-design.sh'], (text) => {
                        console.log(text);
                    });
                }
                break;
            default:
                break
        }
    }
    ctx.response.body = 'ok';
})

export default router;