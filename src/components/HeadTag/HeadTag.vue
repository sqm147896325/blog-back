<template>
    <div class="tag-content">
        <el-tag
            v-for="tag in keepArr"
            :key="tag.name"
            :closable="tag.meta.title !== '首页'"
            :disable-transitions="false"
            size="mini"
            :hit="false"
            :effect="activeMenu === tag.fullPath ? 'dark' : 'plain'"
            @click="handleClick(tag)"
            @close="handleClose(tag)"
        >
            {{tag.meta.title}}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ 新页签</el-button>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
    name: 'HeadTag',
    data() {
        return {
            inputVisible: false,
            inputValue: ''
        };
    },
    computed: {
        // ...mapGetters('alive', ['keepTitle']),
        ...mapState('alive', ['keepArr']),
        ...mapState('aside', ['activeMenu']),
    },
    mounted() {
        console.log('keepArr', this.keepArr)
    },
    methods: {
        // 关闭页签
        handleClose(tag) {
            console.log('handleClose', tag)
            this.$store.commit('alive/closeKeep', tag)
        },

        // 点击页签
        handleClick(tag) {
            console.log('handleClick', tag)
            this.$router.push({ name: tag.name })
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                // 这里回车确认可能触发两次，判断是否有值阻止第二次
                console.log('inputValue', inputValue)
                this.$message.info('开发中')
            }
            this.inputVisible = false;
            this.inputValue = '';
        }
    }
}
</script>

<style lang="less" scoped>
.tag-content{
    display: flex;
    align-items: center;
    cursor: pointer;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 24px;
    line-height: 24px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    
    margin-left: 10px;
    vertical-align: bottom;
}
::v-deep .el-input--mini .el-input__inner{
    height: 23px;
    line-height: 23px;
}
</style>