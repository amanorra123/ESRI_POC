sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("fioriui5app.controller.App", {
      onInit() {
        this._loadSysModel();
      },

      _loadSysModel: function () {
        let oModel = new sap.ui.model.json.JSONModel();
        oModel.loadData('model/sysmodel.json');
        this.getView().setModel(oModel, 'sysModel');
      },
  });
});