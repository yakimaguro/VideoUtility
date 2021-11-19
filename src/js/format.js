const ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
var format = document.getElementById("format");
const status = document.getElementById('format_status');

function Format_OnInput(e) {
  const filePath = document.getElementById("format_file").files[0].path;
  console.log(format.value)

  ffmpeg()
    .input(filePath)
    .seekInput(0.0)
    .output("./video/converted." + format.value)
    .on('progress', function (progress) {
      console.log('Processing: ' + progress.percent + '% done');
      status.textContent = parseInt(progress.percent) + '% 完了しました'
    })
    .on('end', () => {
      console.log('Processing finished !')
      status.textContent = '処理が正常に終了しました！'
      setTimeout(() => {
        status.textContent = '進行中のプロセスはありません'
      }, 5000);
    })
    .on('error', function (err) {
      console.log('エラーが発生しました' + err);
      status.textContent = 'エラーが発生しました' + err
    }).run()

}
const format_file_input = document.getElementById("format_file");
format_file_input.oninput = Format_OnInput;