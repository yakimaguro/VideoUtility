const { ipcRenderer } = require('electron');
const ffmpeg = require('fluent-ffmpeg');
var $ = require('jQuery');
var command = ffmpeg();
var format = document.getElementById('format');
const status = document.getElementById('format_status');

function Format_OnInput(e) {
  const filePath = document.getElementById('format_file').files[0].path;
  const fileName = document.getElementById('format_file').files[0].name.split(/\.(?=[^.]+$)/)[0];

  console.log(fileName);

  ipcRenderer.invoke('select_folder').then(function (return_path) {
    ffmpeg()
      .input(filePath)
      .seekInput(0.0)
      .output(return_path + '/' + fileName + '_converted.' + format.value)
      .on('progress', function (progress) {
        console.log('Processing: ' + progress.percent + '% done');
        status.textContent = parseInt(progress.percent) + '% 完了しました';
      })
      .on('end', () => {
        console.log('Processing finished !');
        status.textContent = '処理が正常に終了しました！';
        setTimeout(() => {
          status.textContent = '進行中のプロセスはありません';
          window.location.reload();
        }, 5000);
      })
      .on('error', function (err) {
        console.log('エラーが発生しました' + err);
        status.textContent = 'エラーが発生しました' + err;
      })
      .run();
    console.log(return_path);
  });
}
const format_file_input = document.getElementById('format_file');
format_file_input.oninput = Format_OnInput;
