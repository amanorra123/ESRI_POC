sap.ui.define([
    "core/generic/genericentryformfunctions",
    "sap/ui/core/mvc/Controller"
],
    function (genericentryformfunctions) {
        "use strict";

        return genericentryformfunctions.extend("coregeneric.genericentryform", {

            onInit: function () {
                genericentryformfunctions.prototype.onInit.apply(this, arguments);

                this.router = sap.ui.core.UIComponent.getRouterFor(this);

            },

            /*

            onBeforeShow: function () {
                
                var aChildViews = this.getView().findAggregatedObjects(true, function (oControl) {
                    return oControl instanceof sap.ui.core.mvc.View;
                });

                aChildViews.forEach(function (oChildView) {
                    var oChildController = oChildView.getController();
                    if (oChildController && typeof oChildController.onBeforeShow === "function") {
                        oChildController.onBeforeShow();
                    }
                });
                
            },
            */

            onPressOfEntryFormCancelButton: function () {
                this.clearGenericEntryForm();
                this.router.navTo(this.getBackwardRoute());


            },

            onPressOfEntryFormSaveButton: async function (oReqData) {
               // alert("save");

                let sFormMode = this.getFormMode();
                let sEntryFormSaveURL = "";
                let sType = "POST"

                if (sFormMode == "2") {
                    sEntryFormSaveURL = this.getEntryFormDataSourceURLToUpdateData();
                    sType = "PATCH"
                }
                else if (sFormMode == "3") {
                    sEntryFormSaveURL = this.getEntryFormDataSourceURLToAddData();
                    sType = "POST"
                }

                //let oSaveModel = this.getView().getModel(this.getEntryFormDataSourceModelName());

               await this.saveEntryForm(sType, sEntryFormSaveURL, oReqData);

                //on Sucess Clear everything
              //  this.clearGenericEntryForm(); //mansi
                
            },

        });
    });
