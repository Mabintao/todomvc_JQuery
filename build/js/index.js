;(function(){
  
  var todo_list = [];
  var $check_all = $("#toggle-all");  //全选反选按钮
  var $new_todo = $(".new-todo");
  var $filters = $(".filters li");
  var filter_control = 0;     //0表示显示全部  1表示显示正在执行的   2表示显示已完成
  init(filter_control);

/*-------------------------数据改变执行以下两个函数 start-------------------------*/

    //初始化页面
    function init(filter_control,all){  

        //init 传两个参 filter_control判断需要显示哪种状态的土豆
        //all 判断是不是点击全选之后init 如果是传入true 不是则不传参 all用来判断全选按钮初始化状态

        var num = 0;  //num用来记录有多少未完成的土豆
        $(".todoapp .main .todo-list").html(null);
        if(store.get("todo_list")!=null){
          todo_list=store.get("todo_list");
          
        }
        if(filter_control==0){
          $.each(todo_list,function(index,ele){
              if(!ele.completed){num++};
              createHtml(index,ele);
          })
        }else if(filter_control==1){
          $.each(todo_list,function(index,ele){
              if(!ele.completed){num++};
              if(!ele.completed){
                createHtml(index,ele);
              } 
          })
        }else if(filter_control==2){
          $.each(todo_list,function(index,ele){
              if(!ele.completed){num++};
              if(ele.completed){
                createHtml(index,ele);
              } 
          })
        }
        
        if(!all){
          if(num == todo_list.length){
            $("#toggle-all").prop('checked','checked');
          }
        }
      
        $(".todo-count strong").text(num);


        /****功能函数在此调用****/
        createtodo();  //新建土豆
        edittodo();    //编辑土豆  
        destory();        //销毁土豆
        completed();    //完成土豆
        toggle_all();     //操作全部土豆
        clearCompleted();   //清除已经完成的土豆
        filter();   //过滤土豆
        
    }

    //更新浏览器中的数据
    function refresh(){
        store.set("todo_list",todo_list);
    }


/*-------------------------数据改变执行以下两个函数 end-------------------------*/


/*----------------------------------创建土豆 start---------------------------------*/

  //创建新土豆
  function createtodo(){
    $new_todo.keydown(function(ev){
        if(ev.keyCode==13){
            if(!$new_todo.val()) return;
            var todo = {};
            todo.content = $new_todo.val();
            todo.completed = false;
            todo_list.push(todo);
            $new_todo.val(null);
            refresh();
            init(filter_control);
        }
    })
  }

  //绑定HTML	
  function bindHtml(index,obj){
  		var str = '<li data-index="'+index+'" class="'+(obj.completed?"completed":"")+'" >'+
  					'<div class="view">'+
  						'<input class="toggle" type="checkbox" '+(obj.completed?"checked":"")+'>'+
  						'<label>'+obj.content+'</label>'+
  						'<button class="destroy"></button>'+
  					'</div>'+
  					'<input class="edit" value="Rule the web">'+
  				   '</li>'
		return str;	
  }

  //生成Html代码
  function createHtml(index,obj){
  		$(".todoapp .main .todo-list").prepend(bindHtml(index,obj));
  }

  /*----------------------------------创建土豆 end---------------------------------*/


  /*----------------------------------编辑土豆 start---------------------------------*/

  function edittodo(){
    $(".todo-list .view label").dblclick(function(ev){
      var that = this;
      var index = $(this).parent().parent().data("index");
      $(this).parent().parent().addClass("editing");
      $(".todo-list .editing .edit").val($(this).text());
      $(".todo-list .editing .edit").select();      //选中所有文字
      $(".todo-list .editing .edit").focus();
      $(".todo-list .editing .edit").blur(function(){
       
        if($(".todo-list .editing .edit").val()!=""){
          console.log(1)
          $(that).text($(".todo-list .editing .edit").val());
          todo_list[index].content=$(".todo-list .editing .edit").val();
          refresh();
        }
        $(that).parent().parent().removeClass("editing");
        
      })

    })
  }

  /*----------------------------------编辑土豆 start---------------------------------*/


  /*----------------------------------销毁土豆 start---------------------------------*/

  function destory(){
      var $delBtn = $(".view .destroy");
      $delBtn.click(function(){
        var index = $(this).parent().parent().data("index");
        $(window).on("mouseup keyup",function(){
         clearSlct();
        });
        todo_list.splice(index,1);
        refresh();
        init(filter_control);
      })
  }

  //清除已完成土豆
  function clearCompleted(){
    $(".clear-completed").click(function(){
      for(var i=0; i<todo_list.length; i++){
        if(todo_list[i].completed){
          todo_list.splice(i,1);
        }
      }
      refresh();
      init(filter_control);
    })
  }

  /*----------------------------------销毁土豆 start---------------------------------*/

  
  /*----------------------------------完成土豆 start---------------------------------*/

  /*点击选择框 获取选择框对应li的index值 进而获取数据库中对应数据 

                    将该数据的completed值取反 并将数据保存到浏览器 刷新页面*/

  //单选
  function completed(){
    $(".todo-list .toggle").click(function(){
      var index = $(this).parent().parent().data("index");
      todo_list[index].completed = !todo_list[index].completed;
      refresh();
      init(filter_control);
    })
  }

  //全选和反选
  function toggle_all(){
  
    $(".main>label").click(function(){
      if($check_all.is(':checked')) {
        $.each(todo_list,function(index,ele){
          ele.completed=true;
        })
      }else {
        $.each(todo_list,function(index,ele){
          ele.completed=false;
        })
      }
      refresh();
      init(filter_control,true);
    })
  }

  /*----------------------------------完成土豆 end---------------------------------*/


  /*----------------------------------筛选土豆 start---------------------------------*/
  
  function filter(){
    $filters.each(function(index,ele){
      $(ele).click(function(){
        filter_control = index;
        $(this).find("a").addClass("selected");
        $(this).siblings().find("a").removeClass("selected");
        init(index);
      })  
    })
  }

  /*----------------------------------筛选土豆 end---------------------------------*/


}());
