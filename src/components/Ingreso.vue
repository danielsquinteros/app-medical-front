<template>
    <v-row>
        <v-col>
            <v-data-table
            :headers="headers"
            :items="ingresos"
            :search="search"
            sort-by="calories"
            class="elevation-1"
            border-radius="0px"
            v-if="verNuevo==0"
            >
                <template v-slot:top>
                    <v-toolbar flat color="white">
                    <v-toolbar-title>Ingresos de Artículos</v-toolbar-title>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field  v-if="verNuevo==0"class="text-xs-center" v-model="search" append-icon="search" label="Buscar Ingreso" single-line hide-details ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" v-if="verNuevo ==0" @click="mostrarNuevo()">Agregar Artículos</v-btn>
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
                            <v-btn color="red" text @click="close">Cancelar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                    <v-row
                    class="ml-3 mr-3"
                    >
                        <v-col xs="12" sm="6" md="6" lg="6" xl="6">
                            <v-select
                                :items="comprobantes"
                                v-model="tipo_comprobante"
                                label="Tipo Comprobante"
                            ></v-select>
                        </v-col>
                        <v-col xs="12" sm="6" md="6" lg="6" xl="6">
                            <v-text-field v-model="num_comprobante" label="Número Comprobante"
                            ></v-text-field>
                        </v-col>
                        <v-col  xs="12" sm="8" md="8" lg="8" xl="8">
                            <v-autocomplete :items="proveedores" v-model="proveedor" label="Proveedor">
                            </v-autocomplete>
                        </v-col>
                        <v-col  xs="12" sm="4" md="4" lg="4" xl="4">
                            <v-text-field type="number" v-model="impuesto" label="Impuesto">
                            </v-text-field>
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
                                    ${{totalParcial=(total-totalImpuesto).toFixed(2)}}
                                </v-row>
                                <v-row class="justify-end mr-3">
                                    <strong>Total Impuesto:</strong> 
                                    ${{totalImpuesto=((total*impuesto)/(1+impuesto)).toFixed(2)}}
                                </v-row>
                                <v-row class="justify-end mr-3">
                                    <strong>Total Neto:</strong> ${{total=calcularTotal}}
                                </v-row>
                                
                            </template>
                        </v-col>
                        <v-col  xs="12" sm="12" md="12" lg="12" xl="12" >
                            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v"></div>
                        </v-col>
                        <v-btn color="red" class="mr-4" text @click.native="ocultarNuevo()">Cancelar</v-btn>
                        <v-btn color="success" v-if="verDetalle==0" @click.native="guardar()">Guardar</v-btn>
            </v-row>
        </v-col>
    </v-row>
</template>


<script>
    import axios from 'axios'
    export default {
        data (){
            return{
                dialog: false,
                search: '',
                ingresos: [],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Usuario', value: 'usuario.nombre', sortable: false },
                    { text: 'Proveedor', value: 'proveedor.nombre', sortable: true },
                    { text: 'Tipo Comprobante', value: 'tipo_comprobante', sortable: true },
                    { text: 'Número comprobante', value: 'num_comprobante', sortable: false },
                    { text: 'Fecha de Ingreso', value: 'createdAt', sortable: true },
                    { text: 'Impuesto', value: 'impuesto', sortable: false },
                    { text: 'Total', value: 'total', sortable: false },
                    { text: 'Estado', value: 'estado', sortable: false }
                ],
                _id:'',
                //CAMBIO
                proveedor:'',
                proveedores:[],
                tipo_comprobante:'',
                comprobantes:['BOLETA','FACTURA'],
                // FIN CAMBIO
                num_comprobante:'',
                impuesto:0.18,
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
                totalImpuesto:0,
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
        },

        methods: {
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
                if(!this.tipo_comprobante){
                    this.validaMensaje.push('Seleccione un tipo de comprobante.');
                }
                if(!this.num_comprobante){
                    this.validaMensaje.push('Ingrese el número del comprobante.');
                }
                if(!this.impuesto || this.impuesto<0 || this.impuesto>1){
                    this.validaMensaje.push('Ingrese un impuesto válido.');
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
                data.precio=0;
                this.errorArticulo=null;
                if (this.encuentra(data._id)==true){
                    this.errorArticulo='El artículo ya ha sido agregado.';
                } else {
                    this.detalles.push(
                    {
                        _id:data._id,
                        articulo:data.nombre,
                        cantidad:1,
                        precio:data.precio_venta,
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
                    console.log(me.articulos);
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
                axios.get('ingreso/query?_id='+id, configuracion ).then(function(response){
                    me.detalles = response.data.detalles;
                }).catch(function(error){
                    console.log(error);
                })
            },
            verIngreso(item){
                this.limpiar();
                this.tipo_comprobante=item.tipo_comprobante;
                this.num_comprobante=item.num_comprobante;
                this.proveedor=item.proveedor._id;
                this.impuesto=item.impuesto;
                this.listarDetalles(item._id);
                this.verNuevo=1;
                this.verDetalle=1;
            },
            listar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('ingreso/list', configuracion).then(function(response){
                    me.ingresos = response.data;
                }).catch(function(error){
                    console.log(error);
                })
            },
            limpiar(){
                this._id='';
                this.proveedor='';
                this.tipo_comprobante='';
                this.num_comprobante='';
                this.impuesto=0.18;
                this.codigo='';
                this.total=0;
                this.totalParcial=0;
                this.totalImpuesto=0;
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
                axios.post('ingreso/add', {
                    'proveedor':this.proveedor,
                    'usuario':this.$store.state.usuario._id,
                    'tipo_comprobante': this.tipo_comprobante,
                    'num_comprobante':this.num_comprobante,
                    'impuesto': this.impuesto,
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
                axios.put('ingreso/activate', {'_id':this.adId}, configuracion)
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
                axios.put('ingreso/desactivate', {'_id':this.adId}, configuracion)
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