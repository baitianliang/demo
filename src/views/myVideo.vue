<template>
    <div class="header">
        <div class="logo">短视频</div>
            <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索内容">
        </div>
        <div class="nav-icons">
            <i class="fas fa-inbox"></i>
            <i class="fas fa-comment"></i>
        </div>
    </div>
    
    <div class="video-container" 
        @touchstart="handleTouchStart" 
        @touchmove="handleTouchMove" 
        @touchend="handleTouchEnd">
        
        <div class="video-wrapper" :style="{ transform: `translateY(-${currentIndex * 100}%)`, transition: transitionEnabled ? 'transform 0.3s ease' : 'none' }">
            <div class="video-item" v-for="(video, index) in videos" :key="video.id">
                <video 
                    :id="'video-' + index"
                    controls
                    :src="video.src"
                    @timeupdate="handleTimeUpdate"
                    @click="togglePlay">
                </video>
                
                <div class="progress-bar" v-if="index === currentIndex">
                    <div class="progress" :style="{ width: progress + '%' }"></div>
                </div>
                
                <div class="video-info">
                    <div class="author">
                        @{{ video.author }} <span>关注</span>
                    </div>
                    <div class="description">{{ video.description }}</div>
                    <div class="music">
                        <span class="music-icon">🎵</span>
                        {{ video.music }}
                    </div>
                </div>
                
                <!-- <div class="action-buttons">
                    <div class="action-item">
                        <div class="avatar">
                        <img :src="video.poster" />
                        </div>
                        <div class="follow">
                        <i class="fas fa-plus"></i>
                        </div>
                    </div>
                    
                    <div class="action-item" @click="toggleLike(video)">
                        <div class="action-icon">
                        <i class="fas fa-heart" v-if="video.liked" style="color: #fe2c55;"></i>
                        <i class="far fa-heart" v-else></i>
                        </div>
                        <div class="action-count" :style="{ color: video.liked ? '#fe2c55' : '#fff' }">
                        {{ video.likes }}
                        </div>
                    </div>
                    
                    <div class="action-item">
                        <div class="action-icon">
                        <i class="far fa-comment"></i>
                        </div>
                        <div class="action-count">{{ video.comments }}</div>
                    </div>
                    
                    <div class="action-item">
                        <div class="action-icon">
                        <i class="far fa-share-square"></i>
                        </div>
                        <div class="action-count">{{ video.shares }}</div>
                    </div>
                </div> -->
            </div>
        </div>
        
        <div class="video-controls">
            <div class="control-btn" @click="switchVideo(currentIndex - 1)">
                <i class="fas fa-chevron-left"></i>
            </div>
            <div class="control-btn play-btn" @click="togglePlay">
                <i class="fas fa-pause" v-if="isPlaying"></i>
                <i class="fas fa-play" v-else></i>
            </div>
            <div class="control-btn" @click="switchVideo(currentIndex + 1)">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
        
        <!-- <div class="like-animation" 
            v-for="animation in likeAnimations" 
            :key="animation.id"
            :style="{ top: animation.top, left: animation.left }">
        {{ animation.content }}
        </div> -->
        
        <!-- <div class="start-screen" v-if="showStartScreen">
        <button class="start-btn" @click="startPlayback">
            <i class="fas fa-play"></i> 开始观看
        </button>
        <p class="hint">点击"开始观看"按钮以启动视频播放器<br>根据浏览器策略，需要用户交互才能开始播放视频</p>
        </div> -->
    </div>
</template>

<script setup>
import { createApp, ref, onMounted, computed, reactive } from 'vue';
    // 视频数据
    const videos = ref([{
        id: 1,
        src: 'https://bai-home.fun/mp4/婚礼.mp4',
        poster: 'https://picsum.photos/360/640?random=1',
        author: '小白',
        description: '幸福的婚礼 #婚礼 #幸福',
        music: '婚礼进行曲',
        likes: 1245,
        comments: 89,
        shares: 30
    }]);
    
    const currentIndex = ref(0);
    const isPlaying = ref(false);
    const progress = ref(0);
    const touchStartY = ref(0);
    const transitionEnabled = ref(true);
    const likeAnimations = ref([]);
    const showStartScreen = ref(true);
    
    const currentVideo = computed(() => videos.value[currentIndex.value]);
    
    // 处理视频播放进度
    const handleTimeUpdate = (event) => {
        const video = event.target;
        progress.value = (video.currentTime / video.duration) * 100;
    };
    
    // 开始播放
    const startPlayback = () => {
        showStartScreen.value = false;
        togglePlay();
    };
    
    // 切换播放状态
    const togglePlay = () => {
        const video = document.getElementById(`video-${currentIndex.value}`);
        console.log(video.play)
        if (video) {
            if (video.paused) {
                video.play().then(() => {
                    isPlaying.value = true;
                }).catch(error => {
                    console.error("播放失败:", error);
                    showStartScreen.value = true;
                });
            } else {
                video.pause();
                isPlaying.value = false;
            }
        }
    };
    
    // 切换视频
    const switchVideo = (index) => {
        if (index < 0 || index >= videos.value.length) return;
        
        // 暂停当前视频
        const currentVideo = document.getElementById(`video-${currentIndex.value}`);
        if (currentVideo) {
            currentVideo.pause();
        }
        
        // 切换到新视频
        currentIndex.value = index;
        
        // 播放新视频
        setTimeout(() => {
            const newVideo = document.getElementById(`video-${currentIndex.value}`);
            if (newVideo) {
                newVideo.play().then(() => {
                isPlaying.value = true;
                }).catch(error => {
                console.error("播放失败:", error);
                isPlaying.value = false;
                });
            }
        }, 300);
    };
    
    // 处理触摸事件
    const handleTouchStart = (event) => {
        touchStartY.value = event.touches[0].clientY;
    };
    
    const handleTouchMove = (event) => {
        if (!touchStartY.value) return;
            
            const touchY = event.touches[0].clientY;
            const diffY = touchY - touchStartY.value;
            
            // 如果垂直滑动距离较大，则认为是上下切换视频
            if (Math.abs(diffY) > 50) {
            transitionEnabled.value = false;
            
            const videoWrapper = document.querySelector('.video-wrapper');
            if (videoWrapper) {
                videoWrapper.style.transform = `translateY(calc(-${currentIndex.value * 100}% + ${diffY}px))`;
            }
        }
    };
    
    const handleTouchEnd = (event) => {
        if (!touchStartY.value) return;
        
        const touchY = event.changedTouches[0].clientY;
        const diffY = touchY - touchStartY.value;
        
        // 重置触摸起点
        touchStartY.value = 0;
        
        // 启用过渡动画
        transitionEnabled.value = true;
        
        // 根据滑动方向切换视频
        if (Math.abs(diffY) > 100) {
            if (diffY > 0) {
                // 向下滑动，切换到上一个视频
                switchVideo(currentIndex.value - 1);
            } else {
                // 向上滑动，切换到下一个视频
                switchVideo(currentIndex.value + 1);
            }
        }
    };
    
    // 点赞功能
    const toggleLike = (video) => {
        video.likes += video.liked ? -1 : 1;
        video.liked = !video.liked;
        
        // 添加点赞动画
        if (video.liked) {
            const animation = {
                id: Date.now(),
                top: `${Math.random() * 50 + 25}%`,
                left: `${Math.random() * 30 + 35}%`,
                content: ['❤️', '👍', '🔥', '😍'][Math.floor(Math.random() * 4)]
            };
            likeAnimations.value.push(animation);
            
            // 3秒后移除动画
            setTimeout(() => {
                likeAnimations.value = likeAnimations.value.filter(a => a.id !== animation.id);
            }, 3000);
        }
    };
    
    // 初始化视频数据
    onMounted(() => {
        videos.value.forEach(video => {
            video.liked = false;
        });
        // 自动播放第一个视频
        //   setTimeout(() => {
        //     const firstVideo = document.getElementById('video-0');
        //     if (firstVideo) {
        //       firstVideo.play();
        //     }
        //   }, 500);
    });
</script>

<style>
.header {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background-color: #000;
    border-bottom: 1px solid #2c2c2c;
    z-index: 100;
}

.logo {
    font-weight: bold;
    font-size: 20px;
    background: linear-gradient(45deg, #ff0050, #ff3c00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.search-box {
    display: flex;
    align-items: center;
    background: #2c2c2c;
    border-radius: 20px;
    padding: 5px 15px;
    width: 50%;
}

.search-box i {
    margin-right: 8px;
    color: #888;
}

.search-box input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
    outline: none;
}

.video-container {
    height: calc(100% - 50px);
    flex: 1;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.video-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: transform 0.3s ease;
}

.video-item {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
}

video {
    width: 100%;
    /* height: 100%; */
    object-fit: cover;
}

.video-controls {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    gap: 20px;
}

.control-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    cursor: pointer;
}

.play-btn {
    width: 60px;
    height: 60px;
}

.video-info {
    position: absolute;
    bottom: 100px;
    left: 16px;
    right: 16px;
    z-index: 10;
}

.author {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
}

.author span {
    margin-left: 10px;
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
}

.description {
    font-size: 14px;
    margin-bottom: 12px;
    max-width: 70%;
}

.music {
    display: flex;
    align-items: center;
    font-size: 13px;
}

.music-icon {
    margin-right: 6px;
}

.action-buttons {
    position: absolute;
    right: 16px;
    bottom: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    gap: 25px;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.action-icon {
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-bottom: 6px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    cursor: pointer;
}

.action-count {
    font-size: 12px;
}

.avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-bottom: 6px;
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.follow {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #fe2c55;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    z-index: 20;
}

.progress {
    height: 100%;
    background: #fff;
    width: 0%;
    transition: width 0.1s linear;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    z-index: 5;
}

.like-animation {
    position: absolute;
    pointer-events: none;
    z-index: 100;
    font-size: 24px;
    opacity: 0;
    transition: all 0.8s;
}

.start-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 200;
    gap: 20px;
}

.start-btn {
    padding: 15px 40px;
    background: linear-gradient(45deg, #ff0050, #ff3c00);
    border: none;
    border-radius: 30px;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
}

.hint {
    text-align: center;
    max-width: 80%;
    color: #aaa;
    line-height: 1.6;
}

.nav-icons {
    display: flex;
    gap: 20px;
}

.nav-icons i {
    font-size: 20px;
    color: #fff;
}
</style>