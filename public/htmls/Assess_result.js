
window.onload = function () {
    $("#right").hide(); //처음에는 가리기 
    $("#fadeinText1").hide();
    $("#fadeinText2").hide();
    $("#fadeinText3").hide();
    $("#fadeinText4").hide();
    bringDoA();
}

//위험 수용박스를 클릭했을 때 
$(function(){
    $('#box1').on('click',function(){ // 위험 수용 
        $("#box0").hide();
        $("#box1").hide();
        $("#box2").hide();
        $("#box3").hide();
        $("#box4").hide();
        $("#right").fadeIn(1000);
        $("#fadeinText1").fadeIn(1000);
        $(".bigbox").css({
            //"background-color": "#F1F0EF",
            "background-color":"white",
            "border":"2px white solid",
            "border-radius":"50px",
            "box-shadow": "2px 2px 3px 3px #CBCBCB"
            })
        


        $.ajax({
            url:"/assess/manage",
            type:"get",
            dataType:"json",
            data:{ "method":1}, //accept
            success:function(data){
                var html='';
                for(key in data){
                    html+='<tr>';
                    html+='<td>'+data[key].risk+'</td>'; //이게 위험 명 
                    html+='<td><select id="choice"><option value=1>위험 수용</option><option value=2>위험 전가</option><option value=3>위험 회피</option><option value=4>위험 감소</option></select></td>';
                    html+='<td id="riskNum">'+data[key].riskId+'</td>'; //이게 위험 고유 번호, 숨겨짐 
                    html+='</tr>';
                }
                html+='<tr><td colspan="2"><button type-"button" id="save">저장</td></tr>'
                $("#dynamicTbody").empty();
                $("#dynamicTbody").append(html);
            }
        })
        $("#choice").val(1).prop("selected", true); //초기 선택값 지정
    })
});



//위험 전가 박스를 클릭했을 때 
$(function(){
    $('#box2').on('click',function(){ // 위험 전가
        $("#box0").hide();
        $("#box1").hide();
        $("#box2").hide();
        $("#box3").hide();
        $("#box4").hide();
        $("#right").fadeIn(1000);
        $("#fadeinText2").fadeIn(1000);
        $(".bigbox").css({
            //"background-color": "#F1F0EF",
            "background-color":"white",
            "border":"2px white solid",
            "border-radius":"50px",
            "box-shadow": "2px 2px 3px 3px #CBCBCB"
            })

    
            $.ajax({
                url:"/assess/manage",
                type:"get",
                dataType:"json",
                data:{"method":2},//transfer
                success:function(data){
                    var html='';
                    for(key in data){
                        html+='<tr>';
                        html+='<td>'+data[key].risk+'</td>'; //이게 위험 명 
                        html+='<td><select id="choice"><option value=2>위험 전가</option><option value=1>위험 수용</option><option value=3>위험 회피</option><option value=4>위험 감소</option></select></td>';
                        html+='<td id="riskNum">'+data[key].riskId+'</td>'; //이게 위험 고유 번호, 숨겨짐 
                        html+='</tr>';
                    }
                    html+='<tr><td colspan="2"><button type-"button" id="save">저장</td></tr>'
                    $("#dynamicTbody").empty();
                    $("#dynamicTbody").append(html);
                }
            })
        $("#choice").val(2).prop("selected", true); //초기 선택값 지정
    })
});



//위험 회피 박스를 클릭했을 때 
$(function(){
    $('#box3').on('click',function(){ // 위험 회피
        $("#box0").hide();
        $("#box1").hide();
        $("#box2").hide();
        $("#box3").hide();
        $("#box4").hide();
        $("#right").fadeIn(1000);
        $("#fadeinText3").fadeIn(1000);
        $(".bigbox").css({
            //"background-color": "#F1F0EF",
            "background-color":"white",
            "border":"2px white solid",
            "border-radius":"50px",
            "box-shadow": "2px 2px 3px 3px #CBCBCB"
            })

    
            $.ajax({
                url:"/assess/manage",
                type:"get",
                dataType:"json",
                data:{"method":3},
                success:function(data){
                    var html='';
                    for(key in data){
                        html+='<tr>';
                        html+='<td>'+data[key].risk+'</td>'; //이게 위험 명 
                        html+='<td><select id="choice"><option value=3>위험 회피</option><option value=1>위험 수용</option><option value=2>위험 전가</option><option value=4>위험 감소</option></select></td>';
                        html+='<td id="riskNum">'+data[key].riskId+'</td>'; //이게 위험 고유 번호, 숨겨짐 
                        html+='</tr>';
                    }
                    html+='<tr><td colspan="2"><button type-"button" id="save">저장</td></tr>'
                    $("#dynamicTbody").empty();
                    $("#dynamicTbody").append(html);
                }
            })

        $("#choice").val(3).prop("selected", true); //초기 선택값 지정
    })
});



//위험 감소 박스를 클릭했을 때 
$(function(){
    $('#box4').on('click',function(){ // 위험 감소
        $("#box0").hide();
        $("#box1").hide();
        $("#box2").hide();
        $("#box3").hide();
        $("#box4").hide();
        $("#right").fadeIn(1000);
        $("#fadeinText4").fadeIn(1000);
        $(".bigbox").css({
            //"background-color": "#F1F0EF",
            "background-color":"white",
            "border":"2px white solid",
            "border-radius":"50px",
            "box-shadow": "2px 2px 3px 3px #CBCBCB"
            })

            $.ajax({
                url:"/assess/manage",
                type:"get",
                dataType:"json",
                data:{"method":4},
                success:function(data){
                    var html='';
                    for(key in data){
                        html+='<tr>';
                        html+='<td>'+data[key].risk+'</td>'; //이게 위험 명 
                        html+='<td><select id="choice"><option value=4>위험 감소</option><option value=1>위험 수용</option><option value=2>위험 전가</option><option value=3>위험 회피</option></select></td>';
                        html+='<td id="riskNum">'+data[key].riskId+'</td>'; //이게 위험 고유 번호, 숨겨짐 
                        html+='</tr>';
                    }
                    html+='<tr><td colspan="2"><button type-"button" id="save">저장</td></tr>'
                    $("#dynamicTbody").empty();
                    $("#dynamicTbody").append(html);
                }
            })

            
        $("#choice").val(4).prop("selected", true); //초기 선택값 지정
    });

});

$(document).off("click").on("click","#save",function(){ //지금까지 입력한 값들 모두 받아야함
    var close=$(this).closest("tr")
    console.log("가장 가까운 아이: ",close)
    
    var table=close.parent() // (상위)테이블을 찾아가기
    console.log("parent: ",table);
    var size=$('#methodTable>tbody tr').length //rows 수
    console.log("표의 크기: ",size)
    
    var json='['

    $('#methodTable>tbody tr').each(function(index){
        var tr=$(this)
        //console.log("인덱스:",index)
        if(index==size-1)
            return false;
        var td=tr.children();
        var sel=td.find('#choice').val();
        var num=td.eq(2).text(); // 숨겨진 위협 번호 
        console.log("선택한 값:",sel);
        console.log("위험 숫자:",num);
        console.log(index);
        json+='{"Selected":'+sel+',"num":'+num+'},'
        //json+='{"frequency":1,"money":2,"num":3},'
    }) //each 문 
    json=json.slice(0,-1)
    json+=']'
    console.log(json)
    console.log(JSON.parse(json))
 


    $.ajax({
        type: 'POST',   //post방식으로 명시
        url : '/assess/changeStrategy',  //취약성 정보 보낼 서버 주소 
        dataType:'json',
        data:{data:json},
        success: function(data){   //데이터 주고받기 성공했을 경우 실행할 결과, data는 서버로부터 받은 데이터 
            //function(data)를 쓰게 되면 전달받은 데이터가 data안에 담아서 들어오게 된다. 
            console.log(JSON.parse(data));
        },
        error:function(){   //데이터 주고받기가 실패했을 경우 실행할 결과
            console.log(error);
        }
    })

})



/*function change(obj){ //select box 다른 옵션 클릭했을때

    //var index=obj.closest("tr").rowIndex;
    //console.log(index); //클릭한 애의 rowindex 가져오기 
    var val=obj.closest("td");
    var sel=val.firstChild.options[val.firstChild.selectedIndex].value; //클릭한 애의 선택된 값 가져오기 
    console.log(sel);

    var num=obj.closest("tr").childNodes[2].innerText; //감춰진 위험 고유번호 가져오기 
    console.log(num);

    var obj=({"selected":sel,"num":num}); //{변경한 값, 위험 고유번호} 전송

    $.ajax({
        type: 'POST',   //post방식으로 명시
        url : '/assess/changeMethod',  //서버 주소 
        dataType:'json',
        data: obj,
        success: function(data){   //데이터 주고받기 성공했을 경우 실행할 결과, data는 서버로부터 받은 데이터 
            //function(data)를 쓰게 되면 전달받은 데이터가 data안에 담아서 들어오게 된다. 
            console.log(data);
        },
        error:function(){   //데이터 주고받기가 실패했을 경우 실행할 결과
            console.log(error);
        }
    })
}*/




function bringDoA(){ //select box 다른 옵션 클릭했을때

    $.ajax({
        type: 'GET',   //post방식으로 명시
        url : '/assess/bringDoA',  //서버 주소 
        dataType:'json',
        success: function(data){   //데이터 주고받기 성공했을 경우 실행할 결과, data는 서버로부터 받은 데이터 
            //function(data)를 쓰게 되면 전달받은 데이터가 data안에 담아서 들어오게 된다. 
            console.log(data);
            var doa=data.DoA;
            $("#DoA").text(doa);
        },
        error:function(){   //데이터 주고받기가 실패했을 경우 실행할 결과
            console.log(error);
        }
    })
}