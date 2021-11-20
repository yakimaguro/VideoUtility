const { ipcRenderer } = require("electron");
const ffmpeg = require("fluent-ffmpeg");
var command = ffmpeg();
const status = document.getElementById("compress_status");
const compressibility = document.getElementById("compressibility");
const compress_text = document.getElementById("compressibility_value");
var val2;

const setCurrentValue = (val) => {
  compress_text.innerText = "圧縮率" + val;
  val2 = val;
};

const rangeOnChange = (e) => {
  setCurrentValue(e.target.value);
};

window.onload = () => {
  compressibility.addEventListener("input", rangeOnChange);
  setCurrentValue(compressibility.value);
};

function Compress_OnInput(e) {
  ipcRenderer.invoke("select_folder").then(function (return_path) {
    const filePath = document.getElementById("compress_file").files[0].path;

    ffmpeg()
      .input(filePath)
      .seekInput(0.0)
      .output(return_path + "/converted.mp4")
      .outputOptions("-crf " + val2)
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
        status.textContent = parseInt(progress.percent) + "% 完了しました";
      })
      .on("end", () => {
        console.log("Processing finished !");
        status.textContent = "処理が正常に終了しました！";
        setTimeout(() => {
          status.textContent = "進行中のプロセスはありません";
        }, 5000);
      })
      .on("error", function (err) {
        console.log("エラーが発生しました" + err);
        status.textContent = "エラーが発生しました" + err;
      })
      .run();
  });
}
const compress_file_input = document.getElementById("compress_file");
compress_file_input.oninput = Compress_OnInput;
