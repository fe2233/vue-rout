define(["jquery"], function() {
	var baseUrl = "http://127.0.0.1:8081";
	var list;
	getList();
	
	var add = {
		template: "<div class='re-box'><div><span>姓名</span><input type='text' id='name' v-model='name'/></div>"+
			"<div><span>月份</span><input type='number' id='month' v-model='month'/></div>"+
			"<div><span>成交数</span><input type='number' id='dones' v-model='dones'/></div>"+
			"<div><span>成交量</span><input type='number' id='doneCount' v-model='doneCount'/></div>"+
			"<button id='add' @click='add'>提交</button></div>",
		data:function() {
			return {
				name:"",
				month:null,
				dones:null,
				doneCount:null
			}
		},
		methods:{
			add:function() {
				if(this.name == "" || this.month == null || this.dones == null || this.doneCount == null) {
					alert("内容不能为空");
					return;
				}
				Vue.http.post(baseUrl+"/add/"+this.name+"/"+this.month+"/"+this.dones+"/"+this.doneCount).then((res) => {
					var mes = res.body;
					if(mes == "exist") {
						alert("数据已存在");
					} else if(mes == "success") {
						alert("提交成功");
						this.name = "";
						this.month = null;
						this.dones = null;
						this.doneCount = null;
					}
				},function(res){
					console.log(res.status);
				});
			}
		}
	};
	var view = {
		template: "<div class='data-box'><div class='title'><span>姓名</span><span>月份</span><span>成交数</span><span>成交额</span></div>"+
			"<div class='data-item' v-for='item in datas'><span>{{item.name}}</span><span>{{item.month}}</span><span>{{item.dones}}</span><span>{{item.doneCount}}</span></div></div>",
		data:function() {
			return {
				datas:list
			}
		}
	};
	var change = {
		template: "<div class='data-box change'><div class='title'><span>姓名</span><span>月份</span><span>成交数</span><span>成交额</span></div>"+
			"<div class='data-item' v-for='(item,index) in datas'><span>{{item.name}}</span><span>{{item.month}}</span><span>{{item.dones}}</span><span>{{item.doneCount}}</span><span class='change-s' @click='change(item.id, index)'>修改</span></div><div class='change-box'><div><span id='close' @click='closeChange'>x</span></div>"+
			"<div class='input-box'><span>姓名</span><input type='text' id='name' v-model='name' disabled/></div>"+
			"<div class='input-box'><span>月份</span><input type='number' id='month' v-model='month' disabled/></div>"+
			"<div class='input-box'><span>成交数</span><input type='number' id='dones' v-model='dones'/></div>"+
			"<div class='input-box'><span>成交量</span><input type='number' id='doneCount' v-model='doneCount'/></div>"+
			"<button id='update' :item-id='id' :index='index' @click='update()'>提交</button></div></div>",
		data:function() {
			return {
				datas:list,
				name:"",
				month:null,
				dones:null,
				doneCount:null,
				id:0,
				index:0
			}
		},
		methods:{
			change:function(id, index) {
				$(".change-box").show();
				this.name = list[index].name;
				this.month = list[index].month;
				this.dones = list[index].dones;
				this.doneCount = list[index].doneCount;
				this.id = id;
				this.index = index;
			},
			closeChange:function() {
				$(".change-box").hide();
			},
			update:function() {
				if(this.dones == null || this.doneCount == null) {
					alert("内容不能为空");
					return;
				}
				Vue.http.post(baseUrl+"/update/"+this.id+"/"+this.dones+"/"+this.doneCount).then((res) => {
					var mes = res.body;
					if(mes == "success") {
						alert("修改成功");
						list[this.index].dones = this.dones;
						list[this.index].doneCount = this.doneCount;
						this.name = "";
						this.month = null;
						this.dones = null;
						this.doneCount = null;
						$(".change-box").hide();
					}
				},function(res){
					console.log(res.status);
				});
			}
		}
	};
	var del = {
		template: "<div class='data-box del'><div class='title'><span>姓名</span><span>月份</span><span>成交数</span><span>成交额</span></div>"+
			"<div class='data-item' v-for='(item,index) in datas'><span>{{item.name}}</span><span>{{item.month}}</span><span>{{item.dones}}</span><span>{{item.doneCount}}</span><span class='del-s' @click='del(item.id,index)'>删除</span></div></div>",
		data:function() {
			return {
				datas:list
			}
		},
		methods:{
			del:function(id,index) {
				delData(id, index);
			}
		}
	};

	var routes = [
	  { path: '/add', component: add },
	  { path: '/view', component: view},
	  { path: '/change', component: change},
	  { path: '/del', component: del}
	];
	
	function getList() {
		$.ajax({
            url:baseUrl+'/getList',
            type:'get',
            async:false,
            data:{},
            timeout:5000,
            dataType:'json',
            success:function(data,textStatus,jqXHR){
               list = data;
            },
            error:function(xhr,textStatus){
                console.log('error:'+textStatus);
            }
       });
	}
	function delData(id, index) {
		Vue.http.post(baseUrl+'/delData/'+id).then(function(res){
			if(res.body == "success") {
				list.splice(index,1);
				alert("删除成功");
			}
		},function(res){
			console.log(res.status);
		});
	}
	
	new Vue({
		el:"#content",
		router:new VueRouter({routes: routes})
	});
});