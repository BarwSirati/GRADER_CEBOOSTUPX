const { create, build, run, checkAnswer } = require('./compiler')

exports.checkResult = async (sourceCode, input, output) => {
    var resultTest = ''
    var index = 0
    var status = 2
    return new Promise(async (resolve, reject) => {
        try {
            await create(
                sourceCode,
                `${process.pid}_code`,
                async (err, filePathCpp) => {
                    if (err) {
                        resultTest = 'C'
                        status = 1
                        if (err.toString().includes(`_is_a_banned_library`)) {
                            resultTest = 'L'
                        }
                        if (
                            err.toString().includes('sorry_system_is_a_banned')
                        ) {
                            resultTest = 'H'
                        }
                        resolve({
                            resultTest,
                            status,
                        })
                        return
                    }
                    await build(filePathCpp, async (err, filePathExe) => {
                        if (err) {
                            resultTest = 'S'
                            status = 1
                            if (
                                err.toString().includes('_is_a_banned_function')
                            ) {
                                resultTest = 'F'
                            }
                            resolve({
                                resultTest,
                                status,
                            })
                        }
                        var arrInput = Object.entries(input)
                        var arrOutput = Object.entries(output)
                        var inputMap = []

                        if (input.length != output.length) {
                            resultTest = 'W'
                            resolve({
                                resultTest,
                                status: 1,
                            })
                            return
                        }
                        const mapInput = arrInput.map(async (inputX, idx) => {
                            inputMap[idx] = await run(filePathExe, inputX[1])
                        })
                        await Promise.all(mapInput)
                        arrOutput.forEach((runTest) => {
                            if (
                                checkAnswer(inputMap[index].result, runTest[1])
                            ) {
                                resultTest += 'P'
                            } else {
                                if (inputMap[index].result == 'Timeout') {
                                    resultTest += 'T'
                                    status = 1
                                } else if (
                                    inputMap[index].result == 'Out_of_buffer'
                                ) {
                                    resultTest += 'O'
                                    status = 1
                                } else if (
                                    inputMap[index].result == 'runtime_error'
                                ) {
                                    resultTest += 'R'
                                    status = 1
                                } else if (inputMap[index].result == 'error') {
                                    resultTest += 'E'
                                    status = 1
                                } else {
                                    resultTest += '-'
                                    status = 1
                                }
                            }
                            index++
                        })
                        resolve({
                            resultTest,
                            status,
                        })
                    })
                }
            )
        } catch (err) {
            resolve({
                resultTest: 'Y',
                status: 0,
            })
        }
    })
}
