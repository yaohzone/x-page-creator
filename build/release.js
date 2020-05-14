const fsExtra = require('fs-extra');
const shell = require('shelljs');
const inquirer = require('inquirer');
const path = require('path');
const {resolve, logger} = require('./utils');
const packageJSON = require('../package.json');
const {version: currentVersion, name: programName} = packageJSON;
let gitPath = getGitDepotDir();
if(!gitPath) {
    logger.error(`[${new Date().toLocaleString()}] 没有找到GIT仓库，当前发布脚本依赖GIT!`);
    process.exit(1);
}

let HEAD = fsExtra.readFileSync(resolve(gitPath, 'HEAD'), 'utf-8');
let branchName = HEAD.match(/refs\/heads\/(.+)/);
branchName = branchName && branchName[1];

if(!branchName) {
    logger.error(`[${new Date().toLocaleString()}] 没有找到当前GIT分支，当前发布脚本依赖GIT!`);
    process.exit(1);
}

inquirer.prompt([
    {
        type: 'confirm',
        name: 'preconfirm',
        message: `当前GIT分支[${branchName}]，项目版本[${currentVersion}]，确认已做好发布准备？`,
        default: true
    }
]).then(res => {
    if(!res.preconfirm) {
        return process.exit(0);
    }

    let releaseVersion = '';
    let nextSteps = [
        {
            type: 'list',
            name: 'version',
            message: "请为即将发布的项目选择升级版本号：",
            choices: [
                updateVersionPoint(2),
                updateVersionPoint(1),
                updateVersionPoint(0)
            ]
        },
        {
            type: 'confirm',
            name: 'postconfirm',
            message(answers) {
                releaseVersion = answers.version;
                return `已选择版本号[${answers.version}]，确认继续发布吗？`
            },
            default: true
        }
    ];

    inquirer.prompt(nextSteps).then(answers => {
        if(!answers.postconfirm) {
            return process.exit(0);
        }

        const version = releaseVersion;
        packageJSON.version = version;

        if(!updatePackageJSON(packageJSON)) {
            return ;
        }

        logger.info(`\n[${new Date().toLocaleString()}] Release ${programName} v${version}...`);

        // build resource
        execSimpleCommand(`npm run build`, 'build');

        // git add/commit
        execSimpleCommand(`git add -A`, 'git add');
        execSimpleCommand(`git commit -m "[build] ${programName} v${version}"`, 'git commit', true);

        // git push
        execSimpleCommand(`git push origin ${branchName}`, 'git push branch');
        execSimpleCommand(`git tag -a ${programName}-v${version} -m "v${version}"`, 'git tag');
        execSimpleCommand(`git push origin refs/tags/${programName}-v${version}`, 'git push tag');

        // // git rebase
        // execSimpleCommand('git checkout dev');
        // execSimpleCommand('git rebase master');
        // execSimpleCommand('git push origin dev');

        logger.success(`\n[${new Date().toLocaleString()}] [${programName}] 发布成功!!!`);
    });
});

function updateVersionPoint(index){
    let versions = currentVersion.split('.').map(Number);
    switch(index){
        case 0:
            versions[0] = versions[0]+1;
            versions[1] = 0;
            versions[2] = 0;
            break;
        case 1:
            versions[1] = versions[1]+1;
            versions[2] = 0;
            break;
        case 2:
        default:
            versions[2] = versions[2]+1;
    }
    return versions.join('.');
}

// 执行简单命令
function execSimpleCommand(command, title, ignoreFaild){
    title = title || command;
    title = title[0].toUpperCase() + title.slice(1);
    logger.info(`\n[${new Date().toLocaleString()}] ${title}...`);
    let shellRes = shell.exec(command);
    if(shellRes.code !== 0){
        logger.error(`[${new Date().toLocaleString()}] ${title} failed!`);
        if(!ignoreFaild) {
            return process.exit(0);
        }
    } else {
        logger.success(`[${new Date().toLocaleString()}] ${title} successed!`);
    }
}


function updatePackageJSON(data) {
    try {
        fsExtra.outputJsonSync(resolve('package.json'), data, {spaces: '  '});
        logger.info(`[${new Date().toLocaleString()}] package.json version updated!`);
        return true;
    } catch (e) {
        logger.error(`[${new Date().toLocaleString()}] package.json version error! ${e && e.message}`);
    }
    return false;
}

function getGitDepotDir(dir) {
    dir = dir || resolve();
    let gitPath = resolve(dir, '.git')
    let isExist = fsExtra.existsSync(gitPath);
    if(isExist) return gitPath;

    // 到达根目录 未找到目标文件
    if(!path.basename(dir)) return;
    // 向父级递归查询
    return getGitDepotDir(path.dirname(dir));
}
