<template>
    <div class="container" v-loading="loading">
        <header>
            <h1>小白滴相册</h1>
            <p class="subtitle">按类别浏览您的美好回忆</p>
        </header>
        <div class="categories">
            <button
                v-for="(category, index) in categories"
                :key="index"
                class="category-btn"
                :class="{ active: activeCategory === category }"
                @click="setActiveCategory(category)">
                {{ category }}
            </button>
        </div>
        <div class="gallery">
            <div v-if="paginatedPhotos.length === 0" class="no-images">
                <p>当前分类没有照片</p>
            </div>
            <div v-else v-for="(photo, index) in paginatedPhotos" :key="index" class="photo" @click="openModal(index)">
                <!-- <img :src="photo.url" :alt="photo.title"> -->
                <img v-show="!loading" :src="path + photo.url" loading="lazy">
                <!-- <img v-if="photo.url" :src="require('../../public' + photo.url)"> -->
                <div class="photo-category">{{ photo.category }}</div>
            </div>
        </div>
        
        <div class="pagination-controls" v-if="totalPages > 1">
            <el-pagination
                :current-page="currentPage"
                :page-size="itemsPerPage"
                :page-sizes="[6, 12, 18, 24]"
                :size="size"
                background
                layout="sizes, prev, pager, next"
                :total="filteredPhotos.length"
                @size-change="handleSizeChange"
                @current-change="setPage"
            />
            <!-- <div class="items-per-page">
                <span>每页显示：</span>
                <select v-model="itemsPerPage">
                    <option v-for="item in [6, 12, 18, 24]" :value="item" :key="item">{{ item }}</option>
                </select>
                <span>张照片</span>
            </div>
            <div class="pagination">
                <button
                    v-for="page in totalPages"
                    :key="page"
                    class="page-btn"
                    :class="{ active: currentPage === page }"
                    @click="setPage(page)">
                    {{ page }}
                </button>
                <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">上一页</button>
                <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
            </div> -->
            <div class="page-info">
                第 {{ currentPage }} 页，共 {{ totalPages }} 页（{{ filteredPhotos.length }} 张照片）
            </div>
        </div>
        <div v-if="modalOpen" @click="closeModal" class="modal" :class="{ open: modalOpen }">
            <!-- <button class="close-btn" @click="closeModal">&times;</button> -->
            <button v-if="modalOpen" class="nav-btn prev" @click.stop="prevPhoto">&lt;</button>
            <div class="modal-content">
                <!-- <img :src="currentPhoto.url" :alt="currentPhoto.title"> -->
                <img :src="path + currentPhoto.url">
                <div class="photo-info">
                    <!-- {{ currentPhoto.title }} - {{ currentPhoto.category }} ({{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}) -->
                    {{ currentPhoto.category }} ({{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }})
                </div>
            </div>
            <button v-if="modalOpen" class="nav-btn next" @click.stop="nextPhoto">&gt;</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import photoList from '../utils/photo.json';
const loading = ref(true);
const photos = ref([]);
const modalOpen = ref(false);
const currentIndex = ref(0);
const activeCategory = ref('全部');
const itemsPerPage = ref(12);
const currentPage = ref(1);
const path = ref(process.env.NODE_ENV === 'production'? 'http://t1zu6d34z.sabkt.gdipper.com' : 'http://t1zu6d34z.sabkt.gdipper.com');
// http://t1zu6d34z.sabkt.gdipper.com
// http://www.bai-home.fun

console.log(process.env.NODE_ENV)
// https://cdn.jsdelivr.net/gh/baitianliang/demo@master/image/%E8%AE%A2%E5%A9%9A/IMG_20230503_002701.jpg
// 分类列表
const categories = computed(() => {
    const allCategories = ['全部', ...new Set(photos.value.map(photo => photo.category))];
    return allCategories;
});

// 筛选后的照片
const filteredPhotos = computed(() => {
    if (activeCategory.value === '全部') {
        return photos.value;
    }
    return photos.value.filter(photo => photo.category === activeCategory.value);
});

// 总页数
const totalPages = computed(() => {
    return Math.ceil(filteredPhotos.value.length / itemsPerPage.value);
});

// 当前页的照片
const paginatedPhotos = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredPhotos.value.slice(startIndex, startIndex + itemsPerPage.value);
});

// 当前查看的照片
const currentPhoto = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return filteredPhotos.value[startIndex + currentIndex.value];
});

// 当前查看的照片在全量中的索引
const currentPhotoIndex = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    return startIndex + currentIndex.value;
});

onMounted(() => {
    // 初始化时加载示例照片
    photos.value = photoList;
});

function setActiveCategory(category) {
    loading.value = true;
    activeCategory.value = category;
    currentPage.value = 1; // 重置到第一页
    setTimeout(() => {
        loading.value = false;
    }, 1000);
}

function setPage(page) {
    loading.value = true;
    currentPage.value = page;
    setTimeout(() => {
        loading.value = false;
    }, 1000);
}

function prevPage() {
    loading.value = true;
    if (currentPage.value > 1) {
        currentPage.value--;
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

function nextPage() {
    loading.value = true;
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        setTimeout(() => {
            loading.value = false;
        }, 1000);
    }
}

function openModal(index) {
    currentIndex.value = index;
    modalOpen.value = true;
    // 禁用背景滚动
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOpen.value = false;
    // 重新启用背景滚动
    document.body.style.overflow = 'auto';
}

function nextPhoto() {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const totalInPage = paginatedPhotos.value.length;
    
    if (currentIndex.value < totalInPage - 1) {
        currentIndex.value++;
    } else if (currentPage.value < totalPages.value) {
        currentPage.value++;
        currentIndex.value = 0;
    } else {
        currentIndex.value = 0;
    }
}

function prevPhoto() {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else if (currentPage.value > 1) {
        currentPage.value--;
        currentIndex.value = itemsPerPage.value - 1;
    } else {
        currentIndex.value = paginatedPhotos.value.length - 1;
    }
}

// 当每页显示数量改变时，重置到第一页
watch(itemsPerPage, () => {
    currentPage.value = 1;
});

// 当分类改变时，重置到第一页
watch(activeCategory, () => {
    currentPage.value = 1;
});

// 键盘导航支持
const handleKeydown = (e) => {
    if (!modalOpen.value) return;
    
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowRight') {
        nextPhoto();
    } else if (e.key === 'ArrowLeft') {
        prevPhoto();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
    loading.value = false;
});
</script>


<style lang="scss" scoped>
.container {
    height: 100%;
    overflow: auto;
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
    margin-bottom: 10px;
    color: #2c3e50;
}

.subtitle {
    font-size: 1.2rem;
    color: #7f8c8d;
}

.categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
}

.category-btn {
    padding: 10px 20px;
    background: #fff;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.category-btn:hover {
    background: #3498db;
    color: white;
    transform: translateY(-2px);
}

.category-btn.active {
    background: #3498db;
    color: white;
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.pagination-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.items-per-page {
    display: flex;
    align-items: center;
    gap: 10px;
}

.items-per-page select {
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

.pagination {
    display: flex;
    gap: 5px;
}

.page-btn {
    padding: 8px 15px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-btn:hover {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.page-btn.active {
    background: #3498db;
    color: white;
    border-color: #3498db;
}

.page-info {
    font-size: 1rem;
    color: #7f8c8d;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
}

.photo {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    aspect-ratio: 4/3;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.photo:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.photo:hover img {
    transform: scale(1.05);
}

.photo-category {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(52, 152, 219, 0.85);
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.modal.open {
    opacity: 1;
    pointer-events: auto;
}

.modal-content {
    max-width: 90%;
    max-height: 90%;
    position: relative;
}

.modal img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 8px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
}

.close-btn {
    position: absolute;
    top: 0px;
    right: 0;
    color: white;
    font-size: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.prev {
    left: 20px;
}

.next {
    right: 20px;
}

.photo-info {
    color: white;
    text-align: center;
    margin-top: 15px;
    font-size: 1.2rem;
}

.no-images {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
    color: #7f8c8d;
    background: white;
    border-radius: 10px;
}

@media (max-width: 768px) {
    .gallery {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .nav-btn {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    
    .categories {
        overflow-x: auto;
        padding-bottom: 10px;
        justify-content: flex-start;
    }
    
    .pagination-controls {
        flex-direction: column;
        align-items: stretch;
    }
    
    .items-per-page {
        justify-content: center;
    }
    
    .pagination {
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>