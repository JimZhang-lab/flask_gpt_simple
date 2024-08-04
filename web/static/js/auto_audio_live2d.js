var cubism4Model = "../static/Live2D_model/pachan/pachan.model3.json";

var selected_model = "../static/Live2D_model";

var model_list = "[1,2,3]";

const live2d = PIXI.live2d;

(async function main() {
  const app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    transparent: true,
    backgroundAlpha: 0,
  });

  const eye_bool = true;
  const models = await Promise.all([
    live2d.Live2DModel.from(cubism4Model, { autoInteract: eye_bool }),
  ]);

  models.forEach((model) => {
    app.stage.addChild(model);

    const scaleX = innerWidth / model.width;
    const scaleY = innerHeight / model.height;

    // fit the window
    model.scale.set(Math.min(scaleX, scaleY));

    model.y = innerHeight * 0.1;

    draggable(model);
  });

  const model4 = models[0];

  model4.x = innerWidth / 2;

  model4.on("hit", (hitAreas) => {
    if (hitAreas.includes("Body")) {
      model4.motion("Tap");
    }

    if (hitAreas.includes("Head")) {
      model4.expression();
    }
  });

  // 将 model4 传递出去
  window.model4 = model4;
})();


function talk(model, audio) {
  var audio_link = audio; //[Optional arg, can be null or empty] [relative or full url path] [mp3 or wav file] "./Keira.wav"
  var volume = 1; // [Optional arg, can be null or empty] [0.0 - 1.0]
  var expression = 8; // [Optional arg, can be null or empty] [index|name of expression]
  var resetExpression = true; // [Optional arg, can be null or empty] [true|false] [default: true] [if true, expression will be reset to default after animation is over]
  var crossOrigin = "anonymous"; // [Optional arg, to use not same-origin audios] [DEFAULT: null]
  console.log("talking...=====>" + model);
  model.speak(audio_link, {
    volume: volume,
    expression: expression,
    resetExpression: resetExpression,
    crossOrigin: crossOrigin,
  });

  // Or if you want to keep some things default
  model.speak(audio_link);
  model.speak(audio_link, { volume: volume });
  model.speak(audio_link, {
    expression: expression,
    resetExpression: resetExpression,
  });
}

function draggable(model) {
  model.buttonMode = true;
  model.on("pointerdown", (e) => {
    model.dragging = true;
    model._pointerX = e.data.global.x - model.x;
    model._pointerY = e.data.global.y - model.y;
  });
  model.on("pointermove", (e) => {
    if (model.dragging) {
      model.position.x = e.data.global.x - model._pointerX;
      model.position.y = e.data.global.y - model._pointerY;
    }
  });
  model.on("pointerupoutside", () => (model.dragging = false));
  model.on("pointerup", () => (model.dragging = false));
}

function addFrame(model) {
  const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
  foreground.width = model.internalModel.width;
  foreground.height = model.internalModel.height;
  foreground.alpha = 0.2;

  model.addChild(foreground);
}


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
