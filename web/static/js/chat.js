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
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    var formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattedTime;
}
const example_item = document.getElementById("example_item");
document.querySelectorAll(".example_item").forEach((item) => {
  item.addEventListener("click", function () {
    const text = item.textContent.trim();
    // console.log(text);
    messageInput.value = text;
  });
});

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
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

function sendMessage() {
  const message = messageInput.value;
  console.log(message);
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
  sendToServer(message);
}
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

  var parsedHTML = marked.parse(message);
  let messageHTML = ''
  if (selectElement.value != 0){
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
            <div class="chat-bubble">${parsedHTML}</div>
            <div class="chat-footer opacity-50">${getNowTime()}</div>
            </div>`;
  }else{    
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
            <div class="chat-bubble">${parsedHTML}</div>
            <div class="chat-footer opacity-50">${getNowTime()}</div>
            </div>`;
        }
  chatMessages.innerHTML += messageHTML;
}
function sendToServer(message) {
  // 使用AJAX发送POST请求
  const example_item = document.getElementById("example");
  example_item.innerHTML = "";
  const xhr = new XMLHttpRequest();
  selectedValue = selectElement.value;
  model_name = selectElement.options[selectedValue].text;
  // console.log(model_name);
  xhr.open("POST", "/chat_query", true);
  xhr.setRequestHeader("Content-Type", "application/json");
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
        </div>`
  const loadingChat = document.getElementById('loadingChat');
  
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {

      if (xhr.status === 200) {
        try {
          // 解析服务器响应
          const response = JSON.parse(xhr.responseText);
          // 提取服务器回复的消息
          const botMessage = response.msg;
            if (loadingChat) {
                loadingChat.remove();
            }
          // 检查 botMessage 是否存在且不为空
          if (botMessage && botMessage.trim() !== "") {
            // 创建回复消息的元素，并添加到聊天框
            formateMarkdown(botMessage);
          } else {
            console.error("Error: botMessage is undefined or empty");
            chatMessages.innerHTML += `<div class="chat chat-start">
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
        <div class="chat-bubble">对不起，我无法生成回复。请稍后再试。</div>
        <div class="chat-footer opacity-50">${getNowTime()}</div>
        </div>`
          }
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      } else {
        console.error("Error: Server returned status code " + xhr.status);
        if (loadingChat) {
            loadingChat.remove();
        }

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
        <div class="chat-bubble">对不起，服务器返回错误。请稍后再试。</div>
        <div class="chat-footer opacity-50">${getNowTime()}</div>
        </div>`;
      }
    }
  };
  xhr.send(
    JSON.stringify({
      question: message,
      model_name: model_name,
      model_id: selectedValue,
    })
  );
}

send_message_btn.addEventListener("click", sendMessage);
