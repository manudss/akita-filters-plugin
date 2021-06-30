(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{oste:function(e,t,i){"use strict";i.r(t),i.d(t,"ProductsFiltersModule",function(){return S});var c=i("ofXK"),r=i("SZEV"),o=i("nGlz"),s=i("fXoL"),l=i("3Pt+"),n=i("XNiG"),a=i("1G5W");function b(e){return"function"==typeof e}const u=(e,t="ngOnDestroy")=>i=>{const c=e[t];if(!1===b(c))throw new Error(`${e.constructor.name} is using untilDestroyed but doesn't implement ${t}`);return e.__takeUntilDestroy||(e.__takeUntilDestroy=new n.a,e[t]=function(){b(c)&&c.apply(this,arguments),e.__takeUntilDestroy.next(!0),e.__takeUntilDestroy.complete()}),i.pipe(Object(a.a)(e.__takeUntilDestroy))};var p=i("m1PQ");function d(e,t){if(1&e){const e=s.Vb();s.Ub(0,"div",41),s.cc("click",function(){s.rc(e);const i=t.$implicit;return s.gc(2).removeFilter(i.id)}),s.xc(1),s.Ub(2,"i",42),s.xc(3,"close"),s.Tb(),s.Tb()}if(2&e){const e=t.$implicit;s.Db(1),s.zc(" ",e.name," ")}}function f(e,t){if(1&e){const e=s.Vb();s.Ub(0,"div"),s.xc(1," Filter : "),s.vc(2,d,4,1,"div",39),s.hc(3,"async"),s.Ub(4,"a",40),s.cc("click",function(){return s.rc(e),s.gc().removeFilterAll()}),s.xc(5,"remove all"),s.Tb(),s.Tb()}if(2&e){const e=s.gc();s.Db(2),s.mc("ngForOf",s.ic(3,1,e.filters$))}}let v=(()=>{class e{constructor(e){this.productsService=e,this.filtersForm=new l.f({search:new l.d,sortControl:new l.d("+title"),categoryControl:new l.d,size:new l.d,fastDeliveryControl:new l.d}),this.filterFastDelivery=!1,this.nbRefresh=0}ngOnInit(){this.setInitialFilters(),this.filtersForm.controls.search.valueChanges.pipe(u(this)).subscribe(e=>{e?this.productsService.setFilter({id:"search",value:e,order:20,name:`" ${e} "`,predicate:t=>Object(p.c)(e,t)}):this.productsService.removeFilter("search")}),this.filtersForm.controls.categoryControl.valueChanges.pipe(u(this)).subscribe(e=>{this.productsService.setFilter({id:"category",value:e,predicate:t=>t.category===e})}),this.filtersForm.controls.sortControl.valueChanges.pipe(u(this)).subscribe(e=>{this.productsService.setOrderBy(e.slice(1),e.slice(0,1))}),this.filtersForm.controls.sortControl.setValue(this.productsService.getSortValue()),this.filterFastDelivery=this.productsService.getFilterValue("fastDelivery"),this.filters$=this.productsService.selectFilters()}setInitialFilters(){this.filtersForm.setValue({search:this.productsService.getFilterValue("search"),sortControl:this.productsService.getSortValue(),categoryControl:this.productsService.getFilterValue("category"),size:this.productsService.getFilterValue("size"),fastDeliveryControl:this.productsService.getFilterValue("fastDelivery")},{emitEvent:!1})}getNormalizedFilters(){console.log(this.productsService.filtersProduct.getNormalizedFilters({withSort:!0,asQueryParams:!0}))}filterSize(e){this.productsService.setFilter({id:"size",name:`${e} size`,value:e,predicate:t=>t.size===e})}changeFastDelivery(){this.filterFastDelivery=!this.filterFastDelivery,this.filterFastDelivery?this.productsService.setFilter({id:"fastDelivery",name:"Only fast Delivery",value:this.filterFastDelivery,order:1,predicate:e=>e.rapidDelivery}):this.removeFilter("fastDelivery")}removeFilter(e){this.productsService.removeFilter(e),this.setInitialFilters()}removeFilterAll(){this.productsService.removeAllFilter(),this.setInitialFilters()}ngOnDestroy(){}refresh(){this.nbRefresh=this.productsService.filtersProduct.refresh()}}return e.\u0275fac=function(t){return new(t||e)(s.Ob(r.b))},e.\u0275cmp=s.Ib({type:e,selectors:[["app-filters-form"]],decls:92,vars:5,consts:[[1,"row",3,"formGroup"],[1,"col","m2","s6"],[1,"input-field","col","s12"],["formControlName","categoryControl",1,"browser-default"],["value","","disabled","","selected",""],["value","Interior"],["value","Garden"],["value","Balcony"],["value","Flowers"],["value","Tree"],["value","Roses"],[1,"col","m3","s6"],[1,""],["name","size","formControlName","size","type","radio","value","XS",1,"with-gap",3,"click"],["name","size","formControlName","size","type","radio","value","S",1,"with-gap",3,"click"],["name","size","formControlName","size","type","radio","value","M",1,"with-gap",3,"click"],["name","size","formControlName","size","type","radio","value","L",1,"with-gap",3,"click"],["name","size","formControlName","size","type","radio","value","XL",1,"with-gap",3,"click"],["name","size","formControlName","size","type","radio","value","2XL",1,"with-gap",3,"click"],["name","size","formControlName","size","type","radio","value","3XL",1,"with-gap",3,"click"],[1,"col","m1","s6"],["type","checkbox","formControlName","fastDeliveryControl",3,"change"],[1,"col","m4","s6"],[1,"input-field"],[1,"material-icons","prefix"],["placeholder","Search Product..","formControlName","search"],["formControlName","sortControl",1,"browser-default"],["value","+title"],["value","-title"],["value","+price"],["value","-price"],["value","+size"],["value","-size"],["value","+origin"],["value","-origin"],["value","+family"],["value","-family"],[4,"ngIf"],[1,"btn","waves-effect","waves-light",3,"click"],["class","chip",3,"click",4,"ngFor","ngForOf"],[1,"waves-effect","waves-teal","btn-flat",3,"click"],[1,"chip",3,"click"],[1,"close","material-icons"]],template:function(e,t){1&e&&(s.Ub(0,"form",0),s.Ub(1,"div",1),s.Ub(2,"label"),s.xc(3,"Filter Category"),s.Tb(),s.Ub(4,"div",2),s.Ub(5,"select",3),s.Ub(6,"option",4),s.xc(7,"Choose your catgory"),s.Tb(),s.Ub(8,"option",5),s.xc(9,"Interior"),s.Tb(),s.Ub(10,"option",6),s.xc(11,"Garden"),s.Tb(),s.Ub(12,"option",7),s.xc(13,"Balcony"),s.Tb(),s.Ub(14,"option",8),s.xc(15,"Flowers"),s.Tb(),s.Ub(16,"option",9),s.xc(17,"Tree"),s.Tb(),s.Ub(18,"option",10),s.xc(19,"Roses"),s.Tb(),s.Tb(),s.Tb(),s.Tb(),s.Ub(20,"div",11),s.Ub(21,"label"),s.xc(22,"Size"),s.Tb(),s.Ub(23,"div",12),s.Ub(24,"label"),s.Ub(25,"input",13),s.cc("click",function(){return t.filterSize("XS")}),s.Tb(),s.Ub(26,"span"),s.xc(27,"XS"),s.Tb(),s.Tb(),s.Ub(28,"label"),s.Ub(29,"input",14),s.cc("click",function(){return t.filterSize("S")}),s.Tb(),s.Ub(30,"span"),s.xc(31,"S"),s.Tb(),s.Tb(),s.Ub(32,"label"),s.Ub(33,"input",15),s.cc("click",function(){return t.filterSize("M")}),s.Tb(),s.Ub(34,"span"),s.xc(35,"M"),s.Tb(),s.Tb(),s.Ub(36,"label"),s.Ub(37,"input",16),s.cc("click",function(){return t.filterSize("L")}),s.Tb(),s.Ub(38,"span"),s.xc(39,"L"),s.Tb(),s.Tb(),s.Ub(40,"label"),s.Ub(41,"input",17),s.cc("click",function(){return t.filterSize("XL")}),s.Tb(),s.Ub(42,"span"),s.xc(43,"XL"),s.Tb(),s.Tb(),s.Ub(44,"label"),s.Ub(45,"input",18),s.cc("click",function(){return t.filterSize("2XL")}),s.Tb(),s.Ub(46,"span"),s.xc(47,"2XL"),s.Tb(),s.Tb(),s.Ub(48,"label"),s.Ub(49,"input",19),s.cc("click",function(){return t.filterSize("3XL")}),s.Tb(),s.Ub(50,"span"),s.xc(51,"3XL"),s.Tb(),s.Tb(),s.Tb(),s.Tb(),s.Ub(52,"div",20),s.Ub(53,"label"),s.Ub(54,"input",21),s.cc("change",function(){return t.changeFastDelivery()}),s.Tb(),s.Ub(55,"span"),s.xc(56,"Only Fast Delivery"),s.Tb(),s.Tb(),s.Tb(),s.Ub(57,"div",22),s.Ub(58,"div",23),s.Ub(59,"i",24),s.xc(60,"search"),s.Tb(),s.Pb(61,"input",25),s.Tb(),s.Tb(),s.Ub(62,"div",1),s.Ub(63,"label"),s.xc(64,"Sort by"),s.Tb(),s.Ub(65,"select",26),s.Ub(66,"option",27),s.xc(67,"Name - ASC"),s.Tb(),s.Ub(68,"option",28),s.xc(69,"Name - DESC"),s.Tb(),s.Ub(70,"option",29),s.xc(71,"Price - ASC"),s.Tb(),s.Ub(72,"option",30),s.xc(73,"Price - DESC"),s.Tb(),s.Ub(74,"option",31),s.xc(75,"Size - ASC"),s.Tb(),s.Ub(76,"option",32),s.xc(77,"Size - DESC"),s.Tb(),s.Ub(78,"option",33),s.xc(79,"Origin - ASC"),s.Tb(),s.Ub(80,"option",34),s.xc(81,"Origin - DESC"),s.Tb(),s.Ub(82,"option",35),s.xc(83,"Family - ASC"),s.Tb(),s.Ub(84,"option",36),s.xc(85,"Family - DESC"),s.Tb(),s.Tb(),s.Tb(),s.Tb(),s.vc(86,f,6,3,"div",37),s.hc(87,"async"),s.Ub(88,"a",38),s.cc("click",function(){return t.getNormalizedFilters()}),s.xc(89,"getNormalizedFilters (check the console)"),s.Tb(),s.Ub(90,"a",38),s.cc("click",function(){return t.refresh()}),s.xc(91),s.Tb()),2&e&&(s.mc("formGroup",t.filtersForm),s.Db(86),s.mc("ngIf",s.ic(87,3,t.filters$).length),s.Db(5),s.zc("refresh (",t.nbRefresh,")"))},directives:[l.u,l.m,l.g,l.t,l.l,l.e,l.p,l.v,l.c,l.r,l.a,c.k,c.j],pipes:[c.b],encapsulation:2}),e})();function h(e,t){if(1&e){const e=s.Vb();s.Ub(0,"tr"),s.Ub(1,"td",1),s.cc("click",function(){s.rc(e);const i=t.$implicit;return s.gc().add.emit(i)}),s.xc(2),s.Tb(),s.Ub(3,"td"),s.xc(4),s.Tb(),s.Ub(5,"td"),s.xc(6),s.Tb(),s.Ub(7,"td"),s.xc(8),s.Tb(),s.Ub(9,"td"),s.xc(10),s.Tb(),s.Ub(11,"td"),s.xc(12),s.Tb(),s.Ub(13,"td"),s.xc(14),s.Tb(),s.Ub(15,"td"),s.xc(16),s.hc(17,"slice"),s.Tb(),s.Ub(18,"td"),s.Ub(19,"button",2),s.cc("click",function(){s.rc(e);const i=t.$implicit;return s.gc().add.emit(i)}),s.Ub(20,"i",3),s.xc(21,"add_shopping_cart"),s.Tb(),s.Tb(),s.Tb(),s.Tb()}if(2&e){const e=t.$implicit;s.Db(2),s.yc(e.title),s.Db(2),s.yc(e.category),s.Db(2),s.yc(e.rapidDelivery),s.Db(2),s.yc(e.price),s.Db(2),s.yc(e.family),s.Db(2),s.yc(e.origin),s.Db(2),s.yc(e.size),s.Db(2),s.yc(s.jc(17,8,e.description,0,100))}}let m=(()=>{class e{constructor(){this.add=new s.o,this.subtract=new s.o}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=s.Ib({type:e,selectors:[["app-product-filter"]],inputs:{products:"products"},outputs:{add:"add",subtract:"subtract"},decls:23,vars:1,consts:[[4,"ngFor","ngForOf"],[3,"click"],[1,"btn","waves-effect","waves-light",3,"click"],[1,"material-icons"]],template:function(e,t){1&e&&(s.Ub(0,"table"),s.Ub(1,"thead"),s.Ub(2,"tr"),s.Ub(3,"th"),s.xc(4,"Name"),s.Tb(),s.Ub(5,"th"),s.xc(6,"Category"),s.Tb(),s.Ub(7,"th"),s.xc(8,"Rapid Delivery"),s.Tb(),s.Ub(9,"th"),s.xc(10,"Price"),s.Tb(),s.Ub(11,"th"),s.xc(12,"Family"),s.Tb(),s.Ub(13,"th"),s.xc(14,"Origin"),s.Tb(),s.Ub(15,"th"),s.xc(16,"Size"),s.Tb(),s.Ub(17,"th"),s.xc(18,"description"),s.Tb(),s.Ub(19,"th"),s.xc(20,"actions"),s.Tb(),s.Tb(),s.Tb(),s.Ub(21,"tbody"),s.vc(22,h,22,12,"tr",0),s.Tb(),s.Tb()),2&e&&(s.Db(22),s.mc("ngForOf",t.products))},directives:[c.j],pipes:[c.q],styles:["[_nghost-%COMP%] {\n    display: block;\n    width: 100%;\n  }"],changeDetection:0}),e})();function T(e,t){if(1&e){const e=s.Vb();s.Sb(0),s.Pb(1,"app-filters-form"),s.Ub(2,"div",5),s.Ub(3,"app-product-filter",6),s.cc("add",function(t){return s.rc(e),s.gc().addProductToCart(t)})("subtract",function(t){return s.rc(e),s.gc().subtract(t)}),s.hc(4,"async"),s.Tb(),s.Tb(),s.Rb()}if(2&e){const e=s.gc();s.Db(3),s.mc("products",s.ic(4,1,e.products$))}}function U(e,t){1&e&&(s.Ub(0,"div",7),s.Pb(1,"div",8),s.Tb())}let g=(()=>{class e{constructor(e,t,i){this.productsService=e,this.cartService=t,this.productsQuery=i}ngOnInit(){this.productsService.get().subscribe(),this.loading$=this.productsQuery.selectLoading(),this.products$=this.productsService.selectAll()}addProductToCart({id:e}){this.cartService.addProductToCart(e)}subtract({id:e}){this.cartService.subtract(e)}}return e.\u0275fac=function(t){return new(t||e)(s.Ob(r.b),s.Ob(o.b),s.Ob(r.a))},e.\u0275cmp=s.Ib({type:e,selectors:[["app-products-list"]],decls:9,vars:4,consts:[[1,"padding"],[1,"grey-text","flex","align-center"],[1,"large","material-icons"],[4,"ngIf","ngIfElse"],["loadingTpl",""],[1,"row"],[3,"products","add","subtract"],[1,"progress"],[1,"indeterminate"]],template:function(e,t){if(1&e&&(s.Ub(0,"section",0),s.Ub(1,"h1",1),s.Ub(2,"i",2),s.xc(3,"view_list"),s.Tb(),s.xc(4," Products list with filters "),s.Tb(),s.vc(5,T,5,3,"ng-container",3),s.hc(6,"async"),s.vc(7,U,2,0,"ng-template",null,4,s.wc),s.Tb()),2&e){const e=s.pc(8);s.Db(5),s.mc("ngIf",!s.ic(6,2,t.loading$))("ngIfElse",e)}},directives:[c.k,v,m],pipes:[c.b],encapsulation:2}),e})();var y=i("tyNb");const x=[{path:"",component:g}];let S=(()=>{class e{}return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=s.Mb({type:e}),e.\u0275inj=s.Lb({imports:[[c.c,y.d.forChild(x),l.s]]}),e})()}}]);