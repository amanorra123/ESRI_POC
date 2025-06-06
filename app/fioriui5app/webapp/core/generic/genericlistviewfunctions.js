sap.ui.define([
    "core/generic/genericlistviewproperties",
    "sap/ui/model/json/JSONModel",
    "sap/m/Table",
    "fioriui5app/model/formatter",
],
    function (genericlistviewproperties, JSONModel, formatter) {
        "use strict";

        return genericlistviewproperties.extend("corebase.genericlistviewfunctions", {

            onInit: function () {

                genericlistviewproperties.prototype.onInit.apply(this, arguments);
                //alert("Generic LIst View Functions  ");
                this.router = sap.ui.core.UIComponent.getRouterFor(this);

            },

            createNewModelUsingAPI: async function (oRequestType, sUrl, oRequestData, sModelName) {

                await this.callApi(oRequestType, sUrl, oRequestData)
                    .then((response) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', response);

                        let data = this.prepareData(sUrl, response);

                        var oModel = new JSONModel();
                        oModel.setData(response); // 'data' is the response from your API call
                        this.getView().setModel(oModel, sModelName);

                        this.getView().getModel(sModelName);

                    })
                    .catch(function (error) {
                        const oData = {}
                        var oModel = new JSONModel(oData);
                        this.getView().setModel(oModel, sModelName);
                        console.error('Error:', error);


                    }.bind(this));
            },


            createNewModelUsingArray: async function (sModelName, oModelData) {

                this.createNewModel(sModelName);
                let oModel = this.getView().getModel(sModelName);
                oModel.setData(oModelData);
                this.getView().setModel(oModel, sModelName);
            },

            populateListView: async function (oRequestType, oRequestData) {

                await this.callApi(oRequestType, this.getListViewDataSourceURL(), oRequestData)
                    .then((response) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', response);

                        let x = 1;
                        let data;

                        data = this.prepareData(this.getListViewDataSourceURL(), response);

                        var oModel = new JSONModel();
                        oModel = this.getView().getModel(this.getListViewDataSourceModelName());
                        oModel.setData(data); // 'data' is the response from your API call
                        this.getView().setModel(oModel, this.getListViewDataSourceModelName());

                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });

            },

            populateCflUsingApi: async function (oRequestType, oRequestData) {

                await this.callApi(oRequestType, this.getCflDataSourceURL(), oRequestData)
                    .then((response) => {
                        // writing like this .then ((data) => {}) gives the parent context, in this case the controller.
                        console.log('Success:', response);

                        let data;

                        data = this.prepareData(this.getCflDataSourceURL(), response);

                        var oModel = new JSONModel();
                        oModel = this.getView().getModel(this.getCflListViewDataSourceModelName());

                        oModel.setData(data); // 'data' is the response from your API call
                        this.getView().setModel(oModel, this.getCflListViewDataSourceModelName());

                    })
                    .catch(function (error) {
                        console.error('Error:', error);
                    });

            },

            setCflDataSourceModel: function (oModelData) {

                this.createNewModelUsingArray(this.getCflListViewDataSourceModelName(), oModelData);

                this.setCflDataSourceURL("");

            },

            isModelValid: function (sModelName) {

                let oModel = this.getView().getModel(sModelName);

                if (oModel !== "undefined") {
                    let oData = oModel.getData();

                    // Check if the data is not empty
                    if (oData && Object.keys(oData).length > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            },

            populateSelect: function (sSelectId, sModelName, sPath, sKey, sText) {

                let oSelect = sap.ui.getCore().byId(sSelectId);
                if (oSelect === undefined) {
                    oSelect = this.getView().byId(sSelectId);
                }
                let concateText = '';
                let arrSText = sText.split(",");
                if (arrSText.length > 1) {

                    for (let index = 1; index < arrSText.length; index++) {
                        const element = arrSText[index];
                        concateText += "{" + sModelName + ">" + element + "}" + " -- "
                    }

                    concateText = concateText.substring(0, concateText.length - 4);
                    oSelect.setShowSecondaryValues(true);
                } else {
                    concateText = sText;
                }
                oSelect.bindItems({
                    path: sModelName + ">/" + sPath,
                    template: new sap.ui.core.ListItem({
                        key: "{" + sModelName + ">" + sKey + "}",
                        text: "{" + sModelName + ">" + arrSText[0] + "}",
                        additionalText: concateText
                        // "{" + sModelName + ">" + sText + "}" + ' : ' + "{" + sModelName + ">" + sText + "}"

                    })
                });

                // oSelect.bindItems({
                //     path: sModelName + ">/" + sPath,
                //     template: new sap.ui.core.Item({
                //         key: "{" + sModelName + ">" + sKey + "}",
                //         text:concateText
                //         // "{" + sModelName + ">" + sText + "}" + ' : ' + "{" + sModelName + ">" + sText + "}"

                //     })
                // });

            },

            showCfl: function (sCflId, sModelName, sPath, onConfirmCallback, onCancelCallback) {

                let oDisplayColumnList = [];
                let oColumn;
                let oColumnList = [];
                let oController = this;

                let oInput = sap.ui.getCore().byId(sCflId);

                // build Display Columns
                this.getCflDisplayColumns().forEach(sDisplayColumnText => {

                    let oLabel = new sap.m.Label({
                        text: sDisplayColumnText,
                    });

                    let oIcon = new sap.ui.core.Icon({
                        src: "sap-icon://filter",
                        color: sap.ui.core.IconColor.Default,
                        activeColor: sap.ui.core.IconColor.Positive,
                        press: function () {
                            let columnIndex = oDisplayColumnList.indexOf(oDisplayColumn);
                            oController.setCflSearchProperty(oController.getCflDataColumnList()[columnIndex]);
                        }
                    });

                    let oHBox = new sap.m.HBox({
                        items: [oLabel, oIcon]
                    });

                    let oDisplayColumn = new sap.m.Column({
                        header: oHBox
                    });

                    oDisplayColumnList.push(oDisplayColumn);
                });

                // build Column Cells
                // this.getCflDataColumnList().forEach(oColumnText => {
                //     if (oColumnText == "Edit") {
                //         oColumn = new sap.m.Button({ icon: "sap-icon://navigation-right-arrow", press: this.onPressOfListViewEditButton.bind(this) });
                //     }
                //     else {
                //         oColumn = new sap.m.Text({ text: "{" + sModelName + ">" + oColumnText + "}" });
                //     }

                //     oColumnList.push(oColumn);
                // });
                this.getCflDataColumnList().forEach(oColumnObj => {
                    if (typeof oColumnObj === 'object' && oColumnObj !== null) {

                        oColumn = oColumnObj;

                    }
                    else if (typeof oColumnObj === 'string' && oColumnObj !== null) {

                        if (oColumnObj == "Edit") {
                            oColumn = new sap.m.Button({ icon: "sap-icon://navigation-right-arrow", press: this.onPressOfListViewEditButton.bind(this) });
                        }
                        else if (oColumnObj == "Print") {
                            oColumn = new sap.m.Button({ icon: "sap-icon://print", press: this.onPressOfListViewPrintButton.bind(this) });
                        }
                        else {
                            oColumn = new sap.m.Text({ text: "{" + sModelName + ">" + oColumnObj + "}" });

                        }
                    }

                    var oHBox = new sap.m.HBox({
                        items: [oColumn],
                        alignContent: sap.m.FlexAlignContent.Left,
                        alignItems: sap.m.FlexAlignItems.Left,

                    });

                    oColumnList.push(oHBox);
                    //oColumnList.push(oColumn);
                });

                //build Table
                var oDialog = new sap.m.TableSelectDialog({

                    title: this.getCflTitle(),
                    columns: oDisplayColumnList,
                    items: {
                        path: sModelName + ">/" + sPath,
                        template:
                            new sap.m.ColumnListItem({
                                cells:
                                    oColumnList
                            })
                    },

                    search: async function (oEvent) {

                        var sValue = oEvent.getParameter("value");
                        var oBinding = oEvent.getSource().getBinding("items");

                        if (sValue.length > 0) {
                            //var oFilter = new sap.ui.model.Filter(oController.getCflSearchProperty(), sap.ui.model.FilterOperator.Contains, sValue);
                            var oFilter = new sap.ui.model.Filter({
                                path: oController.getCflSearchProperty(),
                                test: function (value) {
                                    return value !== null && value !== undefined && value.toString().toLowerCase().includes(sValue.toLowerCase());
                                }
                            });
                            oBinding.filter([oFilter]);
                            if (oBinding.filter([oFilter]).iLength == 0) {
                                let filter = oController.getCflListViewDataSourceURL() + "& $filter=" + oController.getCflSearchProperty() + " contains '" + sValue + "'";
                                await oController.createNewModelUsingAPI(oController.getCflListViewDataSourceURLType(), filter, oController.getCflListViewDataSourceURL(), oController.getCflListViewDataSourceURLReqData(), oController.getCflListViewDataSourceModelName());
                            }
                            else {

                            }

                        }
                        else {
                            oBinding.filter([]);
                        }



                    },
                    confirm: function (oEvent) {

                        var oBinding = oEvent.getSource().getBinding("items");
                        oBinding.filter([]);

                        if (oController.getCflValueFor().length > 0 && oController.getCflValueFrom().length > 0) {
                            // to be written
                            let oCflValueFor = oController.getCflValueFor();
                            let oCflValueFrom = oController.getCflValueFrom();
                            let oValue = oEvent.getParameter("selectedContexts")[0].getObject()[oCflValueFrom];
                            oController.getView().getModel(oController.getEntryFormDataSourceModelName()).setProperty(oCflValueFor, oValue);
                        }

                        if (oController.getCflValueFor().length == 0 && oController.getCflValueFrom().length == 0 && oController.getCflDisplayFor().length > 0 && oController.getCflDisplayFrom().length > 0) {

                            let oCflDisplayFor = oController.getCflDisplayFor();
                            let oCflDisplayFrom = oController.getCflDisplayFrom();
                            let oCflDisplayHidden = oController.getCflDisplayHidden();
                            let oValue = oEvent.getParameter("selectedContexts")[0].getObject()[oCflDisplayFrom];
                            //oController.byId(oCflDisplayFor).setValue(oValue);
                            sap.ui.getCore().byId(oCflDisplayFor).setValue(oValue);
                            if (oCflDisplayHidden !== undefined && oCflDisplayHidden !== null) {

                                sap.ui.getCore().byId(oCflDisplayFor).data("data-displayHidden", oEvent.getParameter("selectedContexts")[0].getObject()[oCflDisplayHidden]);

                            }

                        }


                        if (oEvent.getParameter("selectedContexts").length == 1) {
                            oController.setCflObject(oEvent.getParameter("selectedContexts")[0].getObject());
                        }

                        if (oEvent.getParameter("selectedContexts").length > 1) {
                            oController.setCflObjectList(oEvent.getParameter("selectedContexts"));
                        }


                        oDialog.destroy();

                        if (onConfirmCallback) {
                            onConfirmCallback();
                        }

                    },
                    cancel: function () {
                        if (onCancelCallback) {
                            onCancelCallback();
                        }
                    }
                });

                //var odata = this.getView().getModel(sModelName);

                oDialog.setModel(this.getView().getModel(sModelName), sModelName);

                var oTableForm = new sap.ui.layout.form.SimpleForm({
                    title: this.getCflTitle(),
                    content: oDialog
                });


                //for pagination code - applied for s4 apis
                let strNextLink = "@odata.nextLink";
                let nNextLink = this.getView().getModel(sModelName).getData()[strNextLink];
                if (nNextLink !== undefined) {

                    // ✅ Attach to view
                    let oView = this.getView();//this.getCflParentView();
                    oView.addDependent(oDialog);

                    oDialog._oDialog.attachAfterOpen(() => {
                        setTimeout(function () {
                            var oTable = oDialog._oTable;
                            var oDomRef = oTable.getDomRef();

                            if (oDomRef) {
                                const oScrollContainer = this.findScrollableParent(oDomRef);

                                if (oScrollContainer) {
                                    let bLoading = false;
                                    oScrollContainer.addEventListener("scroll", async () => {
                                        if (bLoading) return;

                                        var scrollTop = oScrollContainer.scrollTop;
                                        var scrollHeight = oScrollContainer.scrollHeight;
                                        var clientHeight = oScrollContainer.clientHeight;

                                        if (scrollTop + clientHeight >= scrollHeight - 10) {
                                            bLoading = true;

                                            const oModel = oDialog.getModel(sModelName);
                                            const sNextUrl = oModel.getProperty(`/${strNextLink}`);

                                            const iScrollTop = oScrollContainer.scrollTop;

                                            if (sNextUrl) {
                                                try {
                                                    const url = sNextUrl.startsWith("http") ? sNextUrl : this.getCflBaseUrlForPagination() + sNextUrl;
                                                    const response = await this.callApi('GET', url, '');

                                                    const aNewResults = response[sPath];//value or d/results
                                                    const sNextLink = response[strNextLink];

                                                    let aExistingResults = oModel.getProperty("/value") || [];
                                                    aExistingResults = aExistingResults.concat(aNewResults);

                                                    oModel.setProperty(`/${sPath}`, aExistingResults);
                                                    oModel.setProperty(`/${strNextLink}`, sNextLink);
                                                    // oModel.refresh(true);

                                                    // Wait for rendering to complete
                                                    sap.ui.getCore().applyChanges();

                                                    // Restore scroll position
                                                    setTimeout(() => {
                                                        oScrollContainer.scrollTop = iScrollTop;
                                                    }, 0);
                                                } catch (e) {
                                                    console.log("Scroll load error:", e);
                                                } finally {
                                                    bLoading = false;
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }.bind(this), 300);
                    });
                }

                return oDialog.open();
            },
            findScrollableParent: function (el) {
                while (el) {
                    const style = window.getComputedStyle(el);
                    const overflowY = style.overflowY;
                    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
                        return el;
                    }
                    el = el.parentElement;
                }
                return null;
            },


            buildList: function () {

                let oDisplayColumn;
                let oDisplayColumnList = [];
                let oColumn;
                let oColumnList = [];

                // build Display Columns
                this.getListViewDisplayColumns().forEach(oDisplayColumnText => {
                    oDisplayColumn = new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>" + oDisplayColumnText + "}" }), hAlign: sap.ui.core.TextAlign.Center });
                    oDisplayColumnList.push(oDisplayColumn);
                });

                // build Column Cells
                this.getListViewDataColumns().forEach(oColumnObj => {
                    if (typeof oColumnObj === 'object' && oColumnObj !== null) {

                        oColumn = oColumnObj;

                    }
                    else if (typeof oColumnObj === 'string' && oColumnObj !== null) {

                        if (oColumnObj == "Edit") {
                            oColumn = new sap.m.Button({ icon: "sap-icon://navigation-right-arrow", press: this.onPressOfListViewEditButton.bind(this) });
                        }
                        else if (oColumnObj == "Print") {
                            oColumn = new sap.m.Button({ icon: "sap-icon://print", press: this.onPressOfListViewPrintButton.bind(this) });
                        }
                        else {
                            oColumn = new sap.m.Text({ text: "{" + this.getListViewDataSourceModelName() + ">" + oColumnObj + "}" });

                        }
                    }

                    var oHBox = new sap.m.HBox({
                        items: [oColumn],
                        alignContent: sap.m.FlexAlignContent.Center,
                        alignItems: sap.m.FlexAlignItems.Center,
                        justifyContent: sap.m.FlexJustifyContent.SpaceAround
                    });

                    oColumnList.push(oHBox);
                    //oColumnList.push(oColumn);
                });

                // Add Edit Icon
                let oEdit;
                //oColumnList.push(oEdit);

                let iValue = this.identifySystem(this.getListViewDataSourceURL());
                let sBindObjectName = "";
                if (iValue == 1) {
                    sBindObjectName = "value";
                } else if (iValue == 2) {
                    sBindObjectName = "results";
                }
                else {

                }

                sBindObjectName = this.getListViewDataSourceURLBindPath();

                let oHeaderToolbar = new sap.m.Toolbar({
                    content: [
                        new sap.m.Title({ text: this.getFormSubTitle() }),
                        new sap.m.ToolbarSpacer(),
                        new sap.m.Button({ text: "{i18n>CREATE}", icon: 'sap-icon://create', press: this.onPressOfListViewNewButton.bind(this) }),
                        //  new sap.m.Button({ text: "{i18n>SETTING}", icon: 'sap-icon://action-settings', press: this.onPressOfListViewSettingButton.bind(this) }),

                    ]
                });

                //build Table
                var oTable = new sap.m.Table({
                    headerToolbar: oHeaderToolbar,
                    sticky: ["ColumnHeaders"],
                    growing: true,
                    growingScrollToLoad: true,
                    columns: oDisplayColumnList,
                    items: {
                        path: this.getListViewDataSourceModelName() + ">/" + sBindObjectName,
                        template:
                            new sap.m.ColumnListItem({
                                cells:
                                    oColumnList
                            })
                    }
                });

                //mansi
                oTable.attachUpdateFinished(() => {
                    // Delay a bit to ensure rendering is done
                    setTimeout(() => {
                        // Walk up the DOM to find scrollable container
                        const oScrollContainer = this._findScrollContainer(oTable.getDomRef());
                        if (!oScrollContainer || this._scrollAttached) return;

                        this._scrollAttached = true;

                        let bLoading = false;

                        oScrollContainer.addEventListener("scroll", async () => {
                            if (bLoading) return;
                            const { scrollTop, scrollHeight, clientHeight } = oScrollContainer;

                            if (scrollTop + clientHeight >= scrollHeight - 50/* && !bLoading*/) {
                                bLoading = true;

                                const oModel = this.getView().getModel(this.getListViewDataSourceModelName());
                                const sNextUrl = oModel.getProperty("/@odata.nextLink");

                                const iScrollTop = oScrollContainer.scrollTop;

                                if (sNextUrl) {
                                    try {
                                        const url = sNextUrl.startsWith("http") ? sNextUrl : this.getCflBaseUrlForPagination() + sNextUrl;
                                        const oResponse = await this.callApi("GET", url);
                                        const aNewData = oResponse.value || oResponse.results;
                                        const sNewNextLink = oResponse["@odata.nextLink"];

                                        const sBindPath = "/" + this.getListViewDataSourceURLBindPath();

                                        let aExistingData = oModel.getProperty(sBindPath) || [];
                                        oModel.setProperty(sBindPath, aExistingData.concat(aNewData));
                                        oModel.setProperty("/@odata.nextLink", sNewNextLink);

                                        // Wait for rendering to complete
                                        sap.ui.getCore().applyChanges();

                                        // Restore scroll position
                                        setTimeout(() => {
                                            oScrollContainer.scrollTop = iScrollTop;
                                        }, 0);
                                    } catch (e) {
                                        console.error("Scroll load failed", e);
                                    }finally {
                                        bLoading = false;
                                    }
                                }

                               // bLoading = false;
                            }
                        });
                    }, 500);
                });


                this.setListViewTable(oTable);

               // 2. Create the ScrollContainer and add the table to its content
                var oSContainer = new sap.m.ScrollContainer({
                    vertical: true,
                    horizontal: false,
                    content: [oTable],
                    height: "30rem" // or specify a height like "600px" if needed
                });


                var oTableForm = new sap.ui.layout.form.SimpleForm({

                    content: oSContainer//oTable
                });

                return oTableForm;
            },

            //Mansi
            _findScrollContainer: function (el) {
                while (el && el !== document.body) {
                    const overflowY = window.getComputedStyle(el).overflowY;
                    if (overflowY === "auto" || overflowY === "scroll") {
                        return el;
                    }
                    el = el.parentElement;
                }
                return null;
            },

            _loadNextPage: async function (oTable) {
                var sNextUrl = this._nextUrl;

                if (!sNextUrl) return;

                var oModel = this.getView().getModel(this.getListViewDataSourceModelName());

                const url = sNextUrl.startsWith("http") ? sNextUrl : this.getCflBaseUrlForPagination() + sNextUrl;
                const response = await this.callApi('GET', url, '');

                const aNewResults = response["value"];
                const sNextLink = response[sNextUrl];

                let aExistingResults = oModel.getProperty("/value") || [];
                aExistingResults = aExistingResults.concat(aNewResults);

                oModel.setProperty('/value', aExistingResults);
                oModel.setProperty('/@odata.nextLink', sNextLink);
            },

            buildCflList: function () {
                // do NOT use this function - Ali
                let oDisplayColumn;
                let oDisplayColumnList = [];
                let oColumn;
                let oColumnList = [];
                let oController = this;

                // build Display Columns
                this.getCflDisplayColumns().forEach(sDisplayColumnText => {

                    let oLabel = new sap.m.Label({
                        text: sDisplayColumnText,
                    });

                    let oIcon = new sap.ui.core.Icon({
                        src: "sap-icon://filter",
                        color: sap.ui.core.IconColor.Default,
                        activeColor: sap.ui.core.IconColor.Positive,
                        press: function () {
                            let columnIndex = oDisplayColumnList.indexOf(oDisplayColumn);
                            oController.setCflSearchProperty(oController.getCflDataColumnList()[columnIndex]);
                        }
                    });

                    let oHBox = new sap.m.HBox({
                        items: [oLabel, oIcon]
                    });

                    let oDisplayColumn = new sap.m.Column({
                        header: oHBox
                    });

                    oDisplayColumnList.push(oDisplayColumn);
                });

                // build Column Cells
                this.getCflDataColumnList().forEach(oColumnText => {
                    if (oColumnText == "Edit") {
                        oColumn = new sap.m.Button({ icon: "sap-icon://navigation-right-arrow", press: this.onPressOfListViewEditButton.bind(this) });
                    }
                    else {
                        oColumn = new sap.m.Text({ text: "{" + this.getCflListViewDataSourceModelName() + ">" + oColumnText + "}" });
                    }

                    oColumnList.push(oColumn);
                });

                // Add Edit Icon
                let oEdit;
                //oColumnList.push(oEdit);

                let iValue = this.identifySystem(this.getCflDataSourceURL());
                let sBindObjectName = "";
                if (iValue == 1) {
                    sBindObjectName = "value";
                } else if (iValue == 2) {
                    sBindObjectName = "results";
                }
                else {
                    sBindObjectName = "value"
                }

                //build Table
                var oDialog = new sap.m.TableSelectDialog({

                    title: this.getCflTitle(),
                    columns: oDisplayColumnList,
                    items: {
                        path: this.getCflListViewDataSourceModelName() + ">/" + sBindObjectName,
                        template:
                            new sap.m.ColumnListItem({
                                cells:
                                    oColumnList
                            })
                    },

                    search: function (oEvent) {

                        var sValue = oEvent.getParameter("value");
                        var oBinding = oEvent.getSource().getBinding("items");

                        if (sValue.length > 0) {
                            var oFilter = new sap.ui.model.Filter(oController.getCflSearchProperty(), sap.ui.model.FilterOperator.Contains, sValue);

                            oBinding.filter([oFilter]);
                        }
                        else {
                            oBinding.filter([]);
                        }



                    },

                    confirm: function (oEvent) {

                        var oBinding = oEvent.getSource().getBinding("items");
                        oBinding.filter([]);

                        if (oController.getCflValueFor().length > 0 && oController.getCflValueFrom().length > 0) {
                            // to be written
                            let oCflValueFor = oController.getCflValueFor();
                            let oCflValueFrom = oController.getCflValueFrom();
                            let oValue = oEvent.getParameter("selectedContexts")[0].getObject()[oCflValueFrom];
                            oController.getView().getModel(oController.getEntryFormDataSourceModelName()).setProperty(oCflValueFor, oValue);

                        }

                        if (oController.getCflValueFor().length == 0 && oController.getCflValueFrom().length == 0 && oController.getCflDisplayFor().length > 0 && oController.getCflDisplayFrom().length > 0) {

                            let oCflDisplayFor = oController.getCflDisplayFor();
                            let oCflDisplayFrom = oController.getCflDisplayFrom();
                            let oValue = oEvent.getParameter("selectedContexts")[0].getObject()[oCflDisplayFrom];
                            //oController.byId(oCflDisplayFor).setValue(oValue);
                            sap.ui.getCore().byId(oCflDisplayFor).setValue(oValue);

                        }


                        if (oEvent.getParameter("selectedContexts").length == 1) {
                            oController.setCflObject(oEvent.getParameter("selectedContexts")[0].getObject());
                        }

                        if (oEvent.getParameter("selectedContexts").length > 1) {
                            oController.setCflObjectList(oEvent.getParameter("selectedContexts"));
                        }

                        oDialog.destroy();

                    },
                    cancel: function () {

                    }

                });

                var odata = this.getView().getModel(this.getCflListViewDataSourceModelName());

                oDialog.setModel(this.getView().getModel(this.getCflListViewDataSourceModelName()), this.getCflListViewDataSourceModelName());


                var oTableForm = new sap.ui.layout.form.SimpleForm({
                    title: this.getCflTitle(),
                    content: oDialog
                });

                return oDialog;

            },




            buildSearchForList: function () {

                let oSearchLabel;
                let oSearchControl;
                let oSearchObjList = [];

                this.getListViewFilterColumnList().forEach(oColumnObj => {
                    oSearchLabel = new sap.m.Label({ text: "{i18n>" + oColumnObj.pCaption + "}" });
                    //mansi
                    if (oColumnObj.pType == "Input" && !sap.ui.getCore().byId(oColumnObj.pControlId)) {
                        oSearchControl = new sap.m.Input(oColumnObj.pControlId, {});
                    }
                    else if (oColumnObj.pType == "DatePicker" && !sap.ui.getCore().byId(oColumnObj.pControlId)) {
                        oSearchControl = new sap.m.DatePicker(oColumnObj.pControlId, { valueFormat: "yyyy-MM-dd", displayFormat: this.returnDateFormat() });
                    }
                    else if (oColumnObj.pType == "Select" && !sap.ui.getCore().byId(oColumnObj.pControlId)) {
                        oSearchControl = new sap.m.Select(oColumnObj.pControlId, {});

                        oSearchControl.attachChange(eval("this." + oColumnObj.pMethodName + ".bind(this)"));
                    }
                    else if (oColumnObj.pType == "Cfl" && !sap.ui.getCore().byId(oColumnObj.pControlId)) {
                        oSearchControl = new sap.m.Input(oColumnObj.pControlId, { showValueHelp: true });

                        oSearchControl.attachValueHelpRequest(eval("this." + oColumnObj.pMethodName + ".bind(this)"));
                    }

                    if (oSearchLabel != undefined && oSearchControl != undefined) {
                        oSearchObjList.push(oSearchLabel, oSearchControl);
                    }
                });

                var oToolbar = new sap.m.Toolbar({
                    content: [
                        new sap.m.ToolbarSpacer(), // This will push the button to the right
                        new sap.m.Button({
                            text: "{i18n>GO}",
                            press: this.onPressOfListViewSearchButton.bind(this)
                        }),
                        new sap.m.Button({
                            text: "{i18n>RESET}",
                            press: this.onPressOfListViewResetButton.bind(this)
                        })
                    ]
                });

                var oSimpleForm = new sap.ui.layout.form.SimpleForm({
                    editable: true,
                    layout: sap.ui.layout.form.SimpleFormLayout.ColumnLayout,
                    columnsM: 3,
                    columnsL: 4,
                    columnsXL: 5,
                    content: [oSearchObjList]
                });

                var oVBox = new sap.m.VBox({
                    items: [oSimpleForm, oToolbar]
                });

                return oVBox;
            },

            showListView: async function (pageId) {

                let oSearchForm, oListForm;

                //build Search Form
                this.destroyAllControls(this.getPageId());//mansi
                oSearchForm = this.buildSearchForList();

                // build List Form
                oListForm = this.buildList();

                var oVBox = new sap.m.VBox({
                    items: [oSearchForm, oListForm]
                });

                var oListViewForm = new sap.ui.layout.form.SimpleForm({
                    title: this.getFormTitle(),
                    content: [oVBox]
                });

                //calling API before showing UI, as API will take some time to fetch data.
                if (this.getListViewDataSourceURL().length > 0) {
                    await this.populateListView(this.getListViewDataSourceURLType(), this.getListViewDataSourceURLReqData());
                }

                this.getView().byId(pageId).addContent(oListViewForm);

            },

            buildCfl: function () {

                // do NOT use this function - Ali
                let oSearchForm, oListForm;

                //build Search Form
                //oSearchForm = this.buildSearchForCflList();

                // build List Form
                oListForm = this.buildCflList();

                //calling API before showing UI, as API will take some time to fetch data.
                if (this.getCflDataSourceURL().length > 0) {
                    this.populateCflUsingApi("GET", "");
                }


                return oListForm;

            },



            loadCfl: function () {
                // do NOT use this function - Ali
                this.buildCfl().open();
            },

            clearGenericListViewForm: function () {
                // to clear all properties of generic List View form
                this.clearBase();

                this.createNewModel(this.getCflListViewDataSourceModelName())
                this.createNewModel(this.getListViewDataSourceModelName());
            },

            showNotification: async function () {
                let loginInfo = this.getLoginInfo();
                let userid = loginInfo.UserID;
                let beforeModelName = 'BeforeNotificationModel';
                await this.createNewModelUsingAPI(
                    'GET',
                    `/odata/v4/stoneman-crf/TNotification?$filter=User_UserGuid eq ${userid} and Clear eq false&$orderby=DateTime desc`,
                    '',
                    beforeModelName
                );
                const notificationResponse = this.getView().getModel(beforeModelName);
                if (!notificationResponse) {
                    console.error('Notification model not found');
                    return;
                }
                const apiResponse = notificationResponse.oData.value;
                const oNotificationsModel = {
                    notifications: apiResponse.map((notification) => ({
                        NotificationID: notification.NotificationID,
                        DateTime: notification.DateTime,
                        DateTimeAgo: this.timeAgo(notification.DateTime),
                        Task: notification.NotificatoinMessage,
                        DocumentNo: notification.DocumentNo,
                        DocumentGUID: notification.DocumentGUID,
                        FormType: notification.MenuDesc,
                        Read: notification.Read,
                        Status: notification.Status
                    }))
                };
                let sModelName = 'notificationModel';
                this.createNewModelUsingArray(sModelName, oNotificationsModel);
                let sPath = 'notifications';
                let oDisplayColumnList = [];
                let oColumn;
                let oColumnList = [];
                let oController = this;
                let DisplayColumns = ['FormType', 'DocumentNo'];
                // build Display Columns
                DisplayColumns.forEach((sDisplayColumnText) => {
                    let oLabel = new sap.m.Label({
                        text: sDisplayColumnText
                    });

                    let oIcon = new sap.ui.core.Icon({
                        src: 'sap-icon://filter',
                        color: sap.ui.core.IconColor.Default,
                        activeColor: sap.ui.core.IconColor.Positive
                        // press: function () {
                        //   let columnIndex = oDisplayColumnList.indexOf(oDisplayColumn);
                        //   oController.setCflSearchProperty(oController.getCflDataColumnList()[columnIndex]);
                        // }
                    });

                    let oHBox = new sap.m.HBox({
                        items: [oLabel, oIcon]
                    });

                    let oDisplayColumn = new sap.m.Column({
                        header: oHBox
                    });

                    oDisplayColumnList.push(oDisplayColumn);
                });

                DisplayColumns.forEach((oColumnObj) => {
                    oColumn = new sap.m.Text({ text: '{' + sModelName + '>' + oColumnObj + '}' });
                    var oHBox = new sap.m.HBox({
                        items: [oColumn],
                        alignContent: sap.m.FlexAlignContent.Left,
                        alignItems: sap.m.FlexAlignItems.Left
                    });
                    oColumnList.push(oHBox);
                });

                // Function to create a dynamic SelectDialog with footer buttons

                var oDialog = new sap.m.Dialog({
                    title: 'Notifications',
                    stretch: true,
                    content: [
                        new sap.m.List({
                            items: {
                                path: sModelName + '>/' + sPath,
                                template: new sap.m.NotificationListItem({
                                    title: '{' + sModelName + '>FormType} ({' + sModelName + '>DocumentNo})',
                                    datetime: '{' + sModelName + '>DateTimeAgo}',
                                    description: '{' + sModelName + '>Task}',
                                    unread: '{= !${' + sModelName + '>Read}}',
                                    press: this.onNotificationPress.bind(this),
                                    class: '{= ${' + sModelName + '>Read} ? readNotification : unreadNotification } notificationListItem',
                                    close: this.onClearNotificationPress.bind(this)
                                })
                            }
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: 'Read All',
                            press: this.onReadAllPress.bind(this),
                            visible: '{= ${notificationModel>/notifications}.length > 0}'
                        }),
                        new sap.m.Button({
                            text: 'Clear All',
                            press: this.onClearAllPress.bind(this),
                            visible: '{= ${notificationModel>/notifications}.length > 0}'
                        }),
                        new sap.m.Button({
                            text: 'Close',
                            press: function () {
                                oDialog.close();
                            }
                        })
                    ]
                });

                // Set the model to the dialog
                oDialog.setModel(this.getView().getModel(sModelName), sModelName);

                return oDialog.open();
            },

            // handleLogOut: function () {
            //     sap.m.MessageToast.show('Logging out...');
            //     this.deleteRoleDetails();
            //     this.deleteLoginInfo();
            //     this.deleteSecurityDetails();
            //     this.deleteLoginUserDetails();
            //     this.deleteLoginUserDetails();
            //     //this.clearUserModel();
            //     sap.ui.core.UIComponent.getRouterFor(this).navTo('RouteLogin');
            // },

            getDateFromatIn_ddMMyyyy_HHmm: function (oDate) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-ddTHH:mm:ss",// Format for date and time
                    UTC: true
                });
                var date = new Date(oDate);  // Create a Date object
                var cDate = oDateFormat.format(date);  // Format the date and time
                return cDate;
            },

            timeAgo: function (date) {
                const now = new Date();
                const dt = this.getDateFromatIn_ddMMyyyy_HHmm(date)
                const notificationDate = new Date(dt);
                const diffInSeconds = Math.floor((now - notificationDate) / 1000);

                const intervals = {
                    year: 31536000,
                    month: 2592000,
                    week: 604800,
                    day: 86400,
                    hour: 3600,
                    minute: 60,
                    second: 1
                };

                for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                    const interval = Math.floor(diffInSeconds / secondsInUnit);
                    if (interval >= 1) {
                        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
                    }
                }
                const apiResponse = notificationResponse.oData.value;
                const oNotificationsModel = {
                    notifications: apiResponse.map((notification) => ({
                        NotificationID: notification.NotificationID,
                        DateTime: notification.DateTime,
                        DateTimeAgo: this.timeAgo(notification.DateTime),
                        Task: notification.NotificatoinMessage,
                        DocumentNo: notification.DocumentNo,
                        DocumentGUID: notification.DocumentGUID,
                        FormType: notification.MenuDesc,
                        Read: notification.Read,
                        Status: notification.Status
                    }))
                };
                let sModelName = 'notificationModel';
                this.createNewModelUsingArray(sModelName, oNotificationsModel);
                let sPath = 'notifications';
                let oDisplayColumnList = [];
                let oColumn;
                let oColumnList = [];
                let oController = this;
                let DisplayColumns = ['FormType', 'DocumentNo'];
                // build Display Columns
                DisplayColumns.forEach((sDisplayColumnText) => {
                    let oLabel = new sap.m.Label({
                        text: sDisplayColumnText
                    });

                    let oIcon = new sap.ui.core.Icon({
                        src: 'sap-icon://filter',
                        color: sap.ui.core.IconColor.Default,
                        activeColor: sap.ui.core.IconColor.Positive
                        // press: function () {
                        //   let columnIndex = oDisplayColumnList.indexOf(oDisplayColumn);
                        //   oController.setCflSearchProperty(oController.getCflDataColumnList()[columnIndex]);
                        // }
                    });

                    let oHBox = new sap.m.HBox({
                        items: [oLabel, oIcon]
                    });

                    let oDisplayColumn = new sap.m.Column({
                        header: oHBox
                    });

                    oDisplayColumnList.push(oDisplayColumn);
                });

                DisplayColumns.forEach((oColumnObj) => {
                    oColumn = new sap.m.Text({ text: '{' + sModelName + '>' + oColumnObj + '}' });
                    var oHBox = new sap.m.HBox({
                        items: [oColumn],
                        alignContent: sap.m.FlexAlignContent.Left,
                        alignItems: sap.m.FlexAlignItems.Left
                    });
                    oColumnList.push(oHBox);
                });

                // Function to create a dynamic SelectDialog with footer buttons

                var oDialog = new sap.m.Dialog({
                    title: 'Notifications',
                    stretch: true,
                    content: [
                        new sap.m.List({
                            items: {
                                path: sModelName + '>/' + sPath,
                                template: new sap.m.NotificationListItem({
                                    title: '{' + sModelName + '>FormType} ({' + sModelName + '>DocumentNo})',
                                    datetime: '{' + sModelName + '>DateTimeAgo}',
                                    description: '{' + sModelName + '>Task}',
                                    unread: '{= !${' + sModelName + '>Read}}',
                                    press: this.onNotificationPress.bind(this),
                                    class: '{= ${' + sModelName + '>Read} ? readNotification : unreadNotification } notificationListItem',
                                    close: this.onClearNotificationPress.bind(this)
                                })
                            }
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: 'Read All',
                            press: this.onReadAllPress.bind(this),
                            visible: '{= ${notificationModel>/notifications}.length > 0}'
                        }),
                        new sap.m.Button({
                            text: 'Clear All',
                            press: this.onClearAllPress.bind(this),
                            visible: '{= ${notificationModel>/notifications}.length > 0}'
                        }),
                        new sap.m.Button({
                            text: 'Close',
                            press: function () {
                                oDialog.close();
                            }
                        })
                    ]
                });

                // Set the model to the dialog
                oDialog.setModel(this.getView().getModel(sModelName), sModelName);

                return oDialog.open();

            },

            handleLogOut: function () {
                sap.m.MessageToast.show('Logging out...');
                this.deleteRoleDetails();
                this.deleteLoginInfo();
                this.deleteSecurityDetails();
                this.deleteLoginUserDetails();
                //this.clearUserModel();
                sap.ui.core.UIComponent.getRouterFor(this).navTo('RouteLogin');
            },

            timeAgo: function (date) {
                const now = new Date();
                const notificationDate = new Date(date);
                const diffInSeconds = Math.floor((now - notificationDate) / 1000);

                const intervals = {
                    year: 31536000,
                    month: 2592000,
                    week: 604800,
                    day: 86400,
                    hour: 3600,
                    minute: 60,
                    second: 1
                };

                for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                    const interval = Math.floor(diffInSeconds / secondsInUnit);
                    if (interval >= 1) {
                        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
                    }
                }

                return 'just now';
            },

            getNotificationRequestObj: function (aNotifications, isRead, isClear) {
                return {
                    NotificationData: aNotifications.map((notification) => ({
                        NotificationID: notification?.NotificationID,
                        Read: isRead,
                        Clear: isClear
                    }))
                };
            },

            updateNotificationCount: function (modelName) {
                let filterData = [];
                let oData = this.getView().getModel(modelName).getData();
                if (oData !== undefined) {
                    filterData = oData.value.filter(function (result) {
                        return result.Read === true;
                    });
                }

                try {
                    const viewModel = this.getView().getModel('shellBarModel');
                    viewModel.setProperty(`/menu`, true);
                    viewModel.setProperty(`/notification`, true);
                    viewModel.setProperty(`/logout`, true);
                    viewModel.setProperty(`/notificationsCount`, filterData.length);
                    viewModel.refresh();
                } catch (error) {
                    console.log('handleRouteLandingMenu Error :', error);
                }
            },

            onClearNotification: async function (oNotificationData) {
                await this.createNewModelUsingAPI(
                    'POST',
                    `/odata/v4/stoneman-crf/AlterNotificationClear`,
                    oNotificationData,
                    'alternotificationresponsemodel'
                );

                this.updateNotificationCount("alternotificationresponsemodel");
            },

            onReadAllPress: async function () {
                let oModel = this.getView().getModel('notificationModel');
                if (!oModel) {
                    console.error('Notification model not found');
                    return;
                }
                let aNotifications = oModel.getProperty('/notifications');

                aNotifications.forEach((notification) => {
                    notification.Read = true;
                });

                oModel.setProperty('/notifications', aNotifications);

                const oRequestData = this.getNotificationRequestObj(aNotifications, true, false);

                await this.onClearNotification(oRequestData);
            },

            onClearAllPress: function () {
                let oModel = this.getView().getModel('notificationModel');
                if (!oModel) {
                    console.error('Notification model not found');
                    return;
                }
                let aNotifications = oModel.getProperty('/notifications');

                const oRequestData = this.getNotificationRequestObj(aNotifications, true, true);
                oModel.setProperty('/notifications', []);

                this.onClearNotification(oRequestData);
                sap.m.MessageToast.show('All notifications have been cleared.');
            },

            onClearNotificationPress: async function (oEvent) {
                let oContext = oEvent.getSource().getBindingContext('notificationModel');
                let sPath = oContext.getPath();
                let oModel = this.getView().getModel('notificationModel');
                if (!oModel) {
                    console.error('Notification model not found');
                    return;
                }
                let aNotifications = oModel.getProperty('/notifications');
                let iIndex = parseInt(sPath.split('/')[2], 10);

                let notificationId = aNotifications[iIndex].NotificationID;
                aNotifications.splice(iIndex, 1);
                oModel.setProperty('/notifications', aNotifications);

                let oRequestData = this.getNotificationRequestObj(
                    [
                        {
                            NotificationID: notificationId
                        }
                    ],
                    true,
                    true
                );

                this.onClearNotification(oRequestData);
                sap.m.MessageToast.show('Notification removed.');
            },

            onNotificationPress: async function (oEvent) {
                let oContext = oEvent.getSource().getBindingContext('notificationModel');
                let sNotificationId = oContext.getProperty('NotificationID');
                let oModel = this.getView().getModel('notificationModel');
                if (!oModel) {
                    console.error('Notification model not found');
                    return;
                }
                let aNotifications = oModel.getProperty('/notifications');

                let readNotification = aNotifications.find((notification) => notification.NotificationID === sNotificationId);

                if (readNotification && !readNotification.Read) {
                    aNotifications.forEach((notification) => {
                        if (notification.NotificationID === sNotificationId) {
                            notification.Read = true;
                            notification.Clear = false;
                        }
                    });

                    oModel.setProperty('/notifications', aNotifications);

                    let readNotification = aNotifications.find((notification) => notification.NotificationID === sNotificationId);
                    if (readNotification) {
                        let oRequestData = {
                            NotificationData: [
                                {
                                    NotificationID: sNotificationId,
                                    Read: true,
                                    Clear: false
                                }
                            ]
                        };

                        await this.onClearNotification(oRequestData);
                    }
                }
            }

        });
    });
