<template>
    <div id="color-converter">
        <div class="container">
            <header>
                <h1><i class="fas fa-palette"></i> Vue颜色代码转换器</h1>
                <p class="subtitle">在HEX、RGB、HSL颜色格式之间轻松转换</p>
            </header>
                
            <div class="app-content">
                <div class="color-preview" :style="{'background-color': currentColor}">
                    <div class="color-info">
                        <div class="current-color">{{ currentColor }}</div>
                        <button class="copy-btn" @click="copyToClipboard(currentColor)">
                            <i class="fas fa-copy"></i> 复制颜色代码
                        </button>
                    </div>
                </div>
                
                <div class="color-converters">
                    <div class="converter-group">
                        <h3><i class="fas fa-barcode"></i> HEX颜色代码</h3>
                        <div class="input-group">
                            <input type="text" v-model="hexValue" placeholder="输入HEX颜色代码，例如：#3498db" @input="convertFromHex">
                            <button @click="convertFromHex">转换</button>
                        </div>
                        <div class="color-values">
                            HEX: {{ hexValue }}
                        </div>
                    </div>
                    
                    <div class="converter-group">
                        <h3><i class="fas fa-sliders-h"></i> RGB颜色值</h3>
                        <div class="input-group">
                            <input type="text" v-model="rgbValue" placeholder="输入RGB颜色值，例如：rgb(52, 152, 219)" @input="convertFromRgb">
                            <button @click="convertFromRgb">转换</button>
                        </div>
                        <div class="color-values">
                            RGB: {{ rgbValue }}
                        </div>
                    </div>
                    
                    <div class="converter-group">
                        <h3><i class="fas fa-sliders-h"></i> HSL颜色值</h3>
                        <div class="input-group">
                            <input type="text" v-model="hslValue" placeholder="输入HSL颜色值，例如：hsl(204, 70%, 53%)" @input="convertFromHsl">
                            <button @click="convertFromHsl">转换</button>
                        </div>
                        <div class="color-values">
                            HSL: {{ hslValue }}
                        </div>
                    </div>
                    
                    <div class="examples">
                        <h3><i class="fas fa-lightbulb"></i> 常用颜色示例</h3>
                        <div class="example-list">
                            <div v-for="color in exampleColors" :key="color.hex" 
                                    class="example-color" :style="{'background-color': color.hex}"
                                    @click="setExampleColor(color)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
            <footer>
                <p>Vue颜色代码转换器 &copy; 2025 | 使用Vue.js构建</p>
            </footer>
        </div>
            
        <div class="notification" :class="{ show: showNotification }">
            <i class="fas fa-check-circle"></i> 已复制到剪贴板！
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const hexValue = ref('#3498db')
const rgbValue = ref('rgb(52, 152, 219)')
const hslValue = ref('hsl(204, 70%, 53%)')
const currentColor = ref('#3498db')
const showNotification = ref(false)

const exampleColors = [
    { hex: '#3498db', rgb: 'rgb(52, 152, 219)', hsl: 'hsl(204, 70%, 53%)' },
    { hex: '#e74c3c', rgb: 'rgb(231, 76, 60)', hsl: 'hsl(6, 78%, 57%)' },
    { hex: '#2ecc71', rgb: 'rgb(46, 204, 113)', hsl: 'hsl(145, 63%, 49%)' },
    { hex: '#f39c12', rgb: 'rgb(243, 156, 18)', hsl: 'hsl(37, 90%, 51%)' },
    { hex: '#9b59b6', rgb: 'rgb(155, 89, 182)', hsl: 'hsl(282, 38%, 53%)' },
    { hex: '#34495e', rgb: 'rgb(52, 73, 94)', hsl: 'hsl(210, 29%, 29%)' },
    { hex: '#16a085', rgb: 'rgb(22, 160, 133)', hsl: 'hsl(168, 76%, 36%)' },
    { hex: '#d35400', rgb: 'rgb(211, 84, 0)', hsl: 'hsl(21, 100%, 41%)' }
]

onMounted(() => {
    convertFromHex();
})

function convertFromHex() {
    const hex = hexValue.value.replace('#', '');
    if (hex.length === 3 || hex.length === 6) {
        if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
            currentColor.value = '#' + hex;
            hexToRgb();
            hexToHsl();
        }
    }
}

function convertFromRgb() {
    const match = rgbValue.value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        
        if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
            currentColor.value = `rgb(${r}, ${g}, ${b})`;
            rgbToHex(r, g, b);
            rgbToHsl(r, g, b);
        }
    }
}

function convertFromHsl() {
    const match = hslValue.value.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
    if (match) {
        const h = parseInt(match[1]);
        const s = parseInt(match[2]);
        const l = parseInt(match[3]);
        
        if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
            currentColor.value = `hsl(${h}, ${s}%, ${l}%)`;
            hslToRgb(h, s, l);
            hslToHex(h, s, l);
        }
    }
}

function hexToRgb() {
    let hex = hexValue.value.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    rgbValue.value = `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl() {
    let hex = hexValue.value.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    hslValue.value = `hsl(${h}, ${s}%, ${l}%)`;
}

function rgbToHex(r, g, b) {
    const toHex = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    hexValue.value = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    hslValue.value = `hsl(${h}, ${s}%, ${l}%)`;
}

function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    
    rgbValue.value = `rgb(${r}, ${g}, ${b})`;
}

function hslToHex(h, s, l) {
    hslToRgb(h, s, l);
    
    const rgbMatch = rgbValue.value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        
        rgbToHex(r, g, b);
    }
}

function setExampleColor(color) {
    hexValue.value = color.hex;
    rgbValue.value = color.rgb;
    hslValue.value = color.hsl;
    currentColor.value = color.hex;
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    showNotification.value = true;
    setTimeout(() => {
        showNotification.value = false;
    }, 2000);
}
</script>

<style scoped>
#color-converter {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.container {
    max-width: 900px;
    width: 100%;
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

header {
    background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
    color: white;
    padding: 25px 30px;
    text-align: center;
}

h1 {
    font-size: 28px;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 16px;
    opacity: 0.9;
}

.app-content {
    display: flex;
    flex-wrap: wrap;
    padding: 30px;
}

.color-preview {
    flex: 1;
    min-width: 250px;
    height: 250px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
}

.color-info {
    background: rgba(255, 255, 255, 0.2);
    padding: 15px 25px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    text-align: center;
}

.current-color {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.color-converters {
    flex: 2;
    min-width: 300px;
}

.converter-group {
    margin-bottom: 25px;
}

h3 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #2c3e50;
    display: flex;
    align-items: center;
}

h3 i {
    margin-right: 10px;
    color: #4776E6;
}

.input-group {
    display: flex;
    margin-bottom: 15px;
}

.input-group input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 5px 0 0 5px;
    font-size: 16px;
    outline: none;
    transition: border 0.3s;
}

.input-group input:focus {
    border-color: #4776E6;
}

.input-group button {
    padding: 12px 20px;
    background: #4776E6;
    color: white;
    border: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    transition: background 0.3s;
}

.input-group button:hover {
    background: #3b60c4;
}

.color-values {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 16px;
    border-left: 4px solid #4776E6;
}

.examples {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    margin-top: 20px;
}

.examples h3 {
    margin-bottom: 15px;
}

.example-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.example-color {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.example-color:hover {
    transform: scale(1.1);
}

footer {
    text-align: center;
    padding: 20px;
    background: #f1f3f6;
    color: #7a8599;
    font-size: 14px;
}

@media (max-width: 768px) {
    .app-content {
        flex-direction: column;
    }
    
    .color-preview {
        margin-right: 0;
        margin-bottom: 30px;
        height: 200px;
    }
}

.copy-btn {
    background: #eef2f8;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
    transition: background 0.3s;
}

.copy-btn:hover {
    background: #dfe6f1;
}

.notification {
    position: fixed;
    top: 20px;
    right: 0px;
    padding: 15px 25px;
    background: #4CAF50;
    color: white;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
}

.notification.show {
    transform: translateX(0);
}
</style>