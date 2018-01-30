!function(){
    const def_ruleJson  =  {
        "user|5-10": [{
                        'name': '@cname',   //中文名称
                        'age|1-100': 100,   //100以内随机整数
                        'birthday': '@date("yyyy-MM-dd")',  //日期
                        'city': '@city(true)'   //中国城市
                    }]
    }
  
    const def_url = 'http://api.com';

    var view = document.querySelector('.user_mock');
    var controller = {
        view :null,
        def_rule:null,
        def_dataList:null,
        reload_btn:null,
        ruleJson:null,
        init:function(view){
            this.view = view;
            this.rule = view.querySelector('[name=rule]');
            this.def_dataList = view.querySelector('[name=content]');
            this.reload_btn = view.querySelector('.refresh');
            this.ruleJson = def_ruleJson;
            this.ruleView();
            this.bindEvents();
            this.reloadData();
        },
        ruleView:function(){
            this.rule.value = JSON.stringify(this.ruleJson,null,4);
        },
        bindEvents:function(){
            Mock.mock('http://api.com',this.ruleJson);
            this.reload_btn.addEventListener('click',()=>{
                this.reloadData();
            })
        },
        reloadData:function(){
            $.ajax({
                    url: 'http://api.com',
                    dataType: 'json'
                }).done((data, status, xhr)=> {
                    this.def_dataList.value = JSON.stringify(data, null, 4)
                });
            }
    };
    controller.init(view);
}.call()