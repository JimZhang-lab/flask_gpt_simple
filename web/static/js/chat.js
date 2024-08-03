const html_theme = document.querySelector("html");
const toggle_theme = document.querySelector(".toggle_theme");
toggle_theme.addEventListener("click", () => {
  if (html_theme.getAttribute("data-theme")) {
    html_theme.removeAttributeNS("data-theme");
  }
});

const send_message_btn = document.getElementById("send-message-btn");
const messageInput = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-container");

function getNowTime() {
  var currentTime = new Date();
  var year = currentTime.getFullYear();
  var month = currentTime.getMonth() + 1; // 月份从 0 开始，所以要加 1
  var day = currentTime.getDate();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  // 格式化为两位数
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  var formattedTime =
    year +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return formattedTime;
}
// const example_item = document.getElementById("example_item");
// document.querySelectorAll(".example_item").forEach((item) => {
//   item.addEventListener("click", function () {
//     const text = item.textContent.trim();
//     // console.log(text);
//     messageInput.value = text;
//   });
// });
const example_info = document.getElementById("example_info");

const example_info_msg = {
  "example_1": "你好，我是 GPT-3 机器人。",
  "example_2": "你好，我是 GPT-2 机器人。",
  "example_3": "你好，我是 GPT-1 机器人。",
  "example_4": "你好，我是 GPT-0 机器人。",
};


let currentIndex = 0;
const keys = Object.keys(example_info_msg);
let currentText = "";
let charIndex = 0;
let isTyping = false;

const view_example_info = () => {
  currentText = example_info_msg[keys[currentIndex]];
  charIndex = 0;
  example_info.innerHTML = "";
  isTyping = true;
  typeText();
};

const typeText = () => {
  if (!isTyping) return; // 如果已经停止显示，则直接返回

  if (charIndex < currentText.length) {
    example_info.innerHTML += currentText.charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100); // 每100毫秒显示一个字符
  } else {
    isTyping = false;
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % keys.length; // 切换到下一条消息
      view_example_info();
    }, 2000); // 显示完当前消息后等待2秒再切换
  }
};
// 初始显示
view_example_info();





messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault(); // 防止换行
    send_message_btn.click();
  }
});

const selectElement = document.getElementById("model-select");
let selectedValue = 1;
// 添加事件监听器，当选项改变时获取选中的值
selectElement.addEventListener("change", function () {
  selectedValue = selectElement.value;
  // console.log(selectElement.options[selectedValue].text)
  console.log("Selected value:", selectedValue);
});

document.addEventListener("DOMContentLoaded", function () {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/chat_get_model_list", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var models_name = JSON.parse(xhr.responseText).models_name;
        var select = document.getElementById("model-select");

        for (var i = 0; i < models_name.length; i++) {
          var option = document.createElement("option");
          option.value = i + 1;
          option.text = models_name[i];
          select.add(option);
        }
      } else {
        console.error("Error fetching model list:", xhr.statusText);
      }
    }
  };
  xhr.send();
});
let bubbleCounter = 0; // 全局变量，用于跟踪消息气泡的编号

function sendMessage() {
  const message = messageInput.value;
  // console.log(message);
  if (message.trim() === "") {
    return;
  }
  // 创建一个新的消息元素，并添加到聊天框
  let messageElement = `<div class="chat chat-end">
        <div class="chat-image avatar">
            <div class="w-10 rounded-full">
            <img
                alt="Tailwind CSS chat bubble component"
                src="../static/img/chatui/user.png" />
            </div>
        </div>
        <div class="chat-header">
            you
            <time class="text-xs opacity-50">${getNowTime()}</time>
        </div>
        <div class="chat-bubble">${message}</div>
        </div>
        `;
  chatMessages.innerHTML += messageElement;

  messageInput.value = "";
  bubbleCounter++;
  getResponse(message);
}

// 2024-7-31 无法渲染数学公式
// function formateMarkdown(message) {
//   var renderer = new marked.Renderer();

//   // 修改 code 渲染
//   renderer.code = function (code, language) {
//     var highlightedCode = hljs.highlightAuto(code).value;
//     return (
//       '<pre><code class="hljs ' +
//       language +
//       '">' +
//       highlightedCode +
//       "</code></pre>"
//     );
//   };

//   marked.setOptions({
//     renderer: renderer,
//     gfm: true,
//     tables: true,
//     breaks: true,
//     pedantic: false,
//     sanitize: false,
//     smartLists: true,
//     smartypants: false,
//     highlight: function (code, language) {
//       return hljs.highlightAuto(code).value;
//     }
//   });

//   // 渲染 Markdown 内容
//   var html = marked.parse(message);

//   // 创建一个临时的 div 容器来存放渲染后的 HTML
//   var tempDiv = document.createElement('div');
//   tempDiv.innerHTML = html;

//   // 使用 KaTeX 处理数学公式
//   renderMathInElement(tempDiv, {
//     delimiters: [
//       {left: "$$", right: "$$", display: true},
//       {left: "$", right: "$", display: false},
//       {left: "\\[", right: "\\]", display: true},
//       {left: "\\(", right: "\\)", display: false}
//     ]
//   });

//   // 返回处理后的 HTML
//   return tempDiv.innerHTML;
// }



function formateMarkdown(message) {
  var renderer = new marked.Renderer();
  renderer.code = function (code, language) {
    var highlightedCode = hljs.highlightAuto(code).value;
    return (
      '<pre><code class="hljs ' +
      language +
      '">' +
      highlightedCode +
      "</code></pre>"
    );
  };

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  });
  return marked.parse(message);
}

function addMessageBubble() {
  // var parsedHTML = marked.parse(message);
  let messageHTML = "";
  if (selectElement.value != 0) {
    model_name = selectElement.options[selectedValue].text;
    messageHTML = `<div class="chat chat-start">
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="../static/img/chatui/gpt.png"  />
                </div>
            </div>
            <div class="chat-header">
                ${model_name}
            </div>
            <div class="chat-bubble" id="streaming-bubble-${bubbleCounter}"></div>
            <div class="chat-footer opacity-50">${getNowTime()}</div>
            </div>`;
  } else {
    messageHTML = `<div class="chat chat-start">
            <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="../static/img/chatui/gpt.png"  />
                </div>
            </div>
            <div class="chat-header">
                Unkown model
            </div>
            <div class="chat-bubble" id="streaming-bubble-${bubbleCounter}">
            </div>
            <div class="chat-footer opacity-50">${getNowTime()}</div>
            </div>`;
  }
  chatMessages.innerHTML += messageHTML;
}

// 在页面加载时将编号清零
window.onload = function () {
  bubbleCounter = 0;
};

function loadingChatMessageBubble(model_name) {
  chatMessages.innerHTML += `<div class="chat chat-start" id="loadingChat">
                  <div class="chat-image avatar">
              <div class="w-10 rounded-full">
              <img
                  alt="Tailwind CSS chat bubble component"
                  src="../static/img/chatui/gpt.png"  />
              </div>
          </div>
          <div class="chat-header">
              ${model_name}
          </div>
          <div class="chat-bubble"><span class="loading loading-dots loading-md"></span></div>
          <div class="chat-footer opacity-50">${getNowTime()}</div>
          </div>`;
}

function errorInfoChatMessageBubble(model_name, error_info) {
  chatMessages.innerHTML += `<div class="chat chat-start">
                  <div class="chat-image avatar">
              <div class="w-10 rounded-full">
              <img
                  alt="Tailwind CSS chat bubble component"
                  src="../static/img/chatui/gpt.png" />
              </div>
          </div>
          <div class="chat-header">
              ${model_name}
          </div>
          <div class="chat-bubble">${error_info}</div>
          <div class="chat-footer opacity-50">${getNowTime()}</div>
          
          </div>`;
}

function getResponse(message) {
  const example_item = document.getElementById("example");
  example_item.innerHTML = "";
  selectedValue = selectElement.value;
  model_name = selectElement.options[selectedValue].text;
  loadingChatMessageBubble(model_name);
  try {
    fetchChatStream(message, model_name, selectedValue);
  } catch (error) {
    errorInfoChatMessageBubble(error);
  }
}

const audioSwitch = document.getElementById("toggle-sound");
// 改变时获取其中值
// audioSwitch.addEventListener("change", function () {
//   const isChecked = audioSwitch.checked;
//   console.log(isChecked);
//   // // 存储到本地
//   // localStorage.setItem("isAudioOn", isChecked);
// });
async function fetchChatStream(message, model_name, selectedValue) {
  try {
    // 禁用发送按钮
    send_message_btn.setAttribute("disabled", "disabled");

    const res = await fetch("/chat_query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: message,
        model_name: model_name,
        model_id: selectedValue,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const loadingChat = document.getElementById("loadingChat");
    if (loadingChat) {
      loadingChat.remove();
    }

    addMessageBubble();
    const streamingBubble = document.getElementById(
      `streaming-bubble-${bubbleCounter}`
    );
    const reader = res.body.getReader();
    const textdecoder = new TextDecoder();
    let buffer = "";
    const loadingHTML = `<span class="loading loading-spinner loading-xs" id="loading-circle"></span>`;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const str = textdecoder.decode(value);
      streamingBubble.innerHTML += loadingHTML;
      // console.log(str);
      if (str.trim() !== "" && str) {
        const loadingCircle = document.getElementById("loading-circle");
        if (loadingCircle) {
          loadingCircle.remove();
        }
        streamingBubble.innerHTML += str.trim();
        buffer += str.trim();
      }
    }

    // 将多个连续的换行符替换为一个换行符
    buffer = buffer.replace(/\n+/g, "\n");
    // 将包含换行符的段落中的所有换行符移除
    buffer = buffer.replace(/([^\n]+)(\n[^\n]+)+/g, (match, p1, p2) => {
      return match.replace(/\n/g, "");
    });
    // 将多个连续的空白字符替换为一个空格
    buffer = buffer.replace(/\s+/g, " ");
    // 将HTML中的<br>标签替换为两个换行符
    buffer = buffer.replace(/<br\s*\/?>/gi, "\n\n");
    // console.log(buffer);
    // 清空streamingBubble内容
    streamingBubble.innerHTML = "";
    // 格式化markdown
    const formattedMessage = formateMarkdown(buffer);
    // 显示格式化后的消息
    streamingBubble.innerHTML = formattedMessage;

    if (audioSwitch.checked) {
      streamingBubble.innerHTML += loadingHTML;
      // talk(window.model4, "../static/audio/loadingAudio.wav");
      const audioUrl = await fetchChatAudio(buffer);
      const loadingCircle = document.getElementById("loading-circle");
      if (loadingCircle) {
        loadingCircle.remove();
      }
      streamingBubble.innerHTML += `<audio src="${audioUrl}" controls></audio>`;
    }
    // 重新启用发送按钮
    send_message_btn.removeAttribute("disabled");
  } catch (error) {
    // 处理错误信息
    const loadingChat = document.getElementById("loadingChat");
    if (loadingChat) {
      loadingChat.remove();
    }

    errorInfoChatMessageBubble(error);
    // 重新启用发送按钮
    send_message_btn.removeAttribute("disabled");
    // 可以在这里添加更多的错误处理逻辑，例如显示错误消息给用户
  }
}
send_message_btn.addEventListener("click", () => {
  isTyping = false; // 停止显示
  sendMessage();
});
async function fetchChatAudio(message) {
  try {
    const res = await fetch("/chat_audio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
        emotion: "default",
        text_language: "多语种混合",
        character: "神里绫华",
        speed: 1.0,
        top_k: 5,
        top_p: 0.8,
        temperature: 0.8,
        stream: true,
        format: "wav",
        save_temp: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const audioBlob = await res.blob();
    //  const audioBlob = new Blob([res.data], { type: 'audio/wav' });

    const audioUrl = URL.createObjectURL(audioBlob);
    talk(window.model4, audioUrl);
    return audioUrl;
    // const audio = new Audio(audioUrl);
    // audio.play();
  } catch (error) {
    console.error(error);
  }
}

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
