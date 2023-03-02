import{b as r,c as n,d as o,e as c}from"./app.f96feccc.js";import{n as u}from"./index.303c07b0.js";import"./request.170a7db9.js";import"./vendor.53200e5a.js";var d=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",[e("div",{staticClass:"title-bar"},[e("div",{staticClass:"left"},[e("el-button",{attrs:{disabled:t.backId.length==0,type:"primary",size:"small"},on:{click:t.back}},[t._v("\u8FD4\u56DE")]),e("el-button",{attrs:{disabled:t.checkArr.length==0,type:"danger",size:"small"},on:{click:t.del}},[t._v("\u5220\u9664")])],1),e("div",{staticClass:"right"},[e("el-button",{attrs:{disabled:t.checkArr.length==0,type:"primary",size:"small"},on:{click:t.downFile}},[t._v("\u4E0B\u8F7D")]),e("el-button",{attrs:{type:"success",size:"small"},on:{click:t.mkdir}},[t._v("\u65B0\u5EFA\u6587\u4EF6\u5939")]),e("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.upload}},[t._v("\u4E0A\u4F20")])],1)]),e("el-table",{ref:"table",attrs:{"highlight-current-row":"",data:t.tableData},on:{"row-dblclick":t.rowDblclick,"row-click":t.rowClick,"selection-change":t.checkChange}},[e("el-table-column",{attrs:{type:"selection",width:"55"}}),e("el-table-column",{attrs:{label:"\u540D\u79F0",width:"200"},scopedSlots:t._u([{key:"default",fn:function(s){var l=s.row;return[t._v(" "+t._s(t._f("filterFlieName")(l))+" ")]}}])}),e("el-table-column",{attrs:{prop:"size",label:"\u5927\u5C0F",width:"100"}}),e("el-table-column",{attrs:{prop:"upload_time",label:"\u4E0A\u4F20\u65F6\u95F4"}})],1),e("el-dialog",{attrs:{title:"\u4E0A\u4F20\u6587\u4EF6",visible:t.visible,width:"400"},on:{"update:visible":function(s){t.visible=s}}},[e("el-upload",{staticClass:"upload-center",attrs:{drag:"",action:"","http-request":t.uploadSectionFile,"on-change":t.flieChange,"on-remove":t.flieChange,multiple:""}},[e("i",{staticClass:"el-icon-upload"}),e("div",{staticClass:"el-upload__text"},[t._v("\u5C06\u6587\u4EF6\u62D6\u5230\u6B64\u5904\uFF0C\u6216"),e("em",[t._v("\u70B9\u51FB\u4E0A\u4F20")])]),e("div",{staticClass:"el-upload__tip",attrs:{slot:"tip"},slot:"tip"},[t._v("\u53EA\u80FD\u4E0A\u4F20\u6587\u4EF6\uFF0C\u4E14\u5355\u4E2A\u5927\u5C0F\u4E0D\u8D85\u8FC7100mb")])]),e("span",{attrs:{slot:"footer"},slot:"footer"},[e("el-button",{attrs:{size:"small"},on:{click:function(s){t.visible=!1}}},[t._v("\u53D6\u6D88")]),e("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.save}},[t._v("\u4E0A\u4F20\u81F3\u6B64")])],1)],1)],1)},p=[];const h={name:"networkDisk",data(){return{visible:!1,tableData:[],path:"/",uuid:0,fileList:[],backId:[],checkArr:[]}},async mounted(){await this.init()},filters:{filterFlieName(t){return t.file_type=="dir"?t.name:t.name+t.file_type}},methods:{async init(){await this.postFile()},async back(){this.uuid=this.backId.pop(),await this.init()},async del(){let t=this.checkArr.map(i=>i.uuid);await this.deleteFile({delArr:t,user_id:this.$store.state.user.userInfo.id}),await this.init()},async downFile(){let t=this.checkArr.map(i=>i.uuid);window.open(`/file/download?downloadArr=${t}&user_id=${this.$store.state.user.userInfo.id}`)},async mkdir(){let t="\u65B0\u5EFA\u6587\u4EF6\u5939";this.$prompt("\u8BF7\u8F93\u5165\u6587\u4EF6\u5939\u540D\u79F0",t,{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",inputValidator:i=>i!==""&&i!==null,inputErrorMessage:"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A",type:"warning"}).then(async({value:i})=>{const e=i;let s={parentId:this.uuid,user_id:this.$store.state.user.userInfo.id,name:e,size:"0kb"};await this.putDir(s),this.$message.success(`${t}\u6210\u529F!`),await this.init()}).catch(i=>{console.error("\u9519\u8BEF\u6355\u6349",i),this.$message.info(`\u5DF2\u53D6\u6D88${t}`)})},upload(){this.visible=!0},rowClick(t,i){this.$refs.table.toggleRowSelection(t)},async rowDblclick(t,i){t.file_type=="dir"&&(this.backId.push(this.uuid),this.uuid=t.uuid,await this.init())},checkChange(t){this.checkArr=t,console.log(this.checkArr)},uploadSectionFile(t){if(!(t.file.size/1024/1024<100))return this.$message.error("\u53EA\u80FD\u4E0A\u4F20\u6587\u4EF6\u5927\u5C0F\u5C0F\u4E8E100M"),!1},flieChange(t,i){this.fileList=i},async save(){const t=new FormData;this.fileList.length>=1?(this.fileList.map(i=>{t.append("file",i.raw)}),t.append("parentId",this.uuid),t.append("user_id",this.$store.state.user.userInfo.id),await this.putFile(t),this.visible=!1,await this.init()):this.$message.warning("\u8BF7\u9009\u62E9\u4E0A\u4F20\u7684\u6587\u4EF6")},async postFile(){let t=await r({uuid:this.uuid,user_id:this.$store.state.user.userInfo.id});this.tableData=t.dataInfo.content},async putFile(t){await n(t)},async putDir(t){await o(t)},async deleteFile(t){await c(t)}}},a={};var f=u(h,d,p,!1,m,"b57bf9f8",null,null);function m(t){for(let i in a)this[i]=a[i]}var k=function(){return f.exports}();export{k as default};
