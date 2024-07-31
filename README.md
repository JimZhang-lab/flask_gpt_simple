# 简单，轻便，易上手维护和二次开发
- 该项目为clone-gpt的小项目，主要用于项目展示
- 框架：flask+html+css+js
- 已经实现gpt对话框和模型选择，以及一些前端的介绍界面
- 仍在开发中.

## 7.31更新
- 完善tts 接口，增加了语音合成功能，需提前配置好语言模型
- 优化了代码结构
- 优化了 markdown 文字格式显示，但任未能输出公式
![image](https://github.com/smart-James/flask_gpt_simple/blob/main/img_folder/chat_v4.png)
## 7.26 更新
- 重写了前端界面，增加了焕肤功能
- 分离了前端 js 文件
![image](https://github.com/smart-James/flask_gpt_simple/blob/main/img_folder/chat_v3.png)
## 1 安装依赖
```
cd flask_gpt_simple
pip install -r requirements.txt
```
## 2 运行程序
```
python main.py
```
## 3 模型配置
在 llm_list.json 中添加你的 api 配置, 运行项目自动读取.
## chat界面展示
![image](https://github.com/smart-James/some_gpt_simple/blob/main/img_folder/chat.png)
![image](https://github.com/smart-James/flask_gpt_simple/blob/main/img_folder/chat_v2.png)

