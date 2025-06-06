/*global QUnit*/

sap.ui.define([
	"fioriui5app/controller/RRDashboard.controller"
], function (Controller) {
	"use strict";

	QUnit.module("RRDashboard Controller");

	QUnit.test("I should test the RRDashboard controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
