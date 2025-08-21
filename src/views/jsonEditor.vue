<template>
    <div class="container" :class="{'dark-mode': darkMode}">
        <header>
            <h1><i class="fas fa-code"></i> JSON格式化与校验器</h1>
            <p class="description">输入JSON数据，进行格式化和校验。支持语法高亮、错误提示和主题切换功能。</p>
        </header>
        
        <div class="app-container">
            <div class="toolbar">
                <div class="buttons">
                    <button class="btn-format" @click="formatJson">
                        <i class="fas fa-magic"></i> 格式化
                    </button>
                    <button class="btn-clear" @click="clearJson">
                        <i class="fas fa-trash"></i> 清空
                    </button>
                    <button class="btn-copy" @click="copyJson">
                        <i class="fas fa-copy"></i> 复制结果
                    </button>
                    <button class="btn-toggle" @click="toggleTheme">
                        <i class="fas fa-moon"></i> 切换主题
                    </button>
                </div>
                <div class="theme-toggle">
                    <span>{{ darkMode ? '深色模式' : '浅色模式' }}</span>
                    <label class="switch">
                        <input type="checkbox" v-model="darkMode">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div class="editor-container">
                <div class="editor-panel">
                    <div class="panel-header">
                        <span><i class="fas fa-pencil-alt"></i> 输入JSON</span>
                        <span>{{ inputCharCount }} 字符</span>
                    </div>
                    <div class="panel-body">
                        <textarea id="json-input" v-model="inputJson" placeholder='请输入JSON数据，例如：{"name":"John","age":30,"city":"New York"}'></textarea>
                    </div>
                </div>
                
                <div class="editor-panel">
                    <div class="panel-header">
                        <span><i class="fas fa-eye"></i> 格式化结果</span>
                        <span>{{ outputCharCount }} 字符</span>
                    </div>
                    <div class="panel-body">
                        <pre v-html="formattedJson"></pre>
                    </div>
                </div>
            </div>
            
            <div class="error-panel" v-if="error">
                <div class="error-header">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>JSON格式错误</span>
                </div>
                <div class="error-content">
                    {{ error }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const inputJson = ref('');
const error = ref('');
const darkMode = ref(false);

// 示例JSON
const sampleJson = JSON.stringify({
    name: "JSON格式化工具",
    version: "1.0.0",
    features: [
        "格式化",
        "语法高亮",
        "错误校验",
        "主题切换"
    ],
    author: {
        name: "开发者",
        email: "dev@example.com"
    },
    license: "MIT",
    isAwesome: true,
    rating: 5
}, null, 2);

// 设置示例JSON
inputJson.value = sampleJson;

// 计算字符数
const inputCharCount = computed(() => {
    return inputJson.value.length;
});

const outputCharCount = computed(() => {
    return formattedJson.value.replace(/<[^>]*>/g, '').length;
});

// 格式化JSON并高亮显示
const formattedJson = computed(() => {
    try {
        error.value = '';
        
        if (!inputJson.value.trim()) {
            return '';
        }
        
        // 解析和重新格式化JSON
        const parsedJson = JSON.parse(inputJson.value);
        const formatted = JSON.stringify(parsedJson, null, 2);
        
        // 语法高亮
        return highlightJson(formatted);
    } catch (err) {
        error.value = err.message;
        return '';
    }
});

// JSON语法高亮函数
function highlightJson(json) {
    // 转义HTML特殊字符
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // 添加语法高亮
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// 格式化JSON
function formatJson() {
    try {
        if (!inputJson.value.trim()) {
            error.value = '请输入JSON数据';
            return;
        }
        
        const parsedJson = JSON.parse(inputJson.value);
        inputJson.value = JSON.stringify(parsedJson, null, 2);
        error.value = '';
    } catch (err) {
        error.value = err.message;
    }
}

// 清空JSON
function clearJson() {
    inputJson.value = '';
    error.value = '';
}

// 复制结果
function copyJson() {
    if (!formattedJson.value) return;
    
    // 创建一个临时textarea来复制文本
    const textarea = document.createElement('textarea');
    textarea.value = formattedJson.value.replace(/<[^>]*>/g, '');
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    alert('已复制到剪贴板！');
}

// 切换主题
function toggleTheme() {
    darkMode.value = !darkMode.value;
}
</script>

<style lang="scss" scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
}

header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
}

h1 {
    font-size: 2.5rem;
    color: #3498db;
    margin-bottom: 10px;
}

.description {
    color: #7f8c8d;
    font-size: 1.1rem;
    max-width: 800px;
    margin: 0 auto;
}

.app-container {
    display: flex;
    gap: 20px;
    flex-direction: column;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.buttons {
    display: flex;
    gap: 10px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-format {
    background-color: #3498db;
    color: white;
}

.btn-format:hover {
    background-color: #2980b9;
}

.btn-clear {
    background-color: #e74c3c;
    color: white;
}

.btn-clear:hover {
    background-color: #c0392b;
}

.btn-copy {
    background-color: #2ecc71;
    color: white;
}

.btn-copy:hover {
    background-color: #27ae60;
}

.btn-toggle {
    background-color: #9b59b6;
    color: white;
}

.btn-toggle:hover {
    background-color: #8e44ad;
}

.theme-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #2c3e50;
}

input:checked + .slider:before {
    transform: translateX(30px);
}

.editor-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.editor-panel {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
}

.panel-header {
    padding: 15px;
    background: #3498db;
    color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-body {
    flex: 1;
    position: relative;
}

textarea, pre {
    width: calc(100% - 40px);
    height: 400px;
    padding: 20px;
    margin: 0px;
    font-size: 16px;
    border: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    resize: none;
    outline: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    tab-size: 2;
    -moz-tab-size: 2;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    overflow-y: auto;
}

pre {
    background-color: #f8f9fa;
}

.error-panel {
    margin-top: 20px;
    padding: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.error-header {
    color: #e74c3c;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.error-content {
    color: #c0392b;
    padding: 10px;
    background: #ffeaea;
    border-radius: 5px;
    max-height: 150px;
    overflow-y: auto;
}

.json-key {
    color: #8e44ad;
    font-weight: 600;
}

.json-string {
    color: #e74c3c;
}

.json-number {
    color: #3498db;
}

.json-boolean {
    color: #9b59b6;
}

.json-null {
    color: #7f8c8d;
}

.dark-mode {
    background-color: #1a1a2e;
    color: #e6e6e6;
}

.dark-mode .toolbar,
.dark-mode .error-panel {
    background: #16213e;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.dark-mode textarea {
    background-color: #0f3460;
    color: #e6e6e6;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.dark-mode pre {
    background-color: #0f3460;
    color: #e6e6e6;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.dark-mode .description {
    color: #b8b8b8;
}

.dark-mode .error-content {
    background: #2d0f0f;
    color: #ff6b6b;
}

@media (max-width: 768px) {
    .editor-container {
        flex-direction: column;
    }
    
    .toolbar {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }
    
    .buttons {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    button {
        flex: 1;
        justify-content: center;
    }
}
</style>