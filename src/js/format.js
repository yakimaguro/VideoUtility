const { ipcRenderer } = require('electron');
const { shell } = require('electron')
const ffmpeg = require('fluent-ffmpeg');
const $ = require('jQuery');
var format = document.getElementById('format');
var progresstext = document.getElementById('progress-text');
var dialogclose = document.getElementById('dialog-close');
var cancel = document.getElementById('cancel');
var errortext = document.getElementById('error-text');

function Format_OnInput(e) {
  const filePath = document.getElementById('format_file').files[0].path;
  const fileName = document.getElementById('format_file').files[0].name.split(/\.(?=[^.]+$)/)[0];
  ipcRenderer.invoke('select_folder').then(function (return_path) {
    dialog_open();
    $(".dialog-close").addClass("disabled");
    dialogclose.disabled = true;
    if (format.value != 'gif') {
      ffmpeg()
        .input(filePath)
        .seekInput(0.0)
        .output(return_path + '/' + fileName + '_converted.' + format.value)
        .on('progress', function (progress) {
          document.getElementById('progress-bar').value = parseInt(progress.percent);
          progresstext.textContent = parseInt(progress.percent) + '%';
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Processing finished !');
          $(".dialog-close").removeClass("disabled");
          progresstext.textContent = '完了';
          dialogclose.disabled = false;
          cancel.disabled = true;
          $(".cancel").addClass("disabled");
        })
        .on('error', function (err) {
          console.log('エラーが発生しました' + err);
          errortext.textContent = 'エラーが発生しました' + err;
          $(".dialog-close").remove("disabled");
          dialogclose.disabled = false;
        })
        .run();
    } else {
      ffmpeg()
        .input(filePath)
        .seekInput(0.0)
        .addOption('-filter_complex', "[0:v] fps=18,scale=640:-1,split [a][b];[a] palettegen [p];[b][p] paletteuse=dither=none")
        .output(return_path + '/' + fileName + '_converted.gif')
        .on('progress', function (progress) {
          document.getElementById('progress-bar').value = parseInt(progress.percent);
          progresstext.textContent = parseInt(progress.percent) + '%';
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Processing finished !');
          $(".dialog-close").removeClass("disabled");
          progresstext.textContent = '完了';
          dialogclose.disabled = false;
          cancel.disabled = true;
          $(".cancel").addClass("disabled");
        })
        .on('error', function (err) {
          console.log('エラーが発生しました' + err);
          dialogclose.disabled = false;
        })
        .run();
    }
    $('#open-folder').on('click', function () {
      shell.openPath(return_path[0]);
    });
  });
}
const format_file_input = document.getElementById('format_file');
format_file_input.oninput = Format_OnInput;

$('#dialog-close').on('click', function () {
  window.location.reload();
});

$('#cancel').on('click', function () {
  window.location.reload();
});

function dialog_open() {
  $(this).blur();
  if ($("#dialog-overlay")[0]) return false;
  $("body").append('<div class="dialog-overlay"></div>');
  $(".dialog-overlay").fadeIn("fast");
  $(".process-dialog").fadeIn("fast");
}

function dialog_close() {
  $(".process-dialog, .dialog-overlay").fadeOut("fast", function () {
    $(".dialog-overlay").remove();
  });
}
