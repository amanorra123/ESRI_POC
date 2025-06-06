
sap.ui.define([
    "core/generic/genericentryformproperties",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller"
],
    function (genericentryformproperties, JSONModel) {
        "use strict";

        return genericentryformproperties.extend("coregeneric.genericentryformfunctions", {

            onInit: function () {

                genericentryformproperties.prototype.onInit.apply(this, arguments);

                this.router = sap.ui.core.UIComponent.getRouterFor(this);


            },


            identifyFormMode: function (oEvent) {
                //var oArguments = oEvent.getParameter('arguments');
                //0 - Find
                //1 - Ok
                //2- Edit/Update
                //3 - Add / New
                //4 - View
                //5 - Print
                //7 - Archive
                let obj, routeData;

                routeData = this.getRouteData();
                let sText = "";
                if (routeData !== "undefined") {

                    this.setFormMode(routeData.formMode);

                    //obj = JSON.parse(oEvent.data.data);

                    if (routeData.formMode == 1) {
                        // OK Mode
                        sText = "Okay";
                    }
                    else if (routeData.formMode == 2) {
                        // Edit Mode
                        this.setListViewEditPropertyValue(routeData.uniqueId);
                        sText = "Update";
                    }
                    else if (routeData.formMode == 3) {
                        //Add Mode
                        sText = "Add";
                    }

                    //var oButton = this.byId("EntryFormSaveButton");
                    //oButton.setText(sText);
                } else {
                    alert('FormMode');
                }

            },

            showEntryForm: async function (pageId) {

                if (this.getFormMode() == "2") {
                    await this.populateEntryForm("GET", this.getEntryFormDataSourceURLForEditMode(), "");
                }
                else if (this.getFormMode() == "3") {
                    if (this.getEntryFormDataSourceURLForNewMode().length > 0) {
                        await this.populateEntryForm("GET", this.getEntryFormDataSourceURLForNewMode(), "");
                    }
                }

            },

            populateEntryForm: async function (oRequestType, aUrl, oRequestData) {
                // IF condition to be done to set getURLForFormModeNew or getURLForFormModeEdit
                await this.callApi(oRequestType, aUrl, oRequestData)
                    .then((data) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', data);

                        var oModel = new JSONModel();
                        oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
                        oModel.setData(data); // 'data' is the response from your API call
                        this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
                        //this.getView().setModel(oModel, "myModel");
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });

            },

            saveEntryForm: async function (oRequestType, aUrl, oRequestData) {
                // IF condition to be done to set getURLForFormModeNew or getURLForFormModeEdit
                await this.callApi(oRequestType, aUrl, oRequestData)
                    .then((data) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', data);
                        var oModel = new JSONModel();
                        oModel.setData(data); // 'data' is the response from your API call
                        this.getView().setModel(oModel, this.getEntryFormResponseDataSourceModelName());

                        // on Sucess Clear everything
                        this.clearGenericEntryForm();//mansi
                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });

            },

            clearGenericEntryForm: function () {
                // to clear all properties of generic entry form
                this.clearGenericListViewForm();
                this.createNewModel(this.getEntryFormDataSourceModelName());
            },

            showLogs: function (sModelName, sPath, /*onCancelCallback*/) {

                let oDisplayColumnList = [];
                let oColumn;
                let oColumnList = [];

                // Create Column Headers
                this.getLogsDisplayColumns().forEach(oDisplayColumnText => {
                    let oDisplayColumn = new sap.m.Column({
                        header: new sap.m.Label({ text: oDisplayColumnText, wrapping: true })
                    });
                    oDisplayColumnList.push(oDisplayColumn);
                });

                // Create Row Template with Data Bindings
                let aCells = [];
                this.getLogsDataColumnList().forEach(oColumnObj => {
                    let oColumn;

                    if (typeof oColumnObj === 'object' && oColumnObj !== null) {
                        oColumn = oColumnObj;  // Direct UI Control
                    } else if (typeof oColumnObj === 'string' && oColumnObj !== null) {
                        oColumn = new sap.m.Text({ text: "{" +  oColumnObj + "}" });
                    }

                    aCells.push(oColumn);
                });

                // Define Row Template
                var oTemplate = new sap.m.ColumnListItem({
                    cells: aCells
                });

                // Create Table
                var oTable = new sap.m.Table({
                    inset: false,
                    columns: oDisplayColumnList,
                    sticky:["ColumnHeaders"]
                });

                // Bind Table Rows to Model Data
                oTable.bindItems({
                    path: "/" + sPath,
                    template: oTemplate
                });

                // Create Dialog and Add Table
                var oDialog = new sap.m.Dialog({
                    title: this.getCflTitle(),
                    content: [oTable],
                    beginButton: new sap.m.Button({
                        text: "Close",
                        press: function () {
                            oDialog.close();
                        }
                    })
                });

                // Set Model to Table
                oTable.setModel(this.getView().getModel(sModelName));

                // Open Dialog
                return oDialog.open();

            }
        });
    });
