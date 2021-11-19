const ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
const status = document.getElementById('status');
const compressibility = document.getElementById('compressibility');
const compress_text = document.getElementById('compressibility_value');

const setCurrentValue = (val) => {
    compress_text.innerText = "圧縮率" + val;
}

const rangeOnChange = (e) => {
    setCurrentValue(e.target.value);
}

window.onload = () => {
    compressibility.addEventListener('input', rangeOnChange);
    setCurrentValue(compressibility.value);
}

function OnInput(e) {
    const filePath = document.getElementById("open_file").files[0].path;

    ffmpeg()
        .input(filePath)
        .seekInput(0.0)
        .output("./video/converted.mp4")
        .outputOptions('-crf ' + compressibility.value)
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
const myInput = document.getElementById("open_file");
myInput.oninput = OnInput;