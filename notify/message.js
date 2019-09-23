
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
操作人:\t\t\t${user.user_username}
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
        object_attributes,
        merge_request
    } = body
    let diff = '';
    let notifyMsg = ''
    const type = object_attributes.noteable_type
    if (type !== 'Commit') {
        notifyMsg = `Notice:
事件:\t\t\t\t${'MergeRequest changes note '}
Comment:\t\t${object_attributes.note}
Note Type:\t${object_attributes.noteable_type} 
操作人:\t\t\t${user.user_username}
创建时间:\t\t${moment(+new Date(object_attributes.created_at)).format('YYYY-MM-DD HH:mm')}
更新时间:\t\t${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
原始合并请求信息：
    Target Brahch: \t\t${merge_request.target_branch}
    Source Branch: \t\t${merge_request.source_branch}
--------------------------
最后提交信息：
  ID:   \t\t${merge_request.last_commit.id}
  Message:\t${merge_request.last_commit.message}
--------------------------
    `
        if (object_attributes && object_attributes.st_diff) {
            diff =
                `--------------------------
Url:\t\t\t${merge_request.last_commit.url}
--------------------------`
        }
    }
    const commonNote = `
事件:\t\t\t${'Common commits note'}
Comment:\t${object_attributes.note}
Url:\t\t${object_attributes.url}`

    return type === 'MergeRequest' ? notifyMsg + diff : commonNote
}


// master、dev、分支更新提醒
export function branchUpdateMergeEventMsg(body) {
    const {
        object_kind,
        user,
        object_attributes
    } = body
    const notifyMsg = `Branch Update Notice
项目:\t\t${object_attributes.source.name}
事件:\t\t${object_attributes.target_branch}更新
操作:\t\t${user.user_username}
提交:\t\t${object_attributes.last_commit.author.name}
时间:\t\t${moment(+new Date(object_attributes.updated_at)).format('YYYY-MM-DD HH:mm')}
描述:\t\t${object_attributes.description} `
    return notifyMsg;
}


// master、dev分支更新提醒
export function branchUpdateCommitEventMsg(body) {
    const {
        commits,
        user,
        project
    } = body
    const notifyMsg = `Branch Update Notice
项目:\t\t${project.name}
事件:\t\t${body.ref.split('/').reverse()[0]}分支更新
操作:\t\t${body.user_username}
描述:\t\t${body.total_commits_count}个commit提交
最后更新:\t\t${commits[commits.length - 1].url}`
    return notifyMsg;
}
