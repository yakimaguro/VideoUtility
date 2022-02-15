const { ipcRenderer } = require('electron');
const { shell } = require('electron')
const ffmpeg = require('fluent-ffmpeg');
var $ = require('jQuery');
const compressibility = document.getElementById('compressibility');
const compress_value = document.getElementById('compressibility_value');
var progresstext = document.getElementById('progress-text');
var dialogclose = document.getElementById('dialog-close');
var cancel = document.getElementById('cancel');
var val2;

const setCurrentValue = (val) => {
  compress_value.innerText = '圧縮率' + val;
  val2 = val;
};

const rangeOnChange = (e) => {
  setCurrentValue(e.target.value);
};

window.onload = () => {
  compressibility.addEventListener('input', rangeOnChange);
  setCurrentValue(compressibility.value);
};

function Compress_OnInput(e) {
  ipcRenderer.invoke('select_folder').then(function (return_path) {
    const filePath = document.getElementById('compress_file').files[0].path;
    const fileName = document.getElementById('compress_file').files[0].name.split(/\.(?=[^.]+$)/)[0];
    const fileExtension = document.getElementById('compress_file').files[0].name.split(/\.(?=[^.]+$)/)[1];
    dialog_open();
    $(".dialog-close").addClass("disabled");
    dialogclose.disabled = true;
    ffmpeg()
      .input(filePath)
      .seekInput(0.0)
      .output(return_path + '/' + fileName + '_converted.' + fileExtension)
      .outputOptions('-crf ' + val2)
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
        window.location.reload();
        console.log('エラーが発生しました' + err);
        dialogclose.disabled = false;
      })
      .run();
    $('#open-folder').on('click', function () {
      shell.openPath(return_path[0]);
    });
  });
}
const compress_file_input = document.getElementById('compress_file');
compress_file_input.oninput = Compress_OnInput;

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