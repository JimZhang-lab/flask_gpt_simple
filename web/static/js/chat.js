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
  example_1: "你好，我是 GPT-3 机器人。",
  example_2: "你好，我是 GPT-2 机器人。",
  example_3: "你好，我是 GPT-1 机器人。",
  example_4: "你好，我是 GPT-0 机器人。",
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

function sendMessage(message,audio_url) {
  // const message = messageInput.value;
  // console.log(message);
  if (message.trim() === "") {
    return;
  }
  // 创建一个新的消息元素，并添加到聊天框
  let messageElement = "";
  if(audio_url){
    messageElement = `<div class="chat chat-end">
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
          <div class="chat-bubble">${message}
          <audio src="${audio_url}" controls></audio>
          </div>
          </div>
          `;
  }else{

    messageElement = `<div class="chat chat-end">
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
  }
  chatMessages.innerHTML += messageElement;

  // messageInput.value = "";
  // bubbleCounter++;
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
  sendMessage(messageInput.value);
  bubbleCounter++;
  messageInput.value = "";
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

const microphone = document.getElementById("microphone-btn");
const microphoneIcon = document.getElementById("microphone-icon");
const recording_dialog = document.getElementById("recording-dialog");

let mediaRecorder = null;
let stream = null;

const toggleUIState = (isRecording) => {
  if (isRecording) {
    microphoneIcon.classList.remove("fill-[#8e8e8e]");
    microphoneIcon.classList.add("fill-[#0eab3d]");
    send_message_btn.setAttribute("disabled", "disabled");
    microphone.setAttribute("disabled", "disabled");
    recording_dialog.showModal();
  } else {
    microphoneIcon.classList.remove("fill-[#0eab3d]");
    microphoneIcon.classList.add("fill-[#8e8e8e]");
    send_message_btn.removeAttribute("disabled");
    microphone.removeAttribute("disabled");
    recording_dialog.close();
  }
};

const startRecording = async () => {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  try {
    toggleUIState(true);
    recognition.start();
  } catch (error) {
    console.error("An error occurred:", error);
    recognition.stop();
    toggleUIState(false);
  }

  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  const audioChunks = [];

  mediaRecorder.addEventListener("dataavailable", (event) => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener("stop", async() => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    // talk(window.model4, audioUrl);

    // 假设 audioUrl 是一个已经定义并赋值的变量

    // await sendTranscriptToBackend(audioUrl);
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    try {
      const response = await fetch("/chat_asr", {
        method: "POST",
        body: formData,
      });
    
      const responseData = await response.json(); // 假设后端返回的是 JSON 数据
      const text = responseData['text'];
    
      if (typeof text !== 'string') {
        throw new Error("返回的 text 不是字符串类型");
      }
    
      if (text.trim() === "") {
        text = "音频识别失败，请重新录制。";
      }
      sendMessage(text, audioUrl);
    } catch (error) {
      console.error("发生错误:", error);
      sendMessage("音频识别失败，请重新录制。", audioUrl);
    }
    
    // 关闭音频流
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    mediaRecorder = null;

    toggleUIState(false);
  });

  const end_recording_btn = document.getElementById("stop-recording-btn");
  end_recording_btn.addEventListener("click", () => {
    recognition.stop();
    mediaRecorder.stop();
    // recognition = null;
  });

  mediaRecorder.start();
};

microphone.addEventListener("click", startRecording);

// 发送录音内容到后端的函数
// async function sendTranscriptToBackend(audioUrl) {
//   // 这里可以使用 fetch 或其他方法将 transcript 发送到后端
//   try {
//     const res = await fetch("/chat_asr", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ audioUrl: audioUrl }),
//     });
    
//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
    
//     const responseData = await res.json(); // 假设后端返回的是 JSON 数据
//     const text = responseData['text'];
    
//     if (typeof text !== 'string') {
//       throw new Error("返回的 text 不是字符串类型");
//     }
    
//     if (text.trim() === "") {
//       text = "音频识别失败，请重新录制。";
//     }
//     sendMessage(text, audioUrl);

//   } catch (error) {
//     console.error(error);
//   }
// }


// const audio = new Audio(audioUrl);
// audio.play();
// const downloadLink = document.createElement('a');
// downloadLink.href = audioUrl;
// downloadLink.download = 'recording.wav';
// document.body.appendChild(downloadLink);
// downloadLink.click();
// document.body.removeChild(downloadLink);
