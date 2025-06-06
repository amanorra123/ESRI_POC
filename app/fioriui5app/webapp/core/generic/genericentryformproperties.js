sap.ui.define([
    "core/generic/genericlistview",
    "sap/ui/core/mvc/Controller"
],
    function (genericlistview) {
        "use strict";

        return genericlistview.extend("coregeneric.genericentryformproperties", {

            
            pURLForFormModeNew: "",
            pURLForFormModeEdit: "",
            pURLForFormModeAdd: "",
            pURLForFormModeUpdate: "",
            pEntryFormDataSource: {},
            

            onInit: function () {
                genericlistview.prototype.onInit.apply(this, arguments);
                
                this.router = sap.ui.core.UIComponent.getRouterFor(this);

            },

            getEntryFormDataSourceURLForNewMode: function () {
                return this.pURLForFormModeNew;
            },

            setEntryFormDataSourceURLForNewMode: function (value) {
                this.pURLForFormModeNew = value;
            },

            getEntryFormDataSourceURLForEditMode: function () {
                return this.pURLForFormModeEdit;
            },

            setEntryFormDataSourceURLForEditMode: function (value) {
                this.pURLForFormModeEdit = value;
            },

            getEntryFormDataSourceURLToAddData: function () {
                return this.pURLForFormModeAdd;
            },

            setEntryFormDataSourceURLToAddData: function (value) {
                this.pURLForFormModeAdd = value;
            },

            getEntryFormDataSourceURLToUpdateData: function () {
                return this.pURLForFormModeUpdate;
            },

            setEntryFormDataSourceURLToUpdateData: function (value) {
                this.pURLForFormModeUpdate = value;
            },

            getEntryFormDataSource: function () {
                return this.getView().getModel("EntryFormDataSourceModel").getData();
            },

            setEntryFormDataSource: function (data) {
                var oModel = this.getView().getModel("EntryFormDataSourceModel");
                oModel.setData(data);
            },
        
        });
    });
