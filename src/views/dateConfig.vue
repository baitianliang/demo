<template>
    <div id="dateConfig" v-loading="loading">
        <div class="title">
            <div>项目管理表格</div>
            <div>管理项目锁定状态和筛选数据   锁定BP：到货验收入库、出库领料申请、退货单、退库单、进度报量</div>
        </div>
        <el-card class="search-form">
            <div>
                <el-icon><Search /></el-icon>
                <div>筛选条件：</div>
            </div>
            <div>
                <div class="search-label">项目编号：</div>
                <el-input v-model="projectCode" placeholder="输入项目编号查询"></el-input>
            </div>
            <div>
                <div class="search-label">年月：</div>
                <el-input v-model="yearMonth" placeholder="输入年月查询"></el-input>
            </div>
            <el-button type="primary" @click="searchData">查询</el-button>
            <el-button @click="resetSearch">重置筛选</el-button>
            <div class="right-button">
                <el-button type="primary" :icon="FolderChecked" @click="changeStatus">保存更改</el-button>
            </div>
        </el-card>
        <el-card class="config-table">
            <el-table
                ref="multipleTableRef"
                :data="tableData"
                row-key="id"
                height="100%">
                <!-- <el-table-column label="Date">
                    <template #default="scope">{{ scope.row.date }}</template>
                </el-table-column> -->
                <el-table-column property="projectName" label="项目名称" />
                <el-table-column property="projectCode" label="项目编号" />
                <el-table-column property="yearMonth" label="年月" />
                <el-table-column type="selection" label="是否锁定" width="100" />
            </el-table>
            <el-pagination
                v-model:current-page="searchForm.pageNum"
                :page-size="30"
                :size="searchForm.pageSize"
                background
                layout="total, prev, pager, next"
                :total="searchForm.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-card>
    </div>
</template>

<script setup>
import { Search, FolderChecked } from '@element-plus/icons-vue'
import { nextTick, onMounted, ref } from "vue";
import { TableInstance, ElMessage } from 'element-plus'
import axios from "../assets/axios/DateConfig"

const loading = ref(false)
const projectCode = ref("")
const yearMonth = ref("")
const searchForm = ref({
    pageNum: 1,
    pageSize: 30,
    total: 100,
    projectCode: "",
    yearMonth: "",
    projectId: ''
})
const tableData = ref([])
const multipleTableRef = ref(TableInstance)

onMounted(() => {
    loading.value = true
    getTableData()
})
function getTableData() {
    axios.getTabData(searchForm.value)
    .then(res => {
        searchForm.value.total = res.data.data.total
        tableData.value = res.data.data.records
        tableData.value.forEach(el => {
            changeDataList.find(item => item.id === el.id) && (el.isLocked = el.isLocked === "Y" ? "N" : "Y")
        })
        toggleSelection()
    })
    // tableData.value = [...tableData.value, ...tableData.value, ...tableData.value, ...tableData.value, ...tableData.value]
}
function toggleSelection() {
    nextTick(() => {
        tableData.value.forEach(el => {
            if(el.isLocked === "Y") {
                multipleTableRef.value.toggleRowSelection(el, true)
            }
        })
        loading.value = false
    })
}
function searchData() {
    searchForm.value.projectCode = projectCode.value
    searchForm.value.yearMonth = yearMonth.value
    loading.value = true
    getTableData()
}
function resetSearch() {
    projectCode.value = ""
    yearMonth.value = ""
    searchForm.value.projectCode = ""
    searchForm.value.yearMonth = ""
    searchForm.value.pageNum = 1
    loading.value = true
    getTableData()
}
// const multipleSelection = ref([])
// function handleSelectionChange(val) {
//     console.log(val)
//     // multipleSelection.value = val
// }

function changeStatus() {
    loading.value = true
    getObjectArrayDifferences()
    axios.changeDataLock(changeDataList)
    .then(res => {
        if(res.data.code === 200) {
            ElMessage.success('修改成功')
            changeDataList = []
            getTableData()
        }
    })
}
function handleSizeChange(val) {
    console.log(val)
}
function handleCurrentChange(value) {
    loading.value = true
    getObjectArrayDifferences()
    searchForm.value.pageNum = value
    getTableData()
}
let changeDataList = []
function getObjectArrayDifferences() {
    const arr1 = tableData.value, arr2 = multipleTableRef.value.getSelectionRows()
    const diff = []
    arr1.forEach(item => {
        const obj = arr2.find(obj => obj.id === item.id)
        if(obj && obj.isLocked === "N") {
            if(changeDataList.find(_item => item.id === _item.id)) {
                changeDataList = changeDataList.filter(_item => item.id !== _item.id)
            } else {
                item.isLocked = "Y"
                diff.push(item)
            }
        } else if(!obj && item.isLocked === "Y") {
            if(changeDataList.find(_item => item.id === _item.id)) {
                changeDataList = changeDataList.filter(_item => item.id !== _item.id)
            } else {
                item.isLocked = "N"
                diff.push(item)
            }
        }
    })
    changeDataList = [ ...changeDataList, ...diff ]
}
</script>

<style lang="scss">
#dateConfig{
    display: flex;
    flex-direction: column;
    margin: 40px 30px;
    height: calc(100% - 80px);
    font-size: 18px;
    line-height: 18px;
    .title {
        :first-child {
            font-size: 28px;
            line-height: 28px;
            font-weight: 800;
        }
        :last-child {
            font-size: 18px;
            margin-top: 20px;
        }
    }
    .search-form {
        margin-top: 30px;
        .el-card__body {
            display: flex;
            align-items: center;
            >div {
                margin-left: 10px;
                display: flex;
                align-items: center;
                .search-label {
                    width: 180px;
                    text-align: right;
                }
            }
            .el-button {
                margin-left: 10px;
            }
            .right-button {
                flex: 1;
                text-align: right;
                justify-content: flex-end;
            }
        }
    }
    .config-table {
        flex: 1;
        margin-top: 20px;
        .el-card__body {
            height: calc(100% - 40px);
            .el-table {
                max-height: calc(100% - 52px);
                overflow: auto;
            }
            .el-pagination {
                margin-top: 20px;
                justify-content: flex-end;
            }
        }
    }
}
</style>