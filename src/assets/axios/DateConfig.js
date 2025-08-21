import axios from '../js/base_axios'
// let projectId = window.parent._P ? window.parent._P.projectId || '1010' : '1010'

export default {
    // 获取表格数据
    getTabData(val) {
        return axios.get(`strengthen/queryBalanceControlList`, { params: val })
    },
    // 修改数据锁定状态
    changeDataLock(val) {
        return axios.post(`strengthen/batchUpdateLockStatus`, val)
    }
}