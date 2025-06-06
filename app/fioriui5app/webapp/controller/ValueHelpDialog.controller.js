sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',

], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("fioriui5app.controller.ValueHelpDialog", {
        constructor: function (oView, title, from) {
            this._oView = oView;
        },
    });
});