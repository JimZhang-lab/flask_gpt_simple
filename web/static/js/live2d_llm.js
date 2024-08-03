// $("#start_stream").hide()

$('input[name="eyes"]').click(function () {
  var radioValue = $("input[name='eyes']:checked").val();

  setCookie("eyes", radioValue, 1024);

  location.reload();
});

// 从 cookie 中获取保存的值
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}
// 将选中的值写入 cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 读取 cookie 中的值并设置单选按钮的选中状态
const eyesValue = getCookie("eyes");
if (eyesValue) {
  const radioButtons = document.getElementsByName("eyes");
  radioButtons.forEach((radio) => {
    radio.checked = false;
    if (radio.value == eyesValue) {
      radio.checked = true;
    }
  });
}

// 设置背景色

if (getCookie("bg_color") === undefined) {
  $("#bg_color").val("transparent");
} else {
  $("#bg_color").val(getCookie("bg_color"));
}

let eye_bool = true;

if (getCookie("eyes") === undefined) {
} else {
  if (getCookie("eyes") == "false") {
    eye_bool = false;
  }
}

// 数字人模型
var cubism4Model = "../static/Live2D_model/pachan/pachan.model3.json";

var selected_model = "../static/Live2D_model";

var model_list = "[1,2,3]";

model_list = JSON.parse(model_list);

var $select = $("#model_list");
$select.empty(); // 清空旧选项

// 遍历新选项列表并添加到select元素中
$.each(model_list, function (index, value) {
  if (value == selected_model) {
    $select.append(
      $("<option selected></option>").attr("value", value).text(value)
    );
  } else {
    $select.append($("<option></option>").attr("value", value).text(value));
  }
});

// const cubism4Model = "./Hiyori/Hiyori.model3.json";

// const cubism4Model = "./March 7th/March 7th.model3.json";

const live2d = PIXI.live2d;

(async function main() {
  const app = new PIXI.Application({
    view: document.getElementById("canvas"),
    autoStart: true,
    resizeTo: window,
    transparent: true,
    backgroundAlpha: 0,
  });

  var models = await Promise.all([
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
    // addFrame(model);
    // addHitAreaFrames(model);
    // talk(model)
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

  // 更新模型

  $("#update_model").click(function () {
    axios
      .get("/edit_config", {
        params: { model_path: $("#model_list").val() },
      })
      .then((response) => {
        // 处理成功响应
        console.log(response.data);
        location.reload();
      })
      .catch((error) => {
        // 处理错误
        console.error(error);
        alert(error);
      });
  });

  $("#stop").click(function () {
    model4.stopSpeaking();
  });

  const apiurl = "http://127.0.0.1:9862/tts";

  $("#start").click(function () {
    console.log($("#text_talk").val());

    let text = $("#text_talk").val().trim();

    $("#start").prop("disabled", true);

    axios.defaults.timeout = 300000;
    axios
      .post(
        apiurl,
        {
          media_type: "wav",
          speed_factor: $("#speed_factor").val(),
          text: $("#text_talk").val(),
        },
        {
          responseType: "arraybuffer",
        }
      )
      .then((response) => {
        console.log(response.data);
        // 将返回的音频数据转换为Blob对象
        const audioBlob = new Blob([response.data], {
          type: "audio/wav",
        });

        console.log(audioBlob);

        // 创建一个URL对象用于播放音频
        const audioUrl = URL.createObjectURL(audioBlob);

        // 创建一个新的Audio对象并播放音频
        // const audio = new Audio(audioUrl);
        //audio.play();

        talk(model4, audioUrl);

        $("#start").prop("disabled", false);
      })
      .catch((error) => {
        console.error("请求接口失败:", error);
        $("#start").prop("disabled", false);
      });
  });

  $("#start_stream").click(async function () {
    console.log($("#text_talk").val());

    $("#start_stream").prop("disabled", true);

    data = {
      media_type: "ogg",
      speed_factor: $("#speed_factor").val(),
      text: $("#text_talk").val(),
      streaming_mode: "true",
    };

    const response = await fetch(apiurl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const reader = response.body.getReader();
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log("***********************done");
        $("#start_stream").prop("disabled", false);
        break;
      }
      console.log("--------------------value");
      console.log(value);

      // 将返回的音频数据转换为Blob对象
      const audioBlob = new Blob([value.buffer], { type: "audio/ogg" });

      // 创建一个URL对象用于播放音频
      const audioUrl = URL.createObjectURL(audioBlob);

      talk(model4, audioUrl);

      // 将读取到的值添加到数组中
      //chunks.push(value);
    }
    // // 合并所有读取到的二进制数据
    // const audioBuffer = new Uint8Array(chunks.reduce((acc, val) => acc.concat(Array.from(val)), []));
    // // 解码音频数据并播放
    // context.decodeAudioData(audioBuffer.buffer).then(decodedData => {
    // const source = context.createBufferSource();
    // source.buffer = decodedData;
    // source.connect(context.destination);
    // source.start(0);
    // }).catch(error => {
    // console.error("Error decoding audio data:", error);
    // });
  });
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

  checkbox("Model Frames", (checked) => (foreground.visible = checked));
}

// function addHitAreaFrames(model) {
//   const hitAreaFrames = new live2d.HitAreaFrames();
//   hitAreaFrames.visible = true;
//   model.addChild(hitAreaFrames);

//   //checkbox("Hit Area Frames", (checked) => (hitAreaFrames.visible = checked));
// }

function checkbox(name, onChange) {
  const id = name.replace(/\W/g, "").toLowerCase();

  let checkbox = document.getElementById(id);

  if (!checkbox) {
    const p = document.createElement("p");
    p.innerHTML = `<input type="checkbox" id="${id}"> <label for="${id}">${name}</label>`;

    document.getElementById("control").appendChild(p);
    checkbox = p.firstChild;
  }

  checkbox.addEventListener("change", () => {
    onChange(checkbox.checked);
  });

  onChange(checkbox.checked);
}
