// curl -d "token=xyaskdfjlkjo1i34ih21njnsdfn&GIT_BRANCH_TEST=Test" "http://172.28.49.2/jenkins/job/bluesea-front-hook/buildWithParameters"  --user "robot:robot911"
// 
// 

const request = require('request');

const jenkinsServer = 'http://172.18.0.157:9999';

// 当PR会建立时发送请求，予以测试该需要合并的分支，当Dev有分支合并请求时候发送
function triggerTest (branch) {
    const options = {
        url: jenkinsServer + '/job/bluesea-front-hook/buildWithParameters?token=FRONTENDHOOKCENTER&GIT_BRANCH_TEST=' + branch,
        auth: {
            username: 'robot',
            password: 'robot911'
        },
        method: 'POST',
        timeout: 3000
    };
    request(options, function (err, res) {
        if (err) {
            console.log(err);
        }
    });

}


// 发送build请求，当dev有分支被合并完成时候进行发送
function triggerBuildDev (sourceBranch, targetBranch) {
    let jobName = 'bluesea-front';
    // 如果不是dev-v1.1.1类似的结构，则不触发jenkins
    if (!targetBranch.match(/dev-v(\d+)\.(\d+)\.(\d+)/)) return;

    const version = parseInt(targetBranch.match(/dev-v(\d+)\.(\d+)\.(\d+)/)[3], 10);
    if (version % 2) { // 奇数版本 

    } else { // 偶数版本
        jobName = 'bluesea-front-dev2';
    }

    const options = {
        url: jenkinsServer + '/job/'+ jobName +'/buildWithParameters?token=FRONTENDHOOKCENTER&GIT_BRANCH_TEST=origin/' + targetBranch,
        auth: {
            username: 'robot',
            password: 'robot911'
        },
        method: 'POST',
        timeout: 3000
    };
    request(options, function (err, res) {
        if (err) {
            console.log(err);
        }
    });

}

// 触发某些事情
function triggerSomething (prObj) {
    const kind = prObj.object_kind,
        mergeStatus = prObj.object_attributes.merge_status;

    if (kind !== 'merge_request') return;

    switch (mergeStatus) {
        // 触发测试
        case 'unchecked':
            triggerTest(prObj.object_attributes.source_branch);
            break;
        // 触发build
        case 'can_be_merged':
            triggerBuildDev(prObj.object_attributes.source_branch, prObj.object_attributes.target_branch);
            break;
        default:
            break;
    }
}

// triggerTest('dev-v1.0.7');
// triggerBuildDev('', 'FX-trade-wp');

exports.triggerTest = triggerTest;
exports.triggerBuildDev = triggerBuildDev;
exports.triggerSomething = triggerSomething;
