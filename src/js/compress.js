var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();

function OnInput(e) {
    const filePath = document.getElementById("open_file").files[0].path;

    ffmpeg()
        .input(filePath)
        .seekInput(0.0)
        .output("./video/converted.mp4")
        .outputOptions('-crf 24')
        .on('progress', function (progress) {
            var status = document.getElementById('status');
            console.log('Processing: ' + progress.percent + '% done');
            status.textContent = parseInt(progress.percent) + '% 完了しました'
        })
        .on('end', () => {
            var status = document.getElementById('status');
            console.log('Processing finished !')
            status.textContent = '処理が正常に終了しました！'
            setTimeout(() => {
                status.textContent = '進行中のプロセスはありません'
            }, 5000);
        })
        .on('error', function (err) {
            var status = document.getElementById('status');
            console.log('エラーが発生しました' + err);
            status.textContent = 'エラーが発生しました' + err
        }).run()

}
const myInput = document.getElementById("open_file");
myInput.oninput = OnInput;