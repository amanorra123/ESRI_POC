sap.ui.define([
    "core/generic/genericlistviewfunctions",
    "sap/ui/core/mvc/Controller"
],
    function (genericlistviewfunctions) {
        "use strict";

        return genericlistviewfunctions.extend("coregeneric.genericlistview", {

            onInit: function () {
                genericlistviewfunctions.prototype.onInit.apply(this, arguments);

                //alert("Generic List View");
                this.router = sap.ui.core.UIComponent.getRouterFor(this);

            },

            /*
            onBeforeShow: function (oEvent) {
                
            },
            */

            onPressOfListViewSettingButton: function (oEvent) {
                //alert("work pending on Setting");
            },

            onPressOfListViewPrintButton: function (oEvent) {
                //alert("work pending on Print");
            },

            onPressOfListViewEditButton: function (oEvent) {
                var oItem = oEvent.getSource();

                var oContext = oItem.getBindingContext(this.getListViewDataSourceModelName());

                // Get the complete row or object
                let oRowObject = oContext.getProperty("");

                this.setListViewEditPropertyObject(oRowObject);
                // Do something with the value
                //console.log("Clicked row value:", sValue);

                //this.router.navTo(this.getForwardRoute());


                //0 - Find
                //1 - Ok
                //2- Edit/Update
                //3 - Add
                //4 - View
                //5 - Print
                //7 - Archive

                let obj = {
                    "formMode": 2,
                    "uniqueId": this.getListViewEditPropertyValue()
                };
                this.clearGenericListViewForm();
                this.destroyAllControls(this.getPageId());
                this.setRouteData("2", this.getListViewEditPropertyValue());
                this.router.navTo(this.getForwardRoute());
            },

            onPressOfListViewSearchButton: function () {
                //alert("search");

                let sUrl = "";
                let oreqData = this.getListViewDataSourceURLReqData();


                this.getListViewFilterColumnList().forEach(oColumnObj => {

                    let oInp = sap.ui.getCore().byId(oColumnObj.pControlId);
                    let sDataType = "";
                    let sValue = "";
                    let iValue = 0;

                    let oType = oInp.getMetadata().getName();

                    if (oType == "sap.m.Input" || oType == "sap.m.DatePicker") {

                        sValue = oInp.getValue();
                        if ( oInp.data("data-displayHidden") !== undefined &&  oInp.data("data-displayHidden") !== null  ) {

                            if ( oInp.data("data-displayHidden").length > 0 ) {

                                   
                                sValue=  oInp.data("data-displayHidden");
                           }
                        }
                       
                     


                    }
                    else if (oType == "sap.m.Select") {
                        if (oInp.getSelectedIndex() >= 0) {
                            sValue = oInp.getSelectedKey();
                        }
                    }


                    if (sValue.length > 0) {

                        if (oColumnObj.pDataType == "String") {
                            sDataType = "'"
                            this.setPropertyValue(oreqData, oColumnObj.pAttributeName, sValue);
                        }
                        else if (oColumnObj.pDataType == "Date") {
                            sDataType = ""
                            let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
                            var date = oDateFormat.parse(sValue);
                            var sFormattedDate = oDateFormat.format(date);
                            this.setPropertyValue(oreqData, oColumnObj.pAttributeName, sFormattedDate);
                        }
                        else {
                            sDataType = ""
                            iValue = Number(sValue);
                            this.setPropertyValue(oreqData, oColumnObj.pAttributeName, iValue);
                        }

                        if (oColumnObj.pOperator == "eq" || oColumnObj.pOperator == "ge") {
                            // need to implement pDatatype
                            sUrl += oColumnObj.pAttributeName + " " + oColumnObj.pOperator + " " + sDataType + sValue + sDataType + " and ";


                        }
                        else if (oColumnObj.pOperator == "contains") {

                            sUrl += " " + oColumnObj.pOperator + "(" + oColumnObj.pAttributeName + "," + sDataType + sValue + sDataType + ") and ";

                        }

                    }


                });

                sUrl = sUrl.substring(0, sUrl.length - 4);
                sUrl = sUrl.trim();
                if (this.getListViewDataSourceURL().length > 0) {
                    if (this.getListViewDataSourceURLType() == "GET") {
                        let orderBy = "";
                        if (this.getListViewDataSourceURL().includes("&$orderby")) {
                            orderBy = this.getListViewDataSourceURL().substring(this.getListViewDataSourceURL().indexOf("&$orderby"), this.getListViewDataSourceURL().length);

                        }
                        if (this.getListViewDataSourceURL().includes("?")) {
                            this.setListViewDataSourceURL(this.getListViewDataSourceResetURL() + "&$filter=" + sUrl + orderBy);
                        } else {
                            this.setListViewDataSourceURL(this.getListViewDataSourceResetURL() + "?$filter=" + sUrl + orderBy);
                        }
                    }
                    else {
                        this.setListViewDataSourceURL(this.getListViewDataSourceResetURL());
                        this.setListViewDataSourceURLReqData(oreqData);
                    }

                    this.populateListView(this.getListViewDataSourceURLType(), this.getListViewDataSourceURLReqData());
                }

            },

            onPressOfListViewResetButton: function () {
                //alert("Reset");

                this.getListViewFilterColumnList().forEach(oColumnObj => {

                    let oInp = sap.ui.getCore().byId(oColumnObj.pControlId);
                    let oType = oInp.getMetadata().getName();

                    if (oType === 'sap.m.Input' || oType === 'sap.m.DatePicker') {
                        oInp.setValue("");
                        oInp.data("data-displayHidden", "");
                          
                    } else if (oType === 'sap.m.Select') {
                        if (oInp.getSelectedIndex() >= 0) {
                            oInp.unbindProperty('selectedKey'); // Unbind the selectedKey property
                            oInp.setSelectedKey(''); // Reset the selection after unbinding
                            //oInp.getBinding("selectedKey").setValue(null);
                        }
                    }

                });

                if (this.getListViewDataSourceURL().length > 0) {
                    if (this.getListViewDataSourceURLType() == "GET") {
                        this.setListViewDataSourceURL(this.getListViewDataSourceResetURL());
                    }
                    else {
                        this.setListViewDataSourceURL(this.getListViewDataSourceResetURL());
                        let copiedObject = Object.assign({}, this.getListViewDataSourceURLResetReqData());
                        this.setListViewDataSourceURLReqData(copiedObject);
                    }

                    this.populateListView(this.getListViewDataSourceURLType(), this.getListViewDataSourceURLReqData());
                }

            },

            onPressOfListViewNewButton: function () {
                // alert("new button");

                //0 - Find
                //1 - Ok
                //2- Edit/Update
                //3 - Add / New
                //4 - View
                //5 - Print
                //7 - Archive

                let obj = {
                    "formMode": 3,
                    "uniqueId": ""
                };
                this.setRouteData("3", "");
                this.clearGenericListViewForm();
                this.destroyAllControls(this.getPageId());
                this.router.navTo(this.getForwardRoute())


            },

            onPressOfListViewBackButton: function () {
                this.clearGenericListViewForm();
                this.destroyAllControls(this.getPageId());
                this.router.navTo(this.getBackwardRoute());

            },

        });
    });
