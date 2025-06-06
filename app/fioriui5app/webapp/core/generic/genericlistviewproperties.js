sap.ui.define([
    "core/base/basefunctions",
    "sap/ui/core/mvc/Controller"
],
    function (basefunctions) {
        "use strict";

        return basefunctions.extend("corebase.genericlistviewproperties", {

            pListViewDataSourceURL: "",
            pListViewDataSourceURLType: "",
            pListViewDataSourceResetURL: "",
            pListViewDataSourceResetURLType: "",
            pCflListViewDataSourceURL: "",
            pCflListViewDataSourceURLType: "",
            pListViewDataSource: [],

            pRowid: "",
            pDisplayColumnList: [],
            pColumnList: [],
            //pFilterColumnList:[],
            pListViewDataSourceURLReqData: {},
            pListViewDataSourceURLResetReqData: {},
            pListViewDataSourceURLBindPath: "",
            pListViewTable: {},
            pCflListViewDataSourceURLBindPath: "",
            pCflListViewDataSourceURLReqData: "",
            

            pBaseUrlForPagination:"",

            onInit: function () {
                basefunctions.prototype.onInit.apply(this, arguments);
                //alert("Generic List view Properties ");
                this.router = sap.ui.core.UIComponent.getRouterFor(this);

            },


            getListViewDataSourceURL: function () {
                return this.pListViewDataSourceURL;
            },

            setListViewDataSourceURL: function (value) {
                this.pListViewDataSourceURL = value;

                if (this.getListViewDataSourceResetURL().length == 0) {
                    this.setListViewDataSourceResetURL(value);
                }
            },

            getListViewDataSourceURLType: function () {
                return this.pListViewDataSourceURLType;
            },

            setListViewDataSourceURLType: function (value) {
                this.pListViewDataSourceURLType = value;
            },

            getListViewDataSourceResetURL: function () {
                return this.pListViewDataSourceResetURL;
            },

            setListViewDataSourceResetURL: function (value) {
                this.pListViewDataSourceResetURL = value;
            },

            getListViewDataSourceResetURLType: function () {
                return this.pListViewDataSourceResetURLType;
            },

            setListViewDataSourceResetURLType: function (value) {
                this.pListViewDataSourceResetURLType = value;
            },

            getCflDataSourceURL: function () {
                return this.pCflListViewDataSourceURL;
            },

            setCflDataSourceURL: function (value) {
                this.pCflListViewDataSourceURL = value;
            },

            setCflDataSourceURLType: function () {
                return this.pCflListViewDataSourceURLType;
            },

            setCflListViewDataSourceURLType: function (value) {
                this.pCflListViewDataSourceURLType = value;
            },

            getListViewDataSource: function () {
                return this.getView().getModel(this.getListViewDataSourceModelName()).getData();
            },

            setListViewDataSource: function (data) {
                var oModel = this.getView().getModel(this.getListViewDataSourceModelName());
                oModel.setData(data);
            },

            getForwardRoute: function () {
                return this.pRouteForwardTo;
            },

            setForwardRoute: function (value) {
                this.pRouteForwardTo = value;
            },

            getBackwardRoute: function () {
                return this.pRouteBackwardTo;
            },

            setBackwardRoute: function (value) {
                this.pRouteBackwardTo = value;
            },

            getRowId: function () {
                return this.pRowid;
            },

            setRowId: function (value) {
                this.pRowid = value;;
            },

            getListViewDisplayColumns: function () {
                return this.pDisplayColumnList;
            },

            setListViewDisplayColumns: function (value) {
                this.pDisplayColumnList = value;
            },

            getListViewDataColumns: function () {
                return this.pColumnList;
            },

            setListViewDataColumns: function (value) {
                this.pColumnList = value;
            },

            getListViewDataSourceURLReqData: function () {
                return this.pListViewDataSourceURLReqData;
            },

            setListViewDataSourceURLReqData: function (value) {
                this.pListViewDataSourceURLReqData = value;

                if (this.isObjectEmpty(this.getListViewDataSourceURLResetReqData())) {
                    let copiedObject = Object.assign({}, value);
                    this.setListViewDataSourceURLResetReqData(copiedObject);
                }
            },

            getListViewDataSourceURLResetReqData: function () {
                return this.pListViewDataSourceURLResetReqData;
            },

            setListViewDataSourceURLResetReqData: function (value) {
                this.pListViewDataSourceURLResetReqData = value;
            },

            getListViewDataSourceURLBindPath: function () {
                return this.pListViewDataSourceURLBindPath;
            },

            setListViewDataSourceURLBindPath: function (value) {
                this.pListViewDataSourceURLBindPath = value;
            },

            setListViewDataSourceProperties(sType, sUrl, oRequestData, sBindingPath) {
                this.setListViewDataSourceURLType(sType);
                this.setListViewDataSourceURL(sUrl);
                this.setListViewDataSourceURLReqData(oRequestData);
                this.setListViewDataSourceURLBindPath(sBindingPath);
            },

            setListViewTable: function (value) {
                this.pListViewTable = value;
            },

            getListViewTable: function () {
                return this.pListViewTable;
            },

            setCflListViewDataSourceProperties(sType, sUrl, oRequestData, sBindingPath) {
                this.setCflListViewDataSourceURLType(sType);
                this.setCflListViewDataSourceURL(sUrl);
                this.setCflListViewDataSourceURLReqData(oRequestData);
                this.setCflListViewDataSourceURLBindPath(sBindingPath);
            },

           
            setCflListViewDataSourceURL: function (value) {
                this.pCflListViewDataSourceURL = value;
            },

            getCflListViewDataSourceURL: function () {
                return this.pCflListViewDataSourceURL;
            },

            setCflListViewDataSourceURLReqData: function (value) {
                this.pCflListViewDataSourceURLReqData = value;
            },

            getCflListViewDataSourceURLReqData: function () {
                return this.pCflListViewDataSourceURLReqData;
            },


            setCflListViewDataSourceURLBindPath: function (value) {
                this.pCflListViewDataSourceURLBindPath = value;
            },

            getCflListViewDataSourceURLBindPath: function () {
                return this.pCflListViewDataSourceURLBindPath;
            },

            getCflListViewDataSourceURLType: function () {
              return this.pCflListViewDataSourceURLType ;
            },

            setCflBaseUrlForPagination: function (value) {
                this.pBaseUrlForPagination = value;
            },

            getCflBaseUrlForPagination: function () {
                return this.pBaseUrlForPagination;
            },
        });
    });
