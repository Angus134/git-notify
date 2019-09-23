
import moment from 'moment';
import body from './api.json'

// 初始发送合并请求时候的函数
export function mergeEventMsg() {
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
export function commentEventMsg() {
    console.log(body, 'body')
    const notifyMsg = '测试'
    return notifyMsg
}


// master、dev、test、trunk分支更新提醒
export function branchUpdateMergeEventMsg() {
    const {
        object_kind,
        user,
        object_attributes
    } = body
    const notifyMsg = `Branch Update Notice
项目:\t\t${object_attributes.source.name}
事件:\t\t${object_attributes.target_branch}更新
操作:\t\t${user.username}
提交:\t\t${object_attributes.last_commit.author.name}
时间:\t\t${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
描述:\t\t${object_attributes.description} `
    return notifyMsg;
}


// master、dev、test、trunk分支更新提醒
export function branchUpdateCommitEventMsg() {
    const {
        object_kind,
        user,
        project
    } = body
    const notifyMsg = `Branch Update Notice
项目:\t\t${project.name}
事件:\t\t${body.ref.split('/').reverse()[0]}分支更新
操作:\t\t${body.user_name}
描述:\t\t${body.total_commits_count}个commit提交 `
    return notifyMsg;
}
