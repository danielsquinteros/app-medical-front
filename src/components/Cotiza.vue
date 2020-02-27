<template>
    <v-row>
        <v-col>
            <v-data-table
            :headers="headers"
            :items="cotizaciones"
            :search="search"
            sort-by="calories"
            class="elevation-1"
            border-radius="0px"
            v-if="verNuevo==0"
            >
                <template v-slot:top>
                    <v-toolbar text class="elevation-0" color="white">
                    <v-toolbar-title>Crear Pedido</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field  v-if="verNuevo==0"class="text-xs-center" v-model="search" append-icon="search" label="Buscar Pedido" single-line hide-details ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" v-if="verNuevo ==0" @click="mostrarNuevo(), selectNumeroPedido()  ">Nuevo Pedido</v-btn>
                        <v-dialog v-model="adModal" max-width="290">
                            <v-card>
                                <v-card-title class="headline" v-if="adAccion==1">
                                    Activar Item
                                </v-card-title>
                                <v-card-title class="headline" v-if="adAccion==2">
                                    Desactivar Item
                                </v-card-title>
                                <v-card-text>
                                    Estás a punto de 
                                    <span v-if="adAccion==1">activar</span>
                                    <span v-if="adAccion==2">desactivar</span> 
                                    el item  {{ adNombre }}               
                                </v-card-text>
                                <v-card-actions>  
                                    <v-spacer></v-spacer>
                                    <v-btn @click="activarDesactivarCerrar()" color="green darken-1" text> 
                                        Cancelar
                                    </v-btn>
                                    <v-btn  v-if="adAccion==1" @click="activar()" color="orange darken-4" text> 
                                        Aceptar
                                    </v-btn>
                                    <v-btn  v-if="adAccion==2" @click="desactivar()" color="orange darken-4" text> 
                                        Desactivar
                                    </v-btn>                             
                                </v-card-actions>                
                            </v-card>
                        </v-dialog>
                        <v-dialog
                            v-model="comprobanteModal"
                            max-width="1000px"
                        >
                            <v-card>
                                   <v-card-title class="headline">
                                        <v-btn class="mr-3" @click="crearPDF()">
                                        <v-icon >print</v-icon>
                                        </v-btn>
                                        Reporte de Pedido
                                </v-card-title>
                                <v-card-text>
                                   <div id="cotizacion">
                                        <header>
                                            <div id="logo">
                                                <img src="data:image/png;base64,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" id="imagen">
                                            </div>
                                            <div id="datos">
                                                <p id="encabezado">
                                                    <b>Centro Médico - VidaPlus</b>
                                                    <br>Parcela 154, KM 8, Sector La Vara, Puerto Montt, Chile<br>Telefono: 65 2576195, 65 2576196<br>Email:contacto@ongbilav.cl
                                                </p>
                                            </div>
                                            <div id="fact">
                                                <p> PEDIDO DE ARTÍCULOS <br>
                                               <span> Número de Pedido: {{ num_cotizacion }} </span>
                                                <div v-if="fecha==null">
                                                    <span class="text--disabled">Nula</span>
                                                </div>
                                                <div v-else>
                                                   <span> Fecha de Pedido: {{ fecha.split('T').shift() }} </span>
                                                </div>
                                                </p>
                                            </div>
                                        </header>
                                        <br>
                                        <section>
                                            <div>
                                                <table id="facliente">
                                                    <tbody>
                                                        <tr>
                                                            <td id="cliente">
                                                                <strong>Para: {{proveedor.nombre}}</strong><br>
                                                                <strong>Rut:</strong> {{proveedor.rut}}<br>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>
                                        <br>
                                        <section>
                                            <div>
                                                <table id="facarticulo">
                                                    <thead>
                                                        <tr id="fa">
                                                            <th>Nombre</th>
                                                            <th>Cantidad</th>
                                                            <th>Tipo de Stock</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="det in detalles" :key="det._id">
                                                            <td style="text-align:center;">{{det.articulo}}</td>
                                                            <td style="text-align:center;">{{det.cantidad}}</td>
                                                            <td style="text-align:center;"> {{det.tipo_stock}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>
                                        <br>
                                        <br>
                                    </div>  

                                    
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn @click="ocultarComprobante()"  color="blue darken-1" text>Cancelar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:item.opciones="{ item }">
                    <v-icon
                    small
                    class="mr-2"
                    @click="verIngreso(item)"
                    >
                    tab
                    </v-icon>
                    <v-icon
                    small
                    class="mr-2"
                    @click="mostrarComprobante(item)"
                    >
                    print
                    </v-icon>
                    <template v-if="item.estado">
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(2,item)"
                        >
                        block
                        </v-icon>
                    </template>
                    <template v-else>
                        <v-icon
                        small
                        @click="activarDesactivarMostrar(1,item)"
                        >
                        check
                        </v-icon>
                    </template>
                </template>
                <template v-slot:item.createdAt="props">
                    {{ props.item.createdAt.split('T').shift() }}
                </template>
                <template v-slot:item.estado="{ item }">
                    <div v-if="item.estado === 1">
                        <span class="blue--text">Aceptado</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Anulado</span>
                    </div>
                </template>
                <template v-slot:no-data>
                    <v-btn color="primary" @click="listar()">Resetear</v-btn>
                </template>
            </v-data-table>

            <v-row wrap grid-list-sm class="pa-4 white" v-if="verNuevo" >
                <v-dialog v-model="dialog" max-width="1000px">
                    <v-card>
                        <v-card-title>
                            <span class="headline">Seleccione un artículo</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <v-text-field v-model="texto" @keyup.enter="listarArticulos()" class="justify-center" append-icon="search" label="Búsqueda"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                        <template>
                                            <v-data-table
                                            :headers="cabeceraArticulos"
                                            :items="articulos"
                                            class="elevation-1"
                                            >   
                                                <template v-slot:item.seleccionar="{ item }">
                                                    <v-icon
                                                        small
                                                        class="mr-2"
                                                        @click="agregarDetalle(item)"
                                                        >
                                                        add
                                                        </v-icon>       
                                                </template>
                                                <template v-slot:item.estado="{ item }">
                                                    <div v-if="item.estado === 1">
                                                        <span class="blue--text">Activo</span>
                                                    </div>
                                                    <div v-else>
                                                        <span class="red--text">Inactivo</span>
                                                    </div>
                                                </template>
                                            </v-data-table>
                                        </template>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                    <v-row
                    class="ml-3 mr-3"
                    >      
                        <v-col  xs="12" sm="2" md="2" lg="2" xl="2">
                               <v-text-field
                                v-model="'00'+Math.max.apply(Math, num_pedidos)"
                                disabled
                                label="Número de Pedido Anterior"
                                ></v-text-field>                            
                        </v-col>
                        <v-col xs="12" sm="4" md="4" lg="4" xl="4">
                            <v-text-field v-model="num_cotizacion" label="Número de Pedido"
                            ></v-text-field>
                        </v-col>
                        <v-col  xs="12" sm="4" md="4" lg="4" xl="4">
                            <v-autocomplete :items="proveedores" v-model="proveedor" label="Proveedor">
                            </v-autocomplete>
                        </v-col>
                        <v-col  xs="12" sm="8" md="8" lg="8" xl="8">
                            <v-text-field  v-model="codigo" label="Código" @keyup.enter="buscarCodigo()"  >
                            </v-text-field>
                        </v-col>
                        <v-col  xs="12" sm="2" md="2" lg="2" xl="2">
                            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
                                <v-icon dark>list</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col  xs="12" sm="2" md="2" lg="2" xl="2" v-show="errorArticulo">
                            <div class="red--text" v-text="errorArticulo">
                            </div>
                        </v-col>
                    </v-row>
                        <v-col  xs="12" sm="12" md="12" lg="12" xl="12">
                            <template>
                                <v-data-table
                                    :headers="cabeceraDetalles"
                                    :items="detalles"
                                    hide-default-footer
                                    class="elevation-1"
                                >
                                    <template v-slot:item.borrar="props">
                                        <v-icon
                                        small
                                        class="mr-2"
                                        @click="eliminarDetalle(detalles,props.item)"  
                                        >
                                        deleted</v-icon>
                                    </template>
                                    <template v-slot:item.cantidad="props">
                                        <v-text-field v-model="props.item.cantidad" type="number">
                                        </v-text-field>
                                    </template>
                                    <template v-slot:item.precio="props">
                                        <v-text-field v-model="props.item.precio" type="number">
                                        </v-text-field>
                                    </template>
                                    <template v-slot:item.subtotal="props">
                                        $ {{ props.item.cantidad * props.item.precio }}
                                    </template>
                                    <template slot="no-data">
                                        <h3>No hay artículos agregados al detalle</h3>
                                    </template> 
                                </v-data-table>
                                <v-row class="justify-end mt-3 mr-3">
                                    <strong>Total Parcial:</strong> 
                                    ${{totalParcial=(total).toFixed(2)}}
                                </v-row>
                                <v-row class="justify-end mr-3">
                                    <strong>Total Neto:</strong> ${{total=calcularTotal}}
                                </v-row>
                                
                            </template>
                        </v-col>
                        <v-col  xs="12" sm="12" md="12" lg="12" xl="12" >
                            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                        </v-col>
                        <v-btn color="blue darken-1" class="mr-4" text @click.native="ocultarNuevo()">Cancelar</v-btn>
                        <v-btn color="success" v-if="verDetalle==0" @click.native="guardar()">Guardar</v-btn>
            </v-row>
        </v-col>
    </v-row>
</template>


<script>
    import axios from 'axios'
    import jsPDF from 'jspdf';
    import html2canvas from 'html2canvas';
    export default {
        data (){
            return{
                dialog: false,
                search: '',
                cotizaciones: [],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Fecha de Pedido', value: 'createdAt', sortable: true },
                    { text: 'Número de Pedido', value: 'num_cotizacion', sortable: false },
                    { text: 'Proveedor', value: 'proveedor.nombre', sortable: true },
                    { text: 'Creador del Pedido', value: 'usuario.nombre', sortable: false },
                    { text: 'Valor Total del Pedido', value: 'total', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false }
                ],
                _id:'',
                //CAMBIO
                proveedor:'',
                proveedores:[],
                num_pedidos:[],
                // FIN CAMBIO
                num_cotizacion:'',
                codigo:'',
                cabeceraDetalles: [
                    {text: 'Borrar', value: 'borrar', sortable: false},
                    {text: 'Artículo', value: 'articulo', sortable: false},
                    {text: 'Tipo de Cantidad', value: 'tipo_stock', sortable: false},
                    {text: 'Cantidad', value: 'cantidad', sortable: false},
                    {text: 'Precio', value: 'precio', sortable: false},
                    {text: 'Subtotal', value: 'subtotal', sortable: false},
                ],
                verDetalle:0,
                verNuevo:0,
                errorArticulo: null,
                total:0,
                totalParcial:0,
                //totalImpuesto:0,
                articulos:[],
                texto:'',
                cabeceraArticulos: [
                    { text: 'Seleccionar', value: 'seleccionar', sortable: false },
                    { text: 'Código', value: 'codigo', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: true },
                    { text: 'Categoría', value: 'categoria.nombre', sortable: true },
                    { text: 'Stock', value: 'stock', sortable: false },
                    { text: 'Tipo Stock', value: 'tipo_stock', sortable: false },
                    { text: 'Precio', value: 'precio', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false },
                ],
                detalles: [],
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
                comprobanteModal:0,
                fecha:null,
            }
        },
        computed: {
            calcularTotal: function(){
                let resultado=0.0;
                for(var i=0; i<this.detalles.length;i++){
                    resultado=resultado+(this.detalles[i].cantidad*this.detalles[i].precio);
                }
                return resultado;
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            },
        },

        created () {
            this.listar();
            this.selectProveedores();
            this.selectNumeroPedido();
        },

        methods: {
            crearPDF(){
                var quotes = document.getElementById('cotizacion');
                html2canvas(quotes).then(function (canvas) {
                    var imgData = canvas.toDataURL('image/png');
                    var imgWidth = 210;
                    var pageHeight = 295;

                    var imgHeight = canvas.height * imgWidth / canvas.width;
                    var heightLeft = imgHeight;
                    
                    var doc = new jsPDF('p', 'mm', 'a4');
                    var position = 0;

                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        doc.addPage();
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }
                    doc.save('ComprobanteCotizacion.pdf');
                });
            },
            mostrarComprobante(item){
                this.limpiar();
                this.num_cotizacion=item.num_cotizacion;
                this.proveedor=item.proveedor;
                this.fecha=item.createdAt;
                this.listarDetalles(item._id);
                this.comprobanteModal=1;
            },
            ocultarComprobante(item){
                this.comprobanteModal=0;
            },
            selectProveedores(){
                let me = this;
                let proveedorArray = [];
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('proveedor/list', configuracion ).then(function(response){
                    proveedorArray = response.data;
                    proveedorArray.map(function(x){
                        me.proveedores.push({text:x.nombre, value:x._id})
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.proveedor){
                    this.validaMensaje.push('Seleccione un proveedor.');
                }
                if(!this.num_cotizacion){
                    this.validaMensaje.push('Ingrese el número de cotizacion.');
                }
                if(this.detalles.length<=0){
                    this.validaMensaje.push('Ingrese al menos un artículo al detalle');
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida; 

            },
            buscarCodigo(){
                let me = this;
                me.errorArticulo=null;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('articulo/queryCodigo?codigo='+this.codigo, configuracion ).then(function(response){
                    me.agregarDetalle(response.data)
                }).catch(function(error){
                    me.errorArticulo='No existe el Artículo.'
                })
            },
            agregarDetalle(data){
                this.errorArticulo=null;
                if (this.encuentra(data._id)==true){
                    this.errorArticulo='El artículo ya ha sido agregado.';
                } else {
                    this.detalles.push(
                    {
                        _id:data._id,
                        articulo:data.nombre,
                        cantidad:1,
                        precio:data.precio,
                        tipo_stock:data.tipo_stock
                    }
                );
                this.codigo='';
                }
            },
            encuentra(id){
                let sw=0;
                for (var i=0; i<this.detalles.length;i++){
                    if(this.detalles[i]._id==id){
                        sw=true;
                    }
                }
                return sw;
            },
            eliminarDetalle(arr,item){
                let i = arr.indexOf(item)
                if(i!= -1){
                    arr.splice(i,1);
                }
            },
            listarArticulos(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('articulo/list?search='+this.texto, configuracion ).then(function(response){
                    me.articulos = response.data;
                }).catch(function(error){
                    console.log(error);
                })
            },
             mostrarModalArticulos(){
                this.dialog=1;
            },
            listarDetalles(id){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('cotiza/query?_id='+id, configuracion ).then(function(response){
                    me.detalles = response.data.detalles;
                }).catch(function(error){
                    console.log(error);
                })
            },
            verIngreso(item){
                this.limpiar();
                this.num_cotizacion=item.num_cotizacion;
                this.proveedor=item.proveedor._id;
                this.listarDetalles(item._id);
                this.verNuevo=1;
                this.verDetalle=1;
            },
            selectNumeroPedido(){
                let me = this;
                let numeroCotizacionArray = [];
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('cotiza/list', configuracion ).then(function(response){
                    numeroCotizacionArray  = response.data;
                    numeroCotizacionArray.map(function(x){
                        me.num_pedidos.push(parseInt(x.num_cotizacion))
                    });
                }).catch(function(error){
                    console.log(error);
                });
            },
            listar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('cotiza/list', configuracion).then(function(response){
                    me.cotizaciones = response.data;
                }).catch(function(error){
                    console.log(error);
                })
            },
            limpiar(){
                this._id='';
                this.proveedor='';
                this.num_cotizacion='';
                this.codigo='';
                this.total=0;
                this.totalParcial=0;
                this.detalles=[];
                this.verNuevo=0;
                this.valida=0;
                this.validaMensaje=[];
                this.verDetalle=0;
                this.errorArticulo=null;
            },
            mostrarNuevo(){
                this.verNuevo=1;
            },
            ocultarNuevo(){
                this.verNuevo=0;
                this.limpiar();
            },
            guardar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                if(this.validar()){
                    return;
                }
                //Código para guardar un ingreso
                axios.post('cotiza/add', {
                    'proveedor':this.proveedor,
                    'usuario':this.$store.state.usuario._id,
                    'num_cotizacion':this.num_cotizacion,
                    'total':this.total,
                    'detalles':this.detalles
                    }, configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    }).catch(function(error){
                        console.log(error);
                    });
            },
            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre= item.nombre;
                this.adId=item._id;
                if(accion==1){
                    this.adAccion=1;
                } else if (accion==2) {
                    this.adAccion=2;
                } else {
                    this.adModal=0;
                }
            },

            activarDesactivarCerrar(){
                this.adModal=0;
            },

            activar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.put('cotiza/activate', {'_id':this.adId}, configuracion)
                .then(function(response){
                    me.adModal=0,
                    me.adAccion=0,
                    me.adNombre='',
                    me.adId='',
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                }); 
            },

            desactivar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.put('cotiza/desactivate', {'_id':this.adId}, configuracion)
                .then(function(response){
                    me.adModal=0,
                    me.adAccion=0,
                    me.adNombre='',
                    me.adId='',
                    me.listar();
                }).catch(function(error){
                    console.log(error);
                }); 
            },

            close () {
                this.dialog = false
            },
        }
    }
</script>
<style>
#cotizacion {
    padding: 20px;
    font-family: Arial, sans-serif;
    font-size: 16px ;
}

#logo {
   
    margin-left: 20%;
    margin-right: 2%;
}
#imagen {
    width: 100px;
}

#fact {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
}   

#datos {
    float: left;
    margin-top: 0%;
    margin-left: 2%;
    margin-right: 2%;
    /*text-align: justify;*/
}

#encabezado {
    text-align: center;
    margin-left: 10px;
    margin-right: 10px;
    font-size: 16px;
}

section {
    clear: left;
}

#cliente {
    text-align: left;
}

#facliente {
    width: 40%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 15px;
}

#fa {
    color: #FFFFFF;
    font-size: 14px;
}

#facarticulo {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    padding: 20px;
    margin-bottom: 15px;
}

#facarticulo thead {
    padding: 20px;
    background: #2183E3;
    text-align: center;
    border-bottom: 1px solid #FFFFFF;
}

#gracias {
    text-align: center;
}
</style>