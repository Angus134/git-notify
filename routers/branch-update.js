
import Router from 'koa-router';
const router = new Router();
import {
    sendMsg2DingTalk
} from '../notify/dingtalk';
import {
    branchUpdateMergeEventMsg,
    branchUpdateCommitEventMsg
} from '../notify/message';

// 默认向Git通知群发送消息
const accessToken = 'd793910db09fc95e9cd55d7c6a7651105a8a57020f1b0899dc1aea3dff01743b';

function checkBranch (branch) {
    if (branch === 'master') return true;
    if (branch === 'trunk') return true;
    if (branch.startsWith('dev-v')) return true;
    if (branch.startsWith('test-v')) return true;
    return false;
}

router.get('/branch-update/webhook', async (ctx) => {
    ctx.response.body = 'you need access post method';
})

router.post('/branch-update/webhook', async (ctx) => {
    const body = ctx.request.body
    if (body && body.object_kind) {
        switch (body.object_kind) {
            case 'merge_request':
                if (body.object_attributes.merge_status === 'can_be_merged' &&
                    checkBranch(body.object_attributes.target_branch)) {
                    console.log('need notify');
                    sendMsg2DingTalk(branchUpdateMergeEventMsg(body), accessToken);
                }
                break;
            case 'push':
                if (checkBranch(body.ref.split('/').reverse()[0])) {
                    console.log('need notify');
                    sendMsg2DingTalk(branchUpdateCommitEventMsg(body), accessToken);
                }
                break;
            default:
                break
        }
    }
    ctx.response.body = 'ok';
})

export default router;