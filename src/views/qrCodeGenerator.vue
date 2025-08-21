<template>
    <div id="qr-code-generator">
        <div class="container">
            <header>
                <h1><i class="fas fa-qrcode"></i> Vue 3 二维码生成器</h1>
                <p class="subtitle">快速生成自定义样式的二维码</p>
            </header>
            
            <div class="app-content">
                <div class="input-section">
                    <div class="form-group">
                        <label for="text-input"><i class="fas fa-font"></i> 输入文本或URL</label>
                        <textarea 
                            id="text-input" 
                            v-model="text" 
                            placeholder="请输入要生成二维码的文字或网址"
                            @input="generateQRCode"
                        ></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="size"><i class="fas fa-expand"></i> 二维码尺寸</label>
                        <select id="size" v-model="size" @change="generateQRCode">
                            <option value="200">200x200</option>
                            <option value="250">250x250</option>
                            <option value="300">300x300</option>
                            <option value="350">350x350</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-palette"></i> 颜色设置</label>
                        <div class="color-picker">
                            <div class="color-input">
                                <label for="foreground">前景色</label>
                                <input type="color" id="foreground" v-model="foreground" @change="generateQRCode">
                            </div>
                            <div class="color-input">
                                <label for="background">背景色</label>
                                <input type="color" id="background" v-model="background" @change="generateQRCode" value="#ffffff">
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn" @click="generateQRCode">
                        <i class="fas fa-sync-alt"></i> 重新生成
                    </button>
                </div>
                
                <div class="preview-section">
                    <div class="qr-code-container">
                        <canvas ref="qrcanvas" id="qrcode"></canvas>
                    </div>
                    
                    <div class="action-buttons">
                        <button class="btn btn-download" @click="downloadQRCode" :disabled="!qrcodeGenerated">
                            <i class="fas fa-download"></i> 下载二维码
                        </button>
                    </div>
                    
                    <div class="instructions">
                        <h3><i class="fas fa-info-circle"></i> 使用说明</h3>
                        <ol>
                            <li>在输入框中输入文本或URL</li>
                            <li>调整二维码尺寸和颜色</li>
                            <li>二维码会自动生成</li>
                            <li>点击"下载二维码"按钮保存图片</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import QRCode from 'qrcode';

const text = ref('https://vuejs.org/');
const size = ref(300);
const foreground = ref('#000000');
const background = ref('#ffffff');
const qrcodeGenerated = ref(false);
const qrcanvas = ref(null);

onMounted(() => {
    generateQRCode();
});

const generateQRCode = async () => {
    if (!text.value) {
    return;
    }
    
    try {
    await QRCode.toCanvas(qrcanvas.value, text.value, {
        width: parseInt(size.value),
        color: {
        dark: foreground.value,
        light: background.value
        }
    });
    qrcodeGenerated.value = true;
    } catch (error) {
    console.error('生成二维码时出错:', error);
    }
};

const downloadQRCode = () => {
    const canvas = qrcanvas.value;
    if (!canvas) {
    alert('请先生成二维码');
    return;
    }
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
</script>

<style scoped>
#qr-code-generator {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.container {
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

header {
  background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
  color: white;
  padding: 25px 30px;
  text-align: center;
}

h1 {
  font-size: 2.2rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.app-content {
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
}

.input-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
}

.preview-section {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

input, select {
  width: 100%;
  padding: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, select:focus {
  border-color: #4776E6;
  outline: none;
}

textarea {
  width: calc(100% - 28px);
  height: 120px;
  padding: 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus {
  border-color: #4776E6;
  outline: none;
}

.color-picker {
  display: flex;
  gap: 15px;
}

.color-input {
  flex: 1;
}

.color-input input {
  height: 50px;
  padding: 5px;
}

.btn {
  padding: 14px 25px;
  background: #4776E6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  background: #3b64c7;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn i {
  margin-right: 8px;
}

.btn-download {
  background: #27ae60;
  margin-left: 10px;
}

.btn-download:hover {
  background: #219653;
}

.qr-code-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
  width: 100%;
}

#qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.instructions {
  margin-top: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 5px solid #4776E6;
}

.instructions h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.instructions ol {
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
  color: #34495e;
}

@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
  }
  
  .input-section, .preview-section {
    width: 100%;
  }
}
</style>