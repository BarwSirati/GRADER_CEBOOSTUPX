const { create, build, run, checkAnswer } = require("./compiler");

exports.checkResult = async (sourceCode, input, output) => {
  var resultTest = "";
  var index = 0;
  var status = 2;
  return new Promise(async (resolve, reject) => {
    try {
      await create(
        sourceCode,
        `${process.pid}_code`,
        async (err, filePathCpp) => {
          if (err) {
            resultTest = "C";
            status = 1;
            if (err.toString().includes(`_is_a_banned_library`)) {
              resultTest = "L";
            }
            resolve({
              resultTest,
              status,
            });
            return;
          }
          await build(filePathCpp, async (err, filePathExe) => {
            if (err) {
              resultTest = "B";
              status = 1;
              if (err.toString().includes("_is_a_banned_function")) {
                resultTest = "F";
              }
              resolve({
                resultTest,
                status,
              });
            }
            var inputMap = [];

            if (input.length != output.length) {
              resultTest = "W";
              resolve({
                resultTest,
                status: 1,
              });
              return;
            }
            const mapInput = input.map(async (inputX, idx) => {
              inputMap[idx] = await run(filePathExe, inputX);
            });
            await Promise.all(mapInput);
            output.forEach((runTest) => {
              if (checkAnswer(inputMap[index].result, runTest)) {
                resultTest += "P";
              } else {
                if (inputMap[index].result == "Timeout")
                  (resultTest += "T"), (status = 1);
                else if (inputMap[index].result == "Out_of_buffer")
                  (resultTest += "O"), (status = 1);
                else if (inputMap[index].result == "runtime_error")
                  (resultTest += "X"), (status = 1);
                else if (inputMap[index].result == "noneedforinput")
                  (resultTest += "-"), (status = 1);
                else (resultTest += "-"), (status = 1);
              }
              index++;
            });
            resolve({
              resultTest,
              status,
            });
          });
        }
      );
    } catch (err) {
      resolve({
        resultTest: "Y",
        status: 0,
      });
    }
  });
};
