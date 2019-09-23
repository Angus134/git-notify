
import moment from 'moment';

// 初始发送合并请求时候的函数
export function mergeEventMsg(body) {
    const {
        object_kind,
        user,
        object_attributes
    } = body
    const notifyMsg = `Notice:
事件:\t\t\t\t${'合并请求'}
状态：\t\t\t\t${object_attributes.merge_status}
请求名称:\t\t${object_attributes.title} 
操作人:\t\t\t${user.username}
合并来源:\t\t${object_attributes.source_branch}
合并目标:\t\t${object_attributes.target_branch}
创建时间:\t\t${moment( +new Date(object_attributes.created_at)).format('YYYY-MM-DD HH:mm')}
更新时间:\t\t${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
描述: \r
${object_attributes.description} 
--------------------------
最后提交信息：
ID:   \t\t${object_attributes.last_commit.id}
Message:\t${object_attributes.last_commit.message}
Url:\t\t\t${object_attributes.last_commit.url}
--------------------------`
    return notifyMsg
}

// comment 类型的请求  分为 changes 和普通 commit
export function commentEventMsg(body) {
    const {
        object_kind,
        user,
        author,
        object_attributes,
        merge_request
    } = body
    const notifyMsg = `名称: ${merge_request.title}
Hi～${merge_request.last_commit.author.name},|${user.username}|评论了你:\t\t${object_attributes.note}
地址:\t\t\t${object_attributes.url}
时间:\t\t${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
    `
    return notifyMsg
}


// master、dev、分支更新提醒
export function branchUpdateMergeEventMsg(body) {
    const {
        object_kind,
        user,
        object_attributes,
        author,
        assignee
    } = body
    let assigneeObj = assignee
    if(!assigneeObj) assigneeObj = { username: '暂未指定人员'}
    let notifyMsg = ''
    const action = object_attributes.action
    if (action === 'merge') {
        notifyMsg = `@${user.username}, ${assigneeObj.username}已经帮你合并了代码～
        名称:${object_attributes.title}
        地址:${object_attributes.url}
        时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    } else if (action === 'open') {
        notifyMsg = `
@${assigneeObj.username}, ${user.username}喊你帮忙review代码啦～
地址:${object_attributes.url}
项目:${object_attributes.source.name}
事件:${object_attributes.target_branch}更新
操作:${user.username}
提交:${object_attributes.last_commit.author.name}
时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
描述:${object_attributes.description} `
    } else if (action === 'close'){
        notifyMsg = `${object_attributes.last_commit.author.name}关闭了该合并请求 「${object_attributes.title}」～
        名称:${object_attributes.title}
        地址:${object_attributes.url}
        时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    } else if (action === 'reopen') {
        notifyMsg = ` ${object_attributes.last_commit.author.name}重新打开了该合并请求「${object_attributes.title}」～
        名称:${object_attributes.title}
        地址:${object_attributes.url}
        时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    } else {
        notifyMsg = `
        @${assigneeObj.username}, 新的更改已经提交～
        名称:${object_attributes.title}
        更新:${object_attributes.last_commit.url}
        地址:${object_attributes.url}
        时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    }
    return notifyMsg;
}


// master、dev分支更新提醒
export function branchUpdateCommitEventMsg(body) {
    const {
        commits,
        user,
        project
    } = body
    const notifyMsg = `
项目:\t\t${project.name}
事件:\t\t${body.ref.split('/').reverse()[0]}分支更新
操作:\t\t${body.username}
描述:\t\t${body.total_commits_count}个commit提交
最后更新:\t\t${commits[commits.length - 1].url}`
    return notifyMsg;
}
