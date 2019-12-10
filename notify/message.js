
import moment from 'moment';
import mappingMembers from './teamMembers'

// 初始发送合并请求时候的函数 未使用
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

// comment 类型的请求  分为 changes 和普通 commit  使用中
export function commentEventMsg(body) {
    const {
        object_kind,
        user,
        author,
        object_attributes,
        merge_request
    } = body
    merge_request.last_commit.author.name = formatName(merge_request.last_commit.author.name) || merge_request.last_commit.author.name
    user.username = formatName(user.username)
    let text = '评论了你'
    let userName = merge_request.last_commit.author.name
    if (merge_request.last_commit.author.name === user.username) {
      text = '回复道'
      userName = null
    }
    const notifyMsg = `名称: ${merge_request.title}
${user.username}|${text}:\t\t${object_attributes.note}
地址:\t\t\t${object_attributes.url}
时间:\t\t${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
    `
    return { msg: notifyMsg, user: userName }
}

function formatName(username_string) {
    // 根据组别将英文名映射成中文名
    // mappingMembers
    const membersName = mappingMembers('team1')
    for (let key in membersName) {
        if (username_string.toUpperCase().indexOf(key) !== -1) {
            return membersName[key]
        }
    }
}


// 分支更新提醒 使用中
export function branchUpdateMergeEventMsg(body) {
    const {
        object_kind,
        user,
        object_attributes,
        author,
        assignee
    } = body
    let who = 'nobody'
    let assigneeObj = assignee
    if(!assigneeObj.username) assigneeObj = { username: '暂未指定人员'}
    assigneeObj.username = assignee ? formatName(assigneeObj.username) : assigneeObj.username
    user.username = formatName(user.username)
    object_attributes.last_commit.author.name = formatName(object_attributes.last_commit.author.name)
    let notifyMsg = ''
    const action = object_attributes.action
    if (action === 'merge') {
        let selfTips = `@${object_attributes.last_commit.author.name}, ${user.username}已经帮你合并了代码～`
        who = object_attributes.last_commit.author.name
        if (object_attributes.last_commit.author.name === user.username) {
          who = null
          selfTips = `${user.username}合并了代码～`
        }
        notifyMsg = `${selfTips}
名称:${object_attributes.title}
地址:${object_attributes.url}
时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    } else if (action === 'open') {
        who = assigneeObj.username
        notifyMsg = `@${assigneeObj.username}, ${user.username}喊你帮忙review代码啦～
名称:${object_attributes.title}
地址:${object_attributes.url}
项目:${object_attributes.source.name}
操作:${user.username}
描述:${object_attributes.description} `
    } else if (action === 'close'){
        who = object_attributes.last_commit.author.name
        notifyMsg = `${user.username}关闭了该合并请求 「${object_attributes.title}」～
名称:${object_attributes.title}
地址:${object_attributes.url}
时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    } else if (action === 'reopen') {
        who = object_attributes.last_commit.author.name
        notifyMsg = `${user.username}重新打开了该合并请求「${object_attributes.title}」～
名称:${object_attributes.title}
地址:${object_attributes.url}
时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    } else {
        who = assigneeObj.username
        let msgTips = `@${assigneeObj.username}, 新的更改已经提交～`
        if (object_attributes.last_commit.author.name === user.username) {
          who = null
          msgTips = `${user.username}更新了代码～`
        }
        notifyMsg = `${msgTips}
名称:${object_attributes.title}
更新:${object_attributes.last_commit.url}
地址:${object_attributes.url}
时间:${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}`
    }
    return { msg: notifyMsg, user: who }
}


// master、dev分支更新提醒 未使用
export function branchUpdateCommitEventMsg(body) {
    const {
        commits,
        user,
        project
    } = body
    const notifyMsg = `项目:\t\t${project.name}
事件:\t\t${body.ref.split('/').reverse()[0]}分支更新
操作:\t\t${body.username}
描述:\t\t${body.total_commits_count}个commit提交
最后更新:\t\t${commits[commits.length - 1].url}`
    return notifyMsg;
}
