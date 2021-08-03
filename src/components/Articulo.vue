<template>
    <v-row>
        <v-col>
            <v-data-table
            :headers="headers"
            :items="articulos"
            :search="search"
            sort-by="calories"
            class="elevation-1"
            >      
      
            <template v-slot:top>
                <v-toolbar text class="elevation-0" color="white">
                <template>
                    <div class="text-center">
                        <v-menu
                        :close-on-content-click="false"
                        :nudge-width="200"
                        offset-x
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                            color="primary"
                            elevation="0"
                            v-bind="attrs"
                            v-on="on"
                            outlined
                            >
                            <v-icon
                              color="primary">
                                print
                            </v-icon>
                            <v-spacer
                                class="mx-1"
                            ></v-spacer>
                            Imprimir Artículos
                            </v-btn>
                        </template>

                        <v-card>
                            <v-list>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-btn class="mr-5 elevation-2" text color="green" @click="crearPDF()">
                                            <v-icon>
                                            print
                                            </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-title> Total Artículos</v-list-item-title>
                                </v-list-item>

                                <v-list-item>
                                    <v-list-item-action>
                                    <v-btn class="mr-5 elevation-2" text color="blue-grey darken-2" @click="crearVencimientoPDF()">
                                        <v-icon>
                                        print
                                        </v-icon>
                                    </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-title> Artículos con Fecha de Vencimiento</v-list-item-title>
                                </v-list-item>
                                <v-list-item>
                                        <v-list-item-action>
                                            <v-btn class="mr-5 elevation-2" text color="red lighten-1" @click="crearInactivoPDF()">
                                                <v-icon>
                                                print
                                                </v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                        <v-list-item-title>Artículos Inactivos</v-list-item-title>
                                </v-list-item>
                                 <v-list-item>
                                        <v-list-item-action>
                                            <v-btn class="mr-5 elevation-2" text color="orange" @click="crearPorCorroborarPDF()">
                                                <v-icon>
                                                print
                                                </v-icon>
                                            </v-btn>
                                        </v-list-item-action>
                                        <v-list-item-title>Artículos Por Corroborar</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-card>
                        </v-menu>
                    </div>
                </template>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Buscar Artículos" single-line hide-details ></v-text-field>
                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="600px">
                  
                    <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo Artículo</v-btn>
                    </template>
                    <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="7"> 
                                <v-select
                                    :items="tipos_de_articulos"
                                    v-model="tipo_articulo"
                                    label="Tipo de Artículo"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                                <v-text-field v-model="codigo" label="Código"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="" md="7">
                                <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="4" md="5">
                                <v-select
                                    :items="categorias"
                                    v-model="categoria"
                                    label="Categoría"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                            <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="7"> 
                                <v-select
                                    :items="tipos_de_stocks"
                                    v-model="tipo_stock"
                                    label="Tipo de Stock"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="5">
                                <v-text-field type="number" v-model="precio" label="Precio del Artículo"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="7">
                            <v-text-field v-model="marca" label="Marca del Artículo"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                            <v-text-field
                                v-model="fechaVencimiento"
                                label="Fecha Vencimiento"
                                hint="YYYY-MM-DD (Formato)"
                                persistent-hint
                                prepend-icon="event"
                            ></v-text-field>
                            </v-col>
                             <v-col cols="12" sm="12" md="12" v-show="valida">
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                </div>
                            </v-col>
                        </v-row>
                        </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click="close">Cancelar</v-btn>
                        <v-btn color="success" text @click="guardar">Guardar</v-btn>
                    </v-card-actions>
                    </v-card>
                    
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">
                            Activar Item
                        </v-card-title>
                         <v-card-title class="headline" v-if="adAccion==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-title class="headline" v-if="adAccion==3">
                            Prorrogar Item
                        </v-card-title>
                        <v-card-text>
                            Estás a punto de 
                            <span v-if="adAccion==1">activar</span>
                            <span v-if="adAccion==2">desactivar</span> 
                            <span v-if="adAccion==3">prorrogar</span> 
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
                            <v-btn  v-if="adAccion==3" @click="pendiente()" color="orange darken-4" text> 
                                Pendiente
                            </v-btn>                                  
                        </v-card-actions>                
                    </v-card>
                </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:item.fechaVencimiento="props">
                <div v-if="props.item.fechaVencimiento==null">
                    <span class="text--disabled">Nula</span>
                </div>
                <div v-else>
 
                    <span>  {{props.item.fechaVencimiento.split('T').shift()}},  {{ fechaVencimiento1(props.item.fechaVencimiento.split('T').shift()) }}  días </span> 
            
                        </div>
            </template>



            <template v-slot:item.opciones="{ item }" wrap>
                <v-icon
                small
                @click="editItem(item)"
                >
                edit
                </v-icon>
                <template v-if="item.estado == 1">
                    <v-icon class="ml-5 mr-1"
                    small
                    @click="activarDesactivarMostrar(3,item)"
                    >
                    waves
                    </v-icon>
                    <v-icon class="mr-5"
                    small
                    @click="activarDesactivarMostrar(2,item)"
                    >
                    block
                    </v-icon>
                </template>
                <template v-if="item.estado == 0">
                    <v-icon class="ml-5 mr-1"
                    small
                    @click="activarDesactivarMostrar(1,item)"
                    >
                    check
                    </v-icon>
                     <v-icon class="mr-5"
                    small
                    @click="activarDesactivarMostrar(3,item)"
                    >
                    waves
                    </v-icon>
                </template>
                <template v-if="item.estado == 2">
                    <v-icon class="ml-5 mr-1"
                    small
                    @click="activarDesactivarMostrar(1,item)"
                    >
                    check
                    </v-icon>
                    <v-icon class="mr-5"
                    small
                    @click="activarDesactivarMostrar(2,item)"
                    >
                    block
                    </v-icon>
                </template>
            </template>
            <template v-slot:item.estado="{ item }">
                <div v-if="item.estado === 1">
                    <span class="green--text">Activo</span>
                </div>
                <div v-else-if="item.estado === 0">
                    <span class="red--text">Inactivo</span>
                </div>
                <div v-else-if="item.estado === 2">
                    <span class="orange--text">Por corroborar</span>
                </div>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" @click="listar()">Resetear</v-btn>
            </template>
            </v-data-table>
        </v-col>
    </v-row>
</template>


<script>
    import axios from 'axios'
    import jsPDF from 'jspdf'
    import autoTable from 'jspdf-autotable'
    import moment from 'moment'
    export default {
        data (){
            return{
                dialog: false,
                search: '',
                articulos: [],
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'Tipo de Artículo', value: 'tipo_articulo', sortable: true },
                    { text: 'Categoría', value: 'categoria.nombre', sortable: true },
                    { text: 'Código', value: 'codigo', sortable: false },
                    { text: 'Nombre', value: 'nombre', sortable: false },
                    { text: 'Stock', value: 'stock', sortable: false },
                    { text: 'Tipo de Stock', value: 'tipo_stock', sortable: false },
                   /* { text: 'Marca', value: 'marca', sortable: true },
                    { text: 'Precio', value: 'precio', sortable: false }, */
                    { text: 'Dias de Vencimiento', value: 'fechaVencimiento', sortable: true },
                    { text: 'Estado', value: 'estado', sortable: true },
                ],
                editedIndex: -1,
                _id:'',
                categoria:'',
                categorias:[],
                codigo:'',
                nombre:'',
                marca:'',
                tipo_articulo:'',
                tipos_de_articulos:['Insumos', 'Material', 'Equipo'],
                stock:0,
                tipo_stock:'',
                tipos_de_stocks:['Unidad', 'Cajas', 'Bidon','Kit','Paquete','Frasco','Bolsa'],
                precio:'',
                fechaVencimiento:'',
                valida:0,
                validaMensaje:[],
                adModal:0,
                adAccion:0,
                adNombre:'',
                adId:'',
            }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Artículo' : 'Editar Artículo'
            }
        },

        watch: {
            dialog (val) {
            val || this.close()
            }
        },

        created () {
            this.listar();
            this.selectCategorias();
            this.fechaVencimiento1();
        },

        methods: {
            fechaVencimiento1(fecha_test){
                const NowMoment = moment().format("YYYY-MM-DD");
                const DiasRestantes = moment(`'${fecha_test}'`).diff(NowMoment, 'days');
                return DiasRestantes
            },

            crearPDF(){
                    var columns = [
                        {title: "Categoría", dataKey: "categoria"},
                        {title: "Nombre", dataKey: "nombre"},
                        {title: "Código", dataKey: "codigo"},
                        {title: "Stock", dataKey: "stock"},
                        {title: "Tipo de Stock", dataKey: "tipo_stock"},
                    ];
                    var rows = [];
                    this.articulos.map(function(x){
                        rows.push(
                            {
                                nombre:x.nombre,
                                codigo:x.codigo,
                                categoria:x.categoria.nombre,
                                stock:x.stock,
                                tipo_stock:x.tipo_stock                    
                            }
                        );
                    });
                    const NowMomentTitulo = moment().format("YYYY-MM-DD");
                    var doc = new jsPDF('p','pt');
                    doc.autoTable(columns,rows,{
                        margin: {top: 60},
                        didDrawPage: function(data){
                            doc.text(`Total de Artículos, al día ${NowMomentTitulo}`,40,30);
                        },
                    });
                    doc.save(`Total de Artículos, al día ${NowMomentTitulo}.pdf`)
            },
            crearVencimientoPDF(){
                    var columns = [
                        {title: "Nombre", dataKey: "nombre"},
                        {title: "Stock", dataKey: "stock"},
                        {title: "Tipo de Stock", dataKey: "tipo_stock"},
                        {title: "Fecha de Vencimiento", dataKey: "fecha_vencimiento"},
                        {title: "Dias restantes", dataKey: "dias_restantes"},
                    ];
                    var rows = [];
                    this.articulos.map(function(x){
                        if(x.fechaVencimiento !== null){
                            const fechaVencimientoNormalizada = x.fechaVencimiento.split('T').shift()
                            const NowMoment = moment().format("YYYY-MM-DD"); 
                            const DiasRestantes = moment(`'${fechaVencimientoNormalizada}'`).diff(NowMoment, 'days');
                            rows.push(
                                {
                                    nombre:x.nombre,
                                    stock:x.stock,
                                    tipo_stock:x.tipo_stock,
                                    fecha_vencimiento:fechaVencimientoNormalizada,
                                    dias_restantes:DiasRestantes,
                                                       
                                }
                            );
                            
                        }
                    });
                    const NowMomentTitulo = moment().format("YYYY-MM-DD");
                    var doc = new jsPDF('p','pt');
                    doc.autoTable(columns,rows,{
                        margin: {top: 60},
                        didDrawPage: function(data){
                            doc.text(`Lista de Artículos con fecha de vencimiento, al día ${NowMomentTitulo}`,40,30);
                        },
                    });
                    doc.save(`Artículos, con fecha de vencimiento al día ${NowMomentTitulo}.pdf`)
            },
            crearInactivoPDF(){
                var columns = [
                    {title: "Nombre", dataKey: "nombre"},
                    {title: "Stock", dataKey: "stock"},
                    {title: "Tipo de Stock", dataKey: "tipo_stock"},
                    {title: "Fecha de Vencimiento", dataKey: "fecha_vencimiento"},
                /*    {title: "Dias restantes", dataKey: "dias_restantes"}, */
                    {title: "Estado", dataKey: "estado"},
                ];
                var rows = [];
                this.articulos.map(function(x){
                    if(x.estado === 0){
                        let fechaVencimientoNormalizada = ''

                        if(x.fechaVencimiento == null ) {
                            fechaVencimientoNormalizada = 'Sin fecha de vencimiento'

                        } else {
                            fechaVencimientoNormalizada = x.fechaVencimiento.split('T').shift()
                        }
                        const NowMoment = moment().format("YYYY-MM-DD"); 
                        const DiasRestantes = moment(`'${fechaVencimientoNormalizada}'`).diff(NowMoment, 'days');
                        rows.push(
                            {
                                nombre:x.nombre,
                                stock:x.stock,
                                tipo_stock:x.tipo_stock,
                                fecha_vencimiento:fechaVencimientoNormalizada,
                                /*dias_restantes:DiasRestantes,*/
                                estado:'Inactivo',
                                                    
                            }
                        );
                        
                    }
                });
                const NowMomentTitulo = moment().format("YYYY-MM-DD");
                var doc = new jsPDF('p','pt');
                doc.autoTable(columns,rows,{
                    margin: {top: 40},
                    columnWidth: 'wrap',
                    didDrawPage: function(data){
                        doc.text(`Lista de Artículos Inactivos, al día ${NowMomentTitulo}`,40,30);
                    },
                });
                doc.save(`Artículos Inactivos al día ${NowMomentTitulo}.pdf`)
            },
            crearPorCorroborarPDF(){
                var columns = [
                    {title: "Nombre", dataKey: "nombre"},
                    {title: "Stock", dataKey: "stock"},
                    {title: "Tipo de Stock", dataKey: "tipo_stock"},
                    {title: "Fecha de Vencimiento", dataKey: "fecha_vencimiento"},
                /*    {title: "Dias restantes", dataKey: "dias_restantes"}, */
                    {title: "Estado", dataKey: "estado"},
                ];
                var rows = [];
                this.articulos.map(function(x){
                    if(x.estado === 2){
                        let fechaVencimientoNormalizada = ''
                        if(x.fechaVencimiento == null ) {
                            fechaVencimientoNormalizada = 'Sin fecha de vencimiento'

                        } else {
                            fechaVencimientoNormalizada = x.fechaVencimiento.split('T').shift()
                        }
                        const NowMoment = moment().format("YYYY-MM-DD"); 
                        const DiasRestantes = moment(`'${fechaVencimientoNormalizada}'`).diff(NowMoment, 'days');
                        rows.push(
                            {
                                nombre:x.nombre,
                                stock:x.stock,
                                tipo_stock:x.tipo_stock,
                                fecha_vencimiento:fechaVencimientoNormalizada,
                                /*dias_restantes:DiasRestantes,*/
                                estado:'Por Corroborar',
                                                    
                            }
                        );
                        
                    }
                });
                const NowMomentTitulo = moment().format("YYYY-MM-DD");
                var doc = new jsPDF('p','pt');
                doc.autoTable(columns,rows,{
                    margin: {top: 40},
                    columnWidth: 'wrap',
                    didDrawPage: function(data){
                        doc.text(`Lista de Artículos Por Corroborar, al día ${NowMomentTitulo}`,40,30);
                    },
                });
                doc.save(`Artículos Por Corroborar al día ${NowMomentTitulo}.pdf`)
            },
            selectCategorias(){
                let me = this;
                let categoriaArray = [];
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('categoria/list', configuracion ).then(function(response){
                    categoriaArray = response.data;
                    categoriaArray.map(function(x){
                        me.categorias.push({text:x.nombre, value:x._id})
                    });
                }).catch(function(error){
                    console.log(error);
                })
            },
            validar(){
                this.valida=0;
                this.validaMensaje=[];
                if(!this.categoria){
                    this.validaMensaje.push('Seleccione una categoría')
                }
                if(!this.codigo){
                    this.validaMensaje.push('Ingrese un código')
                } else if(this.codigo.length > 64){
                     this.validaMensaje.push('El código no debe tener más de 64 caracteres.')
                }
                if(this.nombre.length < 1 || this.nombre.length > 50){
                    this.validaMensaje.push('El nombre del artículo debe tener entre 1-50 caracteres.')
                }
                if(!this.tipo_articulo){
                    this.validaMensaje.push('Ingrese un tipo de artículo valido.')
                }
                if(this.stock<0){
                    this.validaMensaje.push('Ingrese un stock valido.')
                }
                if(!this.tipo_stock){
                    this.validaMensaje.push('Ingrese un tipo de stock valido.')
                }
                if(this.validaMensaje.length){
                    this.valida=1;
                }
                return this.valida; 

            },
            listar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.get('articulo/list', configuracion ).then(function(response){
                    me.articulos = response.data;
                }).catch(function(error){
                    console.log(error);
                })
            },
            limpiar(){
                this._id='';
                this.categoria = '';
                this.codigo = '';
                this.nombre = '';
                this.stock = '';
                this.tipo_stock = '';
                this.tipo_articulo = '';
                this.fechaVencimiento = '';
                this.precio = '';
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=1;
            },
            guardar(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                if(this.validar()){
                    return;
                }
                if(this.editedIndex > -1){
                    //Código para editar una categoría
                    axios.put('articulo/update', {
                        '_id':this._id,
                        'nombre':this.nombre,
                        'categoria':this.categoria,
                        'codigo':this.codigo,
                        'marca':this.marca,
                        'stock':this.stock,
                        'tipo_stock':this.tipo_stock,
                        'tipo_articulo':this.tipo_articulo,
                        'precio':this.precio,
                        'fechaVencimiento':this.fechaVencimiento,
                        }, configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                    }).catch(function(error){
                        console.log(error);
                    });


                } else {
                    //Código para guardar una categoría
                    axios.post('articulo/add', {
                        'nombre':this.nombre,
                        'categoria':this.categoria,
                        'codigo':this.codigo,
                        'marca':this.marca,
                        'stock':this.stock,
                        'tipo_stock':this.tipo_stock,
                        'tipo_articulo':this.tipo_articulo,
                        'precio':this.precio,
                        'fechaVencimiento':this.fechaVencimiento,
                        }, configuracion)
                    .then(function(response){
                        me.limpiar();
                        me.close();
                        me.listar();
                        
                    }).catch(function(error){
                        console.log('ERROR', error);
                    });

                }

            },
            editItem (item) {
                this._id = item._id;
                this.categoria = item.categoria._id;
                this.codigo = item.codigo;
                this.nombre = item.nombre;
                this.stock = item.stock;
                this.tipo_stock = item.tipo_stock;
                this.tipo_articulo = item.tipo_articulo;
                this.fechaVencimiento = item.fechaVencimiento;
                this.precio = item.precio;
                this.marca = item.marca;
                this.dialog = true;
                this.editedIndex = 1;
            },

            activarDesactivarMostrar(accion,item){
                this.adModal=1;
                this.adNombre= item.nombre;
                this.adId=item._id;
                if(accion==1){
                    this.adAccion=1;
                } else if (accion==2) {
                    this.adAccion=2;
                } else if (accion==3) {
                    this.adAccion=3;
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
                axios.put('articulo/activate', {'_id':this.adId}, configuracion)
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
                axios.put('articulo/desactivate', {'_id':this.adId}, configuracion)
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
            pendiente(){
                let me = this;
                let header = { "token": this.$store.state.token};
                let configuracion = { headers: header };
                axios.put('articulo/pending', {'_id':this.adId}, configuracion)
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
                this.dialog = false;
                this._id='';
                this.categoria = '';
                this.codigo = '';
                this.nombre = '';
                this.stock = '';
                this.tipo_stock = '';
                this.tipo_articulo = '';
                this.fechaVencimiento = '';
                this.precio = '';
                this.valida=0;
                this.validaMensaje=[];
                this.editedIndex=-1;
            },
        },
    }
</script>