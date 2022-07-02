const { exec, execFile } = require('child_process')
const fs = require('fs')
const addBanned = require('./addBanned')
const remove_comment = require('strip-comments')

exports.create = async (Source, fileName, callback) => {
    let newSource = addBanned(remove_comment(Source))
    if (newSource[0] == -1) {
        callback(newSource[1], null)
    }
    await fs.writeFile(
        `./compileCpp/${fileName}.cpp`,
        `${newSource[1]}`,
        (err) => {
            if (err) {
                callback(err, null)
                return
            }
            callback(null, `./compileCpp/${fileName}.cpp`)
        }
    )
}

exports.build = async (filePathCpp, callback) => {
    let exeName = filePathCpp.split('/')[2].split('.')[0]
    await exec(
        `g++ -w -std=c++14 ${filePathCpp} -o ./compileExe/${exeName}`,
        (err, stdout, stderr) => {
            if (err) {
                callback(`${err.message}`, null)
                return
            }
            if (stderr) {
                callback(`${stderr}`, null)
                return
            }
            callback(null, `./compileExe/${exeName}`)
        }
    )
}

exports.run = async (filePathExe, input) => {
    return new Promise(async (resolve, reject) => {
        try {
            var child = await execFile(
                filePathExe,
                { timeout: 1000, maxBuffer: 1024 * 1024 },
                (err, stdout, stderr) => {
                    if (err) {
                        if (err.signal && err.signal == 'SIGTERM') {
                            result = 'Timeout'
                            resolve({
                                result,
                            })
                        } else if (
                            err.code &&
                            err.code == 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'
                        ) {
                            result = 'Out_of_buffer'
                            resolve({
                                result,
                            })
                        } else {
                            result = 'runtime_error'
                            resolve({
                                result,
                            })
                        }
                    } else if (stderr) {
                        result = 'failed'
                        resolve({
                            result,
                        })
                    } else {
                        result = stdout
                        resolve({
                            result,
                        })
                        return
                    }
                }
            )
            child.stdin.pipe(child.stdin)
            child.stdin.setEncoding('utf-8')
            child.stdin.write(input)
            child.stdin.end()
            child.stdin.on('error', (code) => {
                result = 'noneedforinput'
                resolve({
                    result,
                })
            })
            
        } catch (err) {
            console.log(err.message)
        }
    })
}
exports.checkAnswer = (userOutput, testcaseOutput) => {
    try {
        var trimedUserOutput = userOutput.trimEnd().split(/\r?\n/)
        var trimedTestcaseOutput = testcaseOutput.trimEnd().split(/\r?\n/)
        for (let i = 0; i < trimedTestcaseOutput.length; i++) {
            if (
                trimedUserOutput[i].trimEnd() !=
                trimedTestcaseOutput[i].trimEnd()
            ) {
                return false
            }
        }
        return true
    } catch (e) {
        console.log(e.message)
        return false
    }
}
