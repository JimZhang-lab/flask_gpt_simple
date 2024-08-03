// window.addEventListener("load", function () {
//   try {
//     talk(window.model4, "./static/audio/enter.wav");
//   } catch (error) {
//     console.error("Error playing audio:", error);
//   }
// });

// let timeoutId;


// function resetTimer() {
//   clearTimeout(timeoutId);
//   timeoutId = setTimeout(talk(window.model4, "./static/audio/enter.wav"), 20000); // 20 秒后调用 talk 函数
// }

// // 监听用户操作事件
// document.addEventListener("mousemove", resetTimer);
// document.addEventListener("keydown", resetTimer);
// document.addEventListener("click", resetTimer);

// // 初始化计时器
// resetTimer();

// 监听beforeunload事件
// window.addEventListener("beforeunload", function() {
//   // 调用talk函数
//   console.log("beforeunload");
//   talk(window.model4, "./static/audio/refresh.wav"); // 假设model4和音频路径已经定义
// });
