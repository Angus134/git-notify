
import Router from 'koa-router';
const router = new Router();
import {
    sendMsg2DingTalk
} from '../notify/dingtalk';
import {
    commentEventMsg,
    branchUpdateMergeEventMsg,
    branchUpdateCommitEventMsg
} from '../notify/message';
// 钉钉通知群
const accessToken = 'db6310928c16d4f7a7aa12b7fbb935e2cc5b42557b6e1d233265f07044fbf55'; // 消息通知群 替换成你的机器人tokens
function checkBranch (branch) {
    if (branch === 'master') return true;
    if (branch.startsWith('dev')) return true;
    if (branch.startsWith('hotfix')) return true;
    return false;
}

router.get('/branch-update/webhook', async (ctx) => {
    ctx.response.body = 'you need access post method';
})

router.post('/branch-update/webhook', async (ctx) => {
    const body = ctx.request.body
    if (body && body.object_kind) {
        // WIP状态的不通知
        if (body.object_attributes && body.object_attributes.title && body.object_attributes.title.indexOf('WIP') !== -1) {
          return
        }
        if (body.merge_request && body.merge_request.title && body.merge_request.title.indexOf('WIP') !== -1) {
          return
        }
        switch (body.object_kind) {
            case 'merge_request':
                sendMsg2DingTalk(branchUpdateMergeEventMsg(body), accessToken);
                break;
            case 'push':
                if (checkBranch(body.ref.split('/').reverse()[0])) {
                    sendMsg2DingTalk(branchUpdateCommitEventMsg(body), accessToken);
                }
                break;
            case 'note':
            sendMsg2DingTalk(commentEventMsg(body), accessToken)
                break;
            default:
                break
        }
    }
    ctx.response.body = 'ok';
})

export default router;
