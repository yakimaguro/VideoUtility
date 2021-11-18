var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();

function OnInput(e) {
    const filePath = document.getElementById("open_file").files[0].path;

    ffmpeg(filePath)
        .output("./video/converted.mp4")
        .outputOptions('-crf 24')
        .on('progress', function (progress) {
            var status = document.getElementById('status');
            console.log('Processing: ' + progress.percent * 2 + '% done');
            status.textContent = 'Processing: ' + parseInt(progress.percent) * 2 + '% done'
        })
        .on('end', () => {
            var status = document.getElementById('status');
            console.log('Processing finished !')
            status.textContent = 'Processing finished !'
            setTimeout(() => {
                status.textContent = 'No process in progress'
            }, 5000);
        })
        .screenshots({ // これはサムネイル作成の記述
            count: 1,
            folder: "./video/",
            filename: 'thumbnail.jpg',
            size: '150x150'
        })
}
const myInput = document.getElementById("open_file");
myInput.oninput = OnInput;