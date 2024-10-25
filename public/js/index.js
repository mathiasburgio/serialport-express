class Index{
    constructor(){
        this.ultimaLectura = "";
    }
    init(){

        let aux = localStorage.getItem("conf");
        if(aux){
            aux = JSON.parse(aux);
            $("[name='puerto']").val(aux.puerto)
            $("[name='baudrate']").val(aux.baudrate)
            $("[name='modoLectura']").val(aux.modoLectura)
        }

        $("[name='conectar']").click(async ev=>{
            let data = {
                puerto: $("[name='puerto']").val(),
                baudrate: $("[name='baudrate']").val(),
                modoLectura: $("[name='modoLectura']").val(),
            }

            let ret = await $.post({
                url: "/connect",
                data: data
            })
            if(typeof ret == "string" && ret === "OK"){
                //todo bien
                $("[name='conectar']").prop("disabled", true);
                $("[name='desconectar']").prop("disabled", false);

                $("[name='puerto']").prop("disabled", true);
                $("[name='baudrate']").prop("disabled", true);
                $("[name='modoLectura']").prop("disabled", true);

                localStorage.setItem("conf", JSON.stringify(data));
                modal.mensaje("¡Conectado!");
                setTimeout(()=>{
                    modal.ocultar();
                },2000);
            }else{
                console.log(ret);
                modal.mensaje(ret.message);
            }
        })

        $("[name='desconectar']").click(async ev=>{
            let ret = await $.post({
                url: "/disconnect",
                data: {}
            })
            console.log(ret);
            $("[name='conectar']").prop("disabled", false);
            $("[name='desconectar']").prop("disabled", true);

            $("[name='puerto']").prop("disabled", false);
            $("[name='baudrate']").prop("disabled", false);
            $("[name='modoLectura']").prop("disabled", false);
        });

        setInterval(()=>{
            $.get({ url: "/get-data" })
            .then(ret=>{
                //console.log(ret);
                let alert = $(".alert");
                alert.find("[name='lectura']").html(ret);
                if(this.ultimaLectura != ret){
                    if( alert.hasClass("alert-light") ){
                        alert.addClass("alert-warning");
                        alert.removeClass("alert-light");
                    }else{
                        alert.removeClass("alert-warning");
                        alert.addClass("alert-light");
                    }
                }
                this.ultimaLectura = ret;
            })
        },200);
    }
}


var modal = new Modal();
var fechas = new Fechas();
var index = new Index();

window.onload = () => index.init()