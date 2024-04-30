<template>
  <div class="custom-layout-wrapper wh-100">
    <div class="custom-layout wh-100 flex-column">
      <!-- <vue-pdf-embed style="display: none;":source="pdfState.pdfSource" textLayer ref="vuePdfRef"/>
      <a :href="pdfUrl" target="_blank">preview</a>
      <button @click="PDFDownload">文件下载</button> -->
      <!-- <div class="custom-type">
        <el-radio-group v-model="pageType">
          <el-radio-button label="Grid" value="grid" />
          <el-radio-button label="Flex" value="flex" />
          <el-radio-button label="Moveable" value="moveable" />
        </el-radio-group>
      </div> -->

      <Header :type="pageType" />
      <div class="flex-item flex">
        <TemplateLib class="template-lib"/>
        <div class="v-page-box">

          <VPage :type="pageType"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import VPage from './components/VPage.vue'
import TemplateLib from './components/TemplateLib.vue'

const pageType = ref('grid')

// https://blog.csdn.net/qq_45897239/article/details/136080318
// import VuePdfEmbed from "vue-pdf-embed"
// import pdfUrl from './demo.pdf'

// const pdfState = reactive({
//     pdfSource: {
//         url: pdfUrl,
//         cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.9.359/cmaps/',
//         cMapPacked: true,
//     },
//     // 当前页
//     pageNum: 1,
//     // 总页数
//     numPages: 1,
// })

// const vuePdfRef = ref(null)

// // -- 获取文件名（用于 文件打印和下载）--
// function getPDFFileName() {
//   const last_index = pdfState.pdfSource.url.lastIndexOf('/');
//   return pdfState.pdfSource.url.slice(last_index + 1);
// }

// // -- pdf文件下载 --
// function PDFDownload() {
//   vuePdfRef.value.download(getPDFFileName());
// }
</script>

<style lang="scss" scoped>
.custom-layout-wrapper{
  overflow: auto;
  padding: 5px;
  .custom-layout{
    position: relative;
    .custom-type{
      position: absolute;
      top: 8px;
      left: 260px;
      z-index: 9;
    }
    .template-lib{
      width: 250px;
      background-color: #ffffff;
    }
    .v-page-box{
      width: calc(100% - 250px);
      background-color: #f7f7f7;
      padding: 40px;
      overflow: hidden;
    }
  }
}
</style>