const fs = require('fs')

module.exports = (sourceCode) => {
    const libBan = fs
        .readFileSync('./banned/libBanned.BAN')
        .toString()
        .split(/\r?\n/)
    for (var lib of libBan) {
        if (sourceCode.toString().includes(lib)) {
            return [-1, `sorry_${lib}_is_a_banned_library`]
        }
    }
    if (sourceCode.toString().includes('system')) {
        return [-1, `sorry_system_is_a_banned`]
    }
    try {
        if (sourceCode.lastIndexOf(`#include`) == -1) {
            return [1, `#include\"../banned/banned.h\"\r\n` + sourceCode]
        }
        let newString = sourceCode.substr(sourceCode.lastIndexOf(`#include`))
        let newString2 = newString.substr(newString.indexOf(`>`) + 1)
        return [
            1,
            sourceCode.substr(0, sourceCode.indexOf(newString2)) +
                `\r\n#include\"../banned/banned.h\"\r\n` +
                newString2,
        ]
    } catch (e) {
        return [1, `#include\"../banned/banned.h\"\r\n` + sourceCode]
    }
}
