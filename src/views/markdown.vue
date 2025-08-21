<template>
    <div class="markdown-editor">
        <div class="editor-container">
            <div class="editor-pane">
                <div class="pane-header">
                    <div class="pane-title">编辑区</div>
                    <div class="word-count">字数: {{ wordCount() }}</div>
                </div>
                <textarea
                    id="editor"
                    v-model="markdownText" 
                    placeholder="开始编写您的Markdown内容..." 
                    @input="updatePreview"
                    ref="editor"
                ></textarea>
            </div>
        
            <div class="preview-pane">
                <div class="pane-header">
                    <div class="pane-title">预览区</div>
                    <div class="word-count">行数: {{ lineCount() }}</div>
                </div>
                <div class="preview-content" v-html="compiledMarkdown"></div>
            </div>
        </div>
        
        <div class="actions">
            <button @click="clearContent" class="btn-clear">清除内容</button>
            <button @click="exportHTML">导出HTML</button>
            <button @click="toggleHelp">{{ showHelp ? '隐藏语法' : 'Markdown语法参考' }}</button>
        </div>
        
        <div class="status-bar">自动保存: {{ autoSaveStatus }}</div>
        
        <div v-if="showHelp" class="divider"></div>
        
        <div v-if="showHelp" class="markdown-help">
        <h3>Markdown 快速参考</h3>
        <div class="help-content">
            <div class="help-column">
                <h4>基本格式</h4>
                <p><strong>标题:</strong> # H1, ## H2, ### H3</p>
                <p><strong>粗体:</strong> **粗体文字**</p>
                <p><strong>斜体:</strong> *斜体文字*</p>
                <p><strong>删除线:</strong> ~~删除文字~~</p>
            </div>
            <div class="help-column">
                <h4>高级格式</h4>
                <p><strong>链接:</strong> [文本](URL)</p>
                <p><strong>图片:</strong> ![alt文本](图片URL)</p>
                <p><strong>代码:</strong> `代码片段`</p>
                <p><strong>代码块:</strong> ```语言 代码 ```</p>
            </div>
            <div class="help-column">
                <h4>列表与结构</h4>
                <p><strong>无序列表:</strong> - 项目1</p>
                <p><strong>有序列表:</strong> 1. 项目1</p>
                <p><strong>引用:</strong> > 引用文字</p>
                <p><strong>表格:</strong> | 标题1 | 标题2 |</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { marked } from 'marked';
import hljs from 'highlight.js';
import { onMounted, onUnmounted, ref } from 'vue';

const markdownText = ref(`# 欢迎使用Markdown编辑器

这是一个**Vue.js**驱动的即时Markdown编辑器。

## 功能特点
- 实时预览
- 语法高亮
- 本地存储
- 响应式设计

## 代码示例
\`\`\`javascript
function greet() {
  console.log("Hello, Markdown!");
}
greet();
\`\`\`

> 提示：在左侧编辑内容，右侧实时预览

## 表格示例
| 功能 | 状态 | 说明 |
|------|------|------|
| 实时预览 | ✅ 已实现 | 输入时即时渲染 |
| 语法高亮 | ✅ 已实现 | 代码块高亮显示 |
| 本地存储 | ✅ 已实现 | 内容自动保存 |
| 导出HTML | ✅ 已实现 | 一键导出功能 |
`);
const compiledMarkdown = ref('')
const showHelp = ref(false)
const autoSaveStatus = ref('已启用')
const saveInterval = ref(null)

onMounted(() => {
    // 配置marked
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(lang, code).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true
    });
    
    updatePreview();
    
    // 加载本地存储的内容
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
      markdownText.value = savedContent;
      updatePreview();
    }
    
    // 设置自动保存
    saveInterval.value = setInterval(() => {
      localStorage.setItem('markdownContent', markdownText.value);
    }, 2000);
    
    // 添加键盘快捷键
    setupShortcuts();
})

onUnmounted(() => {
    if (saveInterval.value) {
      clearInterval(saveInterval.value);
    }
})

function wordCount() {
  return markdownText.value.trim().split(/\s+/).length;
}
function lineCount() {
  return markdownText.value.split('\n').length;
}

function updatePreview() {
  compiledMarkdown.value = marked(markdownText.value);
}

function setupShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S 保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            localStorage.setItem('markdownContent', markdownText.value);
            autoSaveStatus.value = '手动保存 ' + new Date().toLocaleTimeString();
            
            // 显示保存提示
            const status = autoSaveStatus.value;
            setTimeout(() => {
                autoSaveStatus.value = '已启用';
            }, 2000);
        }
        
        // Ctrl/Cmd + H 切换帮助
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            toggleHelp();
        }
    });
}

const clearContent = () => {
    markdownText.value = '';
    updatePreview();
    localStorage.removeItem('markdownContent');
}

const exportHTML = () => {
    const blob = new Blob([compiledMarkdown.value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const toggleHelp = () => {
    showHelp.value = !showHelp.value;
}

</script>

<style lang="scss" scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-container {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex: 1;
}

@media (min-width: 992px) {
  .editor-container {
    flex-direction: row;
    min-height: 60vh;
  }
}

.editor-pane, .preview-pane {
  flex: 1;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.editor-pane {
  border-right: 1px solid #e1e4e8;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e1e4e8;
}

.pane-title {
  font-weight: 600;
  color: #2c3e50;
}

.word-count {
  color: #95a5a6;
  font-size: 0.9rem;
}

textarea {
  width: calc(100% - 10px);
  flex: 1;
  border: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
  color: #2c3e50;
}

textarea:focus {
  outline: none;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 5px;
}

.preview-content h1,
.preview-content h2,
.preview-content h3 {
  margin-top: 1.2em;
  margin-bottom: 0.6em;
  color: #2c3e50;
}

.preview-content p {
  margin-bottom: 1em;
}

.preview-content code {
  background-color: #f6f8fa;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.preview-content pre {
  background-color: #f6f8fa;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
  margin-bottom: 1em;
}

.preview-content blockquote {
  border-left: 4px solid #ddd;
  padding-left: 16px;
  color: #666;
  margin: 1em 0;
}

.preview-content table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
}

.preview-content table th,
.preview-content table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.preview-content table th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

button:hover {
  background: #2980b9;
}

.btn-clear {
  background: #e74c3c;
}

.btn-clear:hover {
  background: #c0392b;
}

.status-bar {
  text-align: center;
  margin-top: 15px;
  color: #95a5a6;
  font-size: 0.9rem;
}

.divider {
  width: 100%;
  height: 1px;
  background: #e1e4e8;
  margin: 20px 0;
}

.markdown-help {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.markdown-help h3 {
  margin-bottom: 15px;
  color: #2c3e50;
  text-align: center;
}

.help-content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.help-column {
  flex: 1;
  min-width: 250px;
}

.help-column h4 {
  color: #3498db;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e1e4e8;
}

.help-column p {
  margin-bottom: 8px;
  font-size: 0.95rem;
}
</style>