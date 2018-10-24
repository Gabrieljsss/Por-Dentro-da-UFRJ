//ARQUIVO JS QUE CHAMA QUE FAZ A PONTE ENTRE O CONTROLE E INTERFACE 



var disciplinas = [];
$(document).ready(function(){


// CARREGANDO OS DADOS INICIAIS DA PÁGINA /////////////////////////////////////////////////////////////////////
    var dre = $("#username-logado").text(); //gambiarra para simular variável de sessão
    console.log(dre);

    //carregar as disciplinas inscritas (aulas)
    var dados = {'dre':  dre};
    $.ajax({
        type : 'POST',
        url : "/getAulas",
        contentType: 'application/json',
        dataType:"json",
        data : JSON.stringify(dados),
        success: function(response) {
            console.log(response);
            if (response.resposta == 'erro') {
                alert("Adicione alguma disciplina");
            }
            $("#container-disciplinas").empty();
            console.log(response);
            for (let i = 0; i < response.length; i++) {
                var element = "<div class='card' style='width: 30rem; display: inline-block;'> \
                            <div class='card-body'>\
                                <h5 id='inscrito-disciplina' class='card-title'>"+response[i].nome+"</h5>\
                                <h6 id='inscrito-professor' class='card-subtitle mb-2 text-muted'>"+response[i].professor+"</h6>\
                                <h6 id='inscrito-creditos' class='card-subtitle mb-2 text-muted'>"+response[i].creditos+" créditos</h6>\
                                <h6 id='inscrito-horario' class='card-subtitle mb-2 text-muted'>Horário: "+response[i].horario+"</h6>\
                                <button id = 'ver-materiais' class='btn btn-outline-info'>materiais </button>\
                                <button id = 'ver-professor'  class='btn btn-outline-info'>Professor</button>\
                                <button id = 'ver-comentarios' class='btn btn-outline-info'>Comentarios</button>\
                                <button id='remove-disciplina' style='float:right; background-color:brown' type='button' class='btn btn-secondary' data-dismiss='modal'>X</button>\
                            </div>\
                            </div>";
                $("#container-disciplinas").append(element);   
            }
            carregaProfessores(); //ISSO SALVOU MINHA VIDA! NUNCA NESSE MUNDO DEVE-SE FAZER REQUISICOES AJAX SEGUIDAS DE FORMA PROCEDURAL
        },
        error: function () {
            console.log("error");
        }
    });


    // carrega uma lista com todos os professores cadastrados no bd (a funcao e chamada na na requisicao acima)
    function carregaProfessores(){
        var lista = [];
        $.ajax({
            type : 'POST',
            url : "/getProfessores",
            contentType: 'application/json',
            dataType:"json",
            data : JSON.stringify(dados),
            success: function(response) {
                console.log(response);
                for (let i = 0; i < response.length; i++) {
                    nome = response[i].nome;
                    lista.push(nome);
                    console.log(lista);

                    //nesse momento serão carregados todos os inputs nos quais o user pode insererir alguma informacao

                    // input da hora que cadastra uma disciplina
                    var input1 = document.getElementById("professor-inscrever");
                    new Awesomplete(input1, { list: lista });

                    //input da hora que manda os comentarios sobre um professor
                    var input2 = document.getElementById("nome-avaliado");
                    new Awesomplete(input2, { list: lista });
                }

                carregaDisciplinas();
            },
            error: function () {
                console.log("error");
            }
        });
    }

    function carregaDisciplinas() {
        var lista = [];
        $.ajax({
            type : 'POST',
            url : "/getDisciplinas",
            contentType: 'application/json',
            dataType:"json",
            data : JSON.stringify(dados),
            success: function(response) {
                console.log(response);
                for (let i = 0; i < response.length; i++) {
                    nome = response[i].nome;
                    lista.push(nome);
                    console.log(lista);

                    //nesse momento serão carregados todos os inputs nos quais o user pode insererir alguma informacao

                    // input da hora que cadastra uma disciplina
                    
                    var input1 = document.getElementById("materia-inscrever");
                    new Awesomplete(input1, { list: lista });

                    var input1 = document.getElementById("disciplina-avaliada");
                    new Awesomplete(input1, { list: lista });

                    var input1 = document.getElementById("enviar-disciplina");
                    new Awesomplete(input1, { list: lista });

                }
            },
            error: function () {
                console.log("error");
            }
        });
    }

    



////////////////////////////////////////////////////////////////////////////////////////////////////




/////Adiciona uma disciplina ao quadro de disciplinas
    $("#btn-inscrever").click(function(){
        //fazer uma verificacao pra ver se a disciplina e valida, dar append no container e fazer uma req ajax
        var nomeParcial = $("#materia-inscrever").val();
        $("#nome-inscrever").val(nomeParcial);
        var disciplina = $("#materia-inscrever").val();
        $("#go-inscrever").prop("disabled", false);

        $("#go-inscrever").unbind('click').click(function(e){
            var professor = $("#professor-inscrever").val();
            var horario = $("#horario-inscrever").val();
            var nome = $("#nome-inscrever").val();
            var creditos = $("#creditos-inscrever").val();
            
            var dados = {'nome':nome, 'professor':professor, 'dre':dre, 'creditos': creditos, 'horario': horario};
            console.log(dados);


            $.ajax({
                type : 'POST',
                url : "/sendAula",
                contentType: 'application/json',
                dataType:"json",
                data : JSON.stringify(dados),
                success: function(response) {
                    console.log(response);
                },
                error: function () {
                    console.log("error");
                }
            });

            var element = "<div class='card' style='width: 30rem; display: inline-block;'> \
                            <div class='card-body'>\
                                <h5 id='inscrito-disciplina' class='card-title'>"+nome+"</h5>\
                                <h6 id='inscrito-professor' class='card-subtitle mb-2 text-muted'>"+professor+"</h6>\
                                <h6 id='inscrito-creditos' class='card-subtitle mb-2 text-muted'>"+creditos+"</h6>\
                                <h6 id='inscrito-horario' class='card-subtitle mb-2 text-muted'>"+horario+"</h6>\
                                <button id = 'ver-materiais' href='#' class='btn btn-outline-info'>materiais </button>\
                                <button id = 'ver-professor' href='#' class='btn btn-outline-info'>Professor</button>\
                                <button id = 'ver-comentarios' href='#' class='btn btn-outline-info'>Comentarios</button>\
                                <button id='remove-disciplina' style='float:right; background-color:brown' type='button' class='btn btn-secondary' data-dismiss='modal'>X</button>\
                            </div>\
                            </div>";

            console.log(element);
            $("#container-disciplinas").append(element);
            
        });
    });




    //so pra debugar e ja pode apagar 
    comentarios = ["loremcksjdbcjsc sdlncsdjknc,  sdclosnvoihlns d iuguy fiti uf tuf tuf loremcksjdbcjsc sdlncsdjknc,  sdclosnvoihlns d iuguy fiti uf tuf tufloremcksjdbcjsc sdlncsdjknc,  sdclosnvoihlns d iuguy fiti uf tuf tufloremcksjdbcjsc sdlncsdjknc,  sdclosnvoihlns d iuguy fiti uf tuf tufloremcksjdbcjsc sdlncsdjknc,  sdclosnvoihlns d iuguy fiti uf tuf tuf"];
    comentarios[1] = comentarios[0];
    comentarios[2] = comentarios[0];
    comentarios[3] = comentarios[0];

    




///////Carrega os comentarios sobre um determinado professor
    $(document).on('click', '#ver-professor', function(){
        $("#nav-contact-tab").click();
        var professor = $(this).siblings("#inscrito-professor").text();
        var disciplina = $(this).siblings("#inscrito-disciplina").text();
            dados = {'professor':  professor};
            console.log(dados);
            $(".comentario").remove();
            $("#comentarios-prof").empty();
            $.ajax({
                type : 'POST',
                url : "/getProf",
                contentType: 'application/json',
                dataType:"json",
                data : JSON.stringify(dados),
                success: function(response) {
                    console.log(response);
                    comentarios =[];
                    for(var i=0; i<response.length;i++){
                        comentarios[i] = response[i].comentario;
                    }
                    console.log(comentarios);
                    $("#professor-nome").text(professor);
                    $("#professores-modal").modal("show");
                    $(".prof-jump-line").remove();
                    for(var i=0; i<comentarios.length;i++){
                        console.log("teste");
                        var comentario = "<li class='list-group-item' style = 'margin-left:5px;' class='lead' class='comentario'>" + comentarios[i] + "</li>";
                        $("#comentarios-prof").append("<br class='prof-jump-line'>");
                        $("#comentarios-prof").append(comentario);
                    }
                },
                error: function () {
                    alert("Não foi feito nenhum comentário até agora sobre esse professor. ");
                }
            });  
        console.log("teste:" + comentarios);
    });


    //MUDAR O LOCAL ONDE EU ATIVO O MODAL PARA ELE SÓ SER ATIVADO CASO JÁ TENHAM SIDO FEITO COMENTÁRIOS !!!!!!


 ///Carrega os comentarios sobre uma determinada disciplina
    $(document).on('click', '#ver-comentarios', function(){
        var discComentarios =[];
        $("#nav-contact-tab").click();
        var disciplina = $(this).siblings("#inscrito-disciplina").text();
            dados = {'disciplina':  disciplina};
            console.log(dados);
            $(".comentario").remove();
            $("#comentarios-disciplina").empty();
            $.ajax({
                type : 'POST',
                url : "/getComentariosDisciplina",
                contentType: 'application/json',
                dataType:"json",
                data : JSON.stringify(dados),
                success: function(response) {
                    console.log(response);
                    for(var i=0; i<response.length;i++){
                        discComentarios[i] = response[i].comentario;
                    }
                    console.log(discComentarios);
                    $("#disciplina-nome").text(disciplina);
                    $("#ver-disciplinas-modal").modal("show");
                    $(".disc-jump-line").remove();
                    for(var i=0; i<discComentarios.length;i++){
                        console.log("teste");
                        var comentario = "<li class='list-group-item' style = 'margin-left:5px;' class='lead' class='comentario'>" + discComentarios[i] + "</li>";
                        $("#comentarios-disciplina").append("<br class='disc-jump-line'>");
                        $("#comentarios-disciplina").append(comentario);
                    }
                },
                error: function () {
                    alert("Não foi feito nenhum comentário sobre essa disciplina. ");
                    console.log("error");
                }
            });  
        console.log("teste:" + discComentarios);
    });




////Enviar comentarios sobre o professor
    $("#avaliar-go").click(function(){
        console.log("Avaliando professor");
        var nome = $("#nome-avaliado").val();
        var comment = $("#comentario-avaliado").val();
        //ver como vai fazer pra colocar o comentario em tempo real
        dados = {'professor': nome, 'comentario' : comment};     
        sendData(dados, '/sendComentario');

    });



/////Enviar comentarios sobre o disciplina
    $("#disciplina-avaliar-go").click(function(){
        console.log("Avaliando disciplina");
        var disciplina = $("#disciplina-avaliada").val();
        var comment = $("#disciplina-comentario-avaliado").val();
        comentarios.push(comment);
        console.log(comentarios);

        dados = {'disciplina': disciplina, 'comentario' : comment};
        sendData(dados, '/sendComentarioDisciplina');
    
    });


////Funcao para encapsular o envio de dados 
    function sendData(data, url){
        $.ajax({
            type : 'POST',
            url : url,
            contentType: 'application/json',
            dataType:"json",
            data : JSON.stringify(data),
            success: function(response) {
                console.log(response);
            },
            error: function () {
                console.log("error");
            }
        });
        // além de dar push e guardar localmente, tem que mandar pro python guardar isso no servidor
        console.log(comentarios);
    }






////Carrega os materiais de uma determinada disciplina

    //apenas para testes estaticos
    var materiais = [
                    {'disciplina':'fisica II', 'link':'google.com', 'tipo':'1'}, 
                    {'disciplina':'fisica III', 'link':'globo.com', 'tipo':'1'}
                ];

    $(document).on('click', '#ver-materiais', function(){
        var disciplina = $(this).siblings("#inscrito-disciplina").text();
        $("#materiais-disciplina").text(disciplina);
        $("#nav-profile-tab").click();
        $("#materiais-modal").modal("show");
        $("#mostrar-materiais").click(function(){
            console.log(materiais);
            qualmostrar = $("#inlineFormCustomSelect").val();
            dados = {'disciplina':  disciplina};
            $.ajax({
                type : 'POST',
                url : "/getMateriais",
                contentType: 'application/json',
                dataType:"json",
                data : JSON.stringify(dados),
                success: function(response) {
                    console.log(response);
                    materiais = response;
                    $("#lista-materiais").empty();
                    for (var i = 0; i < materiais.length; i++) {
                        console.log(i +': ' + materiais[i].link);
                        if (materiais[i].tipo == qualmostrar) {
                            var element = "<ol class='breadcrumb'><li class='breadcrumb-item'><a target='_blank' href='"+ materiais[i].link +"'>"+materiais[i].link+"</a></li></ol>";
                            $("#lista-materiais").append(element);
                        }
                    }
                },
                error: function () {
                    console.log("error");
                }
            });
        });
    }); 


////Faz upload de material 
    $("#enviar-material-go").click(function(){
        var disciplina = $("#enviar-disciplina").val();
        var tipo = $("#enviar-tipo").val();
        if (tipo =='resumo') {
            tipo = '1';
            console.log(tipo);
        }
        if (tipo =='lista') {
            tipo = '2';
            console.log(tipo);
        }
        if (tipo =='livro') {
            tipo = '3';
            console.log(tipo);
        }
        if (tipo == 'slide'){
            tipo = '4'
            console.log(tipo);
        }
        var link = $("#enviar-link").val();
        obj = {'disciplina' : disciplina, 'link':link, 'tipo': tipo};
        materiais.push(obj);

        $.ajax({
            type : 'POST',
            url : "/sendMaterial",
            contentType: 'application/json',
            dataType:"json",
            data : JSON.stringify(obj),
            success: function(response) {
                console.log(response);
            },
            error: function () {
                console.log("error");
            }
        });
        // além de dar push e guardar localmente, tem que mandar pro python guardar isso no servidor
        console.log(materiais);

    });


    //Acho que pode apagar!
    $(document).on('click', '#ver-comentarios', function(){ 
        $("#ver-disciplinas-modal").modal("show");
        var disciplina = $(this).siblings("#inscrito-disciplina").text();
        console.log(disciplina);
        //chamar função que traz todos os comentários de uma dada disciplina e altera o likes 

    });


////Remover uma disciplina que havia sido adicionada ao mural de disciplinas
    $(document).on('click', '#remove-disciplina', function(){ 
        var disciplina = $(this).siblings("#inscrito-disciplina").text();
        console.log(disciplina);
        dados = {'dre':dre, 'disciplina':disciplina};
        $(this).parent().parent().remove();
        console.log("removed");
        $.ajax({
            type : 'POST',
            url : "/deleteAula",
            contentType: 'application/json',
            dataType:"json",
            data : JSON.stringify(dados),
            success: function(response) {
                console.log(response);
            },
            error: function () {
                console.log("error");
            }
        });


    });

    $("#logout").click(function(){
        $.cookie("username", null, { path: '/' });
        //$.cookie("logado", 0, { path: '/' });
        window.location.replace("/");
    });


$('body').bind('beforeunload',function(){
   $.ajax({
            type : 'POST',
            url : "/fechaConexao",
            contentType: 'application/json',
            dataType:"json",
            data : JSON.stringify({'conexao':'close'}),
            success: function(response) {
                console.log(response);
            },
            error: function () {
                console.log("error");
            }
        });
});




});

