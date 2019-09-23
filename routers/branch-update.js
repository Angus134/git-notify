
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
const accessToken = '959b431b88fca903411f2c712a3776ec374e74839f48071df8524af8e31a1541';

function checkBranch (branch) {
    if (branch === 'master') return true;
    if (branch.startsWith('dev')) return true;
    if (branch.startsWith('hot-fix')) return true;
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
                if (checkBranch(body.object_attributes.target_branch)) {
                    console.log('need notify');
                    sendMsg2DingTalk(branchUpdateMergeEventMsg(body), accessToken);
                }
                break;
            // case 'push':
            //     if (checkBranch(body.ref.split('/').reverse()[0])) {
            //         console.log('need notify');
            //         sendMsg2DingTalk(branchUpdateCommitEventMsg(body), accessToken);
            //     }
            //     break;
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