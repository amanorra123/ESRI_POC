sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
],
    function (Controller, JSONModel, ODataModel) {
        "use strict";

        return Controller.extend("corebase.baseproperties", {

            // Form Title
            pFormTitle: "No Form Title",

            // Form Sub Title
            pFormSubTitle: "No Form Sub Title",
            
            
            //Menu Code attached to this form
            pMenuCode: "",

            pRouteForwardTo: "",
            pRouteBackwardTo: "",

            pFormMode: "",

            pODataModel: "",
            pController: null,
            pEditProperty: "",
            pEditPropertyValue:"",
            pEditPropertyObject:"",
            pCflValueFrom: "",
            pCflDisplayFrom: "",
            pCflValueIdFor: "",
            pCflDisplayFor: "",
            pCflDisplayHidden : "",
            pCflSearchProperty:"",
            pListViewDataSourceModelName: "ListViewDataSourceModel",
            pEntryFormDataSourceModelName: "EntryFormDataSourceModel",
            pEntryFormResponseDataSourceModelName: "EntryFormResponseDataSourceModel",
            pCflListViewDataSourceModelName: "CflListViewDataSourceModel",

           
            
            pCflTitle: "",
            pCflObject: {},
            pCflObjectList: [],
            pCflDisplayColumnList: [],
            pCflColumnList: [],
            pCflValue: "",
            pCflConfig:[],

            pFilterObj:{
                pControlId:"",
                pCaption:"",
                pType:"",
                pOperator:"",
                pDataType:"",
                pAttributeName:"",
            },
            pFilterColumnList: [],

            pPageId:"",

            pApiResponseObject:{success:false,object:{}},

            pLogsDisplayColumnList: [],
            pLogsColumnList: [],

            pRespPath:"",
            
            onInit: function () {

                //alert("Base Properties ");
                this.router = sap.ui.core.UIComponent.getRouterFor(this);

                var oModel = new JSONModel();
                this.getView().setModel(oModel, this.pListViewDataSourceModelName);

                var oModel = new JSONModel();
                this.getView().setModel(oModel, this.pEntryFormDataSourceModelName);

                var oModel = new JSONModel();
                this.getView().setModel(oModel, this.pCflListViewDataSourceModelName);

                this.pFilterColumnList = [];

                //Work Pending on oDATA

                //var pODataModel = new sap.ui.model.odata.v2.ODataModel("");
                //this.getView().setModel(pODataModel, "ListViewDataSourceODATA");
                
                // Do NOT delete this addEventDelegate - Ali
                this.getView().addEventDelegate({
                    onBeforeShow: this.onBeforeShow.bind(this)
                });
                
                
            },

            // do NOT Delete this - Ali
            onBeforeShow: function (oEvent) {
                
            },
            

            createNewModel: function (sModelName) {
                var oModel = new JSONModel();
                this.getView().setModel(oModel, sModelName);
            }

        });
    });
