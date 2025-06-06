sap.ui.define(
  ['core/base/baseproperties', 'sap/ui/core/BusyIndicator', 'sap/ui/core/mvc/Controller', 'sap/m/MessageBox'],
  function (baseproperties, BusyIndicator, Controller, MessageBox) {
    'use strict';
    var oBusyIndicator;
    return baseproperties.extend('corebase.basefunctions', {
      onInit: function () {
        baseproperties.prototype.onInit.apply(this, arguments);
        //alert("Base functions ");
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        oBusyIndicator = BusyIndicator;
      },

      getFormTitle: function () {
        return this.pFormTitle;
      },

      setFormTitle: function (value) {
        this.pFormTitle = value;
      },

      getFormSubTitle: function () {
        return this.pFormSubTitle;
      },

      setFormSubTitle: function (value) {
        this.pFormSubTitle = value;
      },

      getFormMode: function () {
        return this.pFormMode;
      },

      setFormMode: function (value) {
        this.pFormMode = value;
      },

      callApi: function (type, url, reqData, showLoader = true) {
        const oSysModel = this.getSecurityDetails()
        if (showLoader) {
          oBusyIndicator.show(0);
        }
        let oRequestData = '';

        if (typeof reqData === 'undefined') {
          oRequestData = '';
        }

        if (typeof reqData !== 'undefined') {
          if (reqData !== '') {
            oRequestData = JSON.stringify(reqData);
          }
        }

        const apiHandler = this;
        return new Promise(function (resolve, reject) {
          $.ajax({
            url: url,
            method: type,
            data: oRequestData,
            timeout: 60000,  //trupti
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            async: true,

            headers: {
              "key": (oSysModel) ? oSysModel.accessToken : "abc"
            },
            xhrFields: {
              withCredentials: true
            },
            cors: [
              {
                enabled: false
              }
            ],

            success: function (data) {
              // Check if setApiResponseObject is available in the current scope
              console.log(data);
              apiHandler.setApiResponseObject(true, data);
              oBusyIndicator.hide();
              resolve(data);
            }.bind(this),

            error: function (error) {
              // Handle error
              console.error(error);
              oBusyIndicator.hide();
              apiHandler.setApiResponseObject(false, error);
              reject(error);
            }.bind(this)
          });
        });
      },

      getListViewEditProperty: function () {
        return this.pEditProperty;
      },

      setListViewEditProperty: function (value) {
        this.pEditProperty = value;
      },

      getListViewEditPropertyValue: function () {
        return this.pEditPropertyValue;
      },

      setListViewEditPropertyValue: function (value) {
        this.pEditPropertyValue = value;
      },

      getListViewEditPropertyObject: function () {
        return this.pEditPropertyObject;
      },

      setListViewEditPropertyObject: function (value) {
        this.pEditPropertyObject = value;
        this.setListViewEditPropertyValue(this.pEditPropertyObject[this.getListViewEditProperty()]);
      },

      getCflTitle: function () {
        return this.pCflTitle;
      },

      setCflTitle: function (value) {
        this.pCflTitle = value;
      },

      getCflValueId: function () {
        return this.pCflValueId;
      },

      getCflValueIdFor: function () {
        return this.pCflValueIdFor;
      },

      setCflValueId: function (valuex, valuey) {
        this.pCflValueIdFor = valuex;
        this.pCflValueId = valuey;
      },

      getCflValueDisplay: function () {
        return this.pCflValueDisplay;
      },

      getCflValueDisplayFor: function () {
        return this.pCflValueDisplayFor;
      },

      getCflValueFor: function () {
        return this.pCflValueFor;
      },

      getCflValueFrom: function () {
        return this.pCflValueFrom;
      },

      getCflDisplayFor: function () {
        return this.pCflDisplayFor;
      },

      getCflDisplayFrom: function () {
        return this.pCflDisplayFrom;
      },
      getCflDisplayHidden: function () {
        return this.pCflDisplayHidden;
      },

      setCflValueAndDisplay: function (valueFor, valueFrom, displayFor, displayFrom, displayHidden) {
        this.pCflValueFor = valueFor;
        this.pCflValueFrom = valueFrom;
        this.pCflDisplayFor = displayFor;
        this.pCflDisplayFrom = displayFrom;
        this.pCflDisplayHidden = displayHidden;
      },

      getListViewDataSourceModelName: function () {
        return this.pListViewDataSourceModelName;
      },

      /*
            setListViewDataSourceModelName: function (value) {
                this.pListViewDataSourceModelName = value;
            },
            */

      getEntryFormDataSourceModelName: function () {
        return this.pEntryFormDataSourceModelName;
      },

      /*
            setEntryFormDataSourceModelName: function (value) {
                this.pEntryFormDataSourceModelName = value;
            },
            */

      getCflListViewDataSourceModelName: function () {
        return this.pCflListViewDataSourceModelName;
      },

      setCflListViewDataSourceModelName: function (value) {
        this.createNewModel(value);
      },

      getCflSearchProperty: function () {
        return this.pCflSearchProperty;
      },

      setCflSearchProperty: function (value) {
        this.pCflSearchProperty = value;
      },

      getCflValue: function () {
        return this.pCflValue;
      },

      setCflValue: function (value) {
        this.pCflValue = value;
      },

      getCflObject: function () {
        return this.pCflObject;
      },

      setCflObject: function (value) {
        this.pCflObject = value;
      },

      getCflObjectList: function () {
        return this.pCflObjectList;
      },

      setCflObjectList: function (value) {
        this.pCflObjectList = value;
      },

      getCflDisplayColumns: function () {
        return this.pCflDisplayColumnList;
      },

      setCflDisplayColumns: function (value) {
        this.pCflDisplayColumnList = value;
      },

      getCflDataColumnList: function () {
        return this.pCflColumnList;
      },

      setCflDataColumns: function (value) {
        this.pCflColumnList = value;
      },

      getCflObjectList: function () {
        return this.pCflObjectList;
      },

      setCflConfig: function (value) {
        this.pCflConfig = value;
      },

      setCflSingleSelect: function (value) {
        this.pCflConfig = value;
      },

      setCflMultiSelect: function (value) {
        this.pCflConfig = value;
      },

      getListViewFilterColumnList: function () {
        return this.pFilterColumnList;
      },

      setListViewFilterColumn: function (aControlId, aCaption, aType, aOperator, aDataType, aAttributeName, aMethodName) {
        this.pFilterObj = {
          pControlId: aControlId,
          pCaption: aCaption,
          pType: aType,
          pOperator: aOperator,
          pDataType: aDataType,
          pAttributeName: aAttributeName,
          pMethodName: aMethodName
        };

        this.pFilterColumnList.push(this.pFilterObj);
      },

      prepareData: function (aUrl, oResponse) {
        //debugger;
        if (this.getResponsePath() == "") {
          let iValue = this.identifySystem(aUrl);
 
          if (iValue == 1) {
            return oResponse;
          } else if (iValue == 2) {
            return oResponse.d;[]
          } else {
            return '';
          }
         
        }
        else {
          let responsePath = this.getResponsePath();
          this.setResponsePath("");
          return eval(responsePath);
        }
 
      },

      identifySystem: function (value) {
        let sValue = value.substring(0, 6);

        if (sValue == '/odata') {
          return 1;
        } else if (sValue == '/sap/o') {
          return 2;
        } else {
          return 3;
        }
      },

      onPressOfFormBackButton: function () {
        this.router.navTo(this.getBackwardRoute());
      },

      getPageId: function () {
        return this.pPageId;
      },

      setPageId: function (value) {
        this.pPageId = value;
      },

      clearBase: function () {
        this.pFilterColumnList = [];

        // to clear all properties of Base form
        // Function to destroy all controls in the page

        //this.destroyAllControls(this.getPageId());
      },

      destroyAllControls: function (sPage) {
        let oPage = this.getView().byId(sPage);
        var aContent = oPage.getContent();
        aContent.forEach(function (oControl) {
          oControl.destroy();
        });
      },

      validateAccess: function () {
        let oSecurityDetails = this.getSecurityDetails();
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        if (oSecurityDetails === 'undefined' || oSecurityDetails === null) {
          this.router.navTo('RouteLogin');
        } else {
          if (oSecurityDetails.accessToken.length == 0) {
            this.router.navTo('RouteLogin');
          }
        }
      },

      getLoginUserDetails: function () {
        let sUserDetails = sessionStorage.getItem('userDetails');

        if (sUserDetails) {
          const decryptedData = this.decryptData(sUserDetails, this.getSecretKey());
          return JSON.parse(decryptedData);
        }

        return null;
      },

      setLoginUserDetails: function (sUserId, sUserName) {
        const oModel = this.getView().getModel('sysModel');

        const userDetails = {
          userId: sUserId,
          userName: sUserName
        };

        const encryptedUserDetails = this.encryptData(JSON.stringify(userDetails), this.getSecretKey());

        oModel.setProperty('/userDetails', userDetails);
        sessionStorage.setItem('userDetails', encryptedUserDetails);
        this.getView().setModel(oModel, 'sysModel');
      },

      deleteLoginUserDetails: function () {
        sessionStorage.removeItem('userDetails');
      },

      deleteLoginRouteData: function () {
        sessionStorage.removeItem('routedata');
      },

      getSecurityDetails: function () {
        let sSecurityDetails = sessionStorage.getItem('security');

        if (sSecurityDetails) {
          const decryptedData = this.decryptData(sSecurityDetails, this.getSecretKey());
          return JSON.parse(decryptedData);
        }

        return null;
      },

      setSecurityDetails: function (sSessionId, sAccessToken) {
        const oModel = this.getView().getModel('sysModel');

        const securityDetails = {
          sessionId: sSessionId,
          accessToken: sAccessToken
        };

        const encryptedSecurityDetails = this.encryptData(JSON.stringify(securityDetails), this.getSecretKey());

        oModel.setProperty('/security', securityDetails);
        sessionStorage.setItem('security', encryptedSecurityDetails);

        this.getView().setModel(oModel, 'sysModel');
      },

      deleteSecurityDetails: function () {
        sessionStorage.removeItem('security');
      },

      getRouteData: function () {
        let oModel;
        let oRouteData;
        oModel = this.getView().getModel('sysModel');

        //mansi
        let savedData = sessionStorage.getItem("routedata");
        if (savedData) {
          oModel.setData(JSON.parse(savedData), 'sysModel');
        }
        //
        oRouteData = oModel.getProperty('/route/routeData');
        return oRouteData;
      },

      setRouteData: function (sFormMode, sUniqueId) {
        let oModel;
        oModel = this.getView().getModel('sysModel');
        //alert(JSON.stringify(oModel));
        oModel.setProperty('/route/routeData/formMode', sFormMode);
        oModel.setProperty('/route/routeData/uniqueId', sUniqueId);
        this.getView().setModel(oModel, 'sysModel');

        sessionStorage.setItem("routedata", JSON.stringify(oModel.getData()));//mansi

      },

      getCustomData: function () {
        let oModel;
        let oRouteData;
        oModel = this.getView().getModel('sysModel');

        oRouteData = oModel.getProperty('/customData');

        return oRouteData;
      },

      setCustomData: function (oCustomData) {
        let oModel;

        oModel = this.getView().getModel('sysModel');
        //alert(JSON.stringify(oModel));
        oModel.setProperty('/customData', oCustomData);

        this.getView().setModel(oModel, 'sysModel');
      },

      setPropertyValue: function (obj, propertyName, value) {
        if (obj.hasOwnProperty(propertyName)) {
          obj[propertyName] = value;
        } else {
          console.log('Property not found in the object.');
        }
      },

      isObjectEmpty: function (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
      },

      getLoginInfo: function () {
        let sStoredDetails = sessionStorage.getItem('loginInfo');

        if (sStoredDetails) {
          const decryptedData = this.decryptData(sStoredDetails, this.getSecretKey());
          const parsedData = JSON.parse(decryptedData);
          return parsedData;
        }

        return null;
      },

      setLoginInfo: function (
        sUserId,
        sUsername,
        sUsercode,
        sDepartmentCode,
        sDepartmentName,
        sIsActive,
        sFirstName,
        sLastName,
        sEmailId,
        sEmployeeCode,
        sRole_RoleGuid
      ) {
        const oModel = this.getView().getModel('sysModel');

        const oLoginInfo = {
          UserID: sUserId,
          Username: sUsername,
          Usercode: sUsercode,
          DepartmentCode: sDepartmentCode,
          DepartmentName: sDepartmentName,
          IsActive: sIsActive,
          FirstName: sFirstName,
          LastName: sLastName,
          EmailId: sEmailId,
          EmployeeCode: sEmployeeCode,
          RoleGuid: sRole_RoleGuid
        };

        const encryptedLoginInfo = this.encryptData(JSON.stringify(oLoginInfo), this.getSecretKey());

        oModel.setProperty('/loginInfo', oLoginInfo);
        sessionStorage.setItem('loginInfo', encryptedLoginInfo);

        this.getView().setModel(oModel, 'sysModel');
      },

      deleteLoginInfo: function () {
        sessionStorage.removeItem('loginInfo');
      },

      getRoleDetails: function () {
        let roleDetails = sessionStorage.getItem('roleDetails');

        if (roleDetails) {
          const decryptedData = this.decryptData(roleDetails, this.getSecretKey());
          return JSON.parse(decryptedData);
        }

        return null;
      },

      setRoleDetails: function (sRoleCode, sRoleName, sUserID) {
        const oModel = this.getView().getModel('sysModel');

        const roleDetails = {
          RoleCode: sRoleCode,
          RoleName: sRoleName,
          UserID: sUserID
        };

        const encryptedRoleDetails = this.encryptData(JSON.stringify(roleDetails), this.getSecretKey());

        oModel.setProperty('/roleDetails', roleDetails);
        sessionStorage.setItem('roleDetails', encryptedRoleDetails);

        this.getView().setModel(oModel, 'sysModel');
      },

      deleteRoleDetails: function () {
        sessionStorage.removeItem('roleDetails');
        localStorage.removeItem('roledata');
      },

      getEntryFormModel: function () {
        return this.getView().getModel(this.getEntryFormDataSourceModelName());
      },

      encryptData: function (data, secretKey) {
        const dataString = JSON.stringify(data);
        const encryptedData = CryptoJS.AES.encrypt(dataString, secretKey).toString();
        return encryptedData;
      },

      decryptData: function (encryptedData, secretKey) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData);
      },

      getSecretKey: function () {
        const secretKey = 'd9b8c7d1e2f89b7a2e39d4d3e1a5c6b2d3e4f5a6b8d9e1f2c3a1b2e3f4c5d6e7';
        return secretKey;
      },

      setUserDetails: function (loginInfo) {
        const oSysModel = this.getView().getModel('sysModel');
        oSysModel.setProperty('/loginInfo', loginInfo);
        this.getView().setModel(oSysModel, 'sysModel');
      },

      transferObjectValues: function (sourceObj, targetObj) {
        for (let key in sourceObj) {
          if (sourceObj.hasOwnProperty(key)) {
            if (typeof sourceObj[key] === 'object' && !Array.isArray(sourceObj[key])) {
              // If the property is an object, recursively transfer its values
              //if (!targetObj[key]) {

              if (typeof targetObj !== 'undefined') {
                if (targetObj.hasOwnProperty(key)) {
                  targetObj[key] = sourceObj[key];
                }
                this.transferObjectValues(sourceObj[key], targetObj[key]);
              }
            } else if (Array.isArray(sourceObj[key])) {
              // If the property is an array, match each attribute of the objects inside the array
              let sourceObjlength = sourceObj[key].length;

              if (targetObj.hasOwnProperty(key)) {
                let targetObjlength = targetObj[key].length;

                if (sourceObjlength > targetObjlength) {
                  let srcObjectItem = targetObj[key][0];
                  let tarObjectItem = this.createEmptyReplica(srcObjectItem);
                  let ivalue = sourceObjlength - targetObjlength;

                  for (let i = 0; i < ivalue; i++) {
                    let temptarObjectItem = JSON.parse(JSON.stringify(tarObjectItem));
                    targetObj[key].push(temptarObjectItem);
                  }
                }

                targetObj[key] = sourceObj[key].map((sourceItem, index) => {
                  if (typeof sourceItem === 'object') {
                    let targetItem = targetObj[key][index] || {};
                    this.transferObjectValues(sourceItem, targetItem);
                    return targetItem;
                  }
                  return sourceItem;
                });
              }
            } else {
              // Directly assign the value for non-object properties
              if (typeof targetObj !== 'undefined') {
                if (targetObj.hasOwnProperty(key)) {
                  targetObj[key] = sourceObj[key];
                }
              }
            }
          }
        }
      },

      changeDateFromatter: function (sDate) {
        if (sDate) {
          let date = new Date(sDate);
          let oDateFormatForward = sap.ui.core.format.DateFormat.getDateInstance({ pattern: 'dd-MM-yyyy' });
          return oDateFormatForward.format(date);
        }
        return null;
      },

      changeDateTimeFormatter: function (sDate) {
        if (sDate) {
          // Convert string to Date object
          var oDate = new Date(sDate);

          // Define the date format
          var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            pattern: "dd-MM-yyyy HH:mm:ss",
            UTC: true  // Ensures conversion from UTC
          });

          // Format the date
          return oDateFormat.format(oDate);
        }
        return null;

      },

      formatDate: function (sDate) {
        if (sDate) {
          let numDate = parseInt(sDate.replace(/[^0-9]/g, ''));
          let oDate = new Date(numDate);
          let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: 'dd-MM-yyyy' // Define the date format pattern here
          });
          return oDateFormat.format(oDate);
          //return oDate.toLocaleDateString(); // Format the date as needed
        }
        return null;
      },

      createEmptyReplica: function (sourceObj) {
        let targetObj = Array.isArray(sourceObj) ? [] : {};

        for (let key in sourceObj) {
          if (sourceObj.hasOwnProperty(key)) {
            if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
              targetObj[key] = this.createEmptyReplica(sourceObj[key]);
            } else {
              targetObj[key] = Array.isArray(sourceObj[key]) ? [] : '';
            }
          }
        }

        return targetObj;
      },

      getEntryFormResponseDataSourceModelName: function () {
        return this.pEntryFormResponseDataSourceModelName;
      },

      addRowInObj: function (sPath, oNewObj, sPropName) {
        let model = this.getEntryFormModel();

        let data = model.getData();

        let x = data[sPath].length;

        oNewObj[sPropName] = x + 1;
        if (sPath === 'Material') {
          oNewObj["MaterialAutoCode"] = data.MCatName;
        }

        data[sPath].push(oNewObj);

        model.setData(data);

        this.getView().setModel(this.getEntryFormDataSourceModelName(), model);
      },

      deleteRow: function (modelName, arrayName, index) {
        // Get the model using the model name
        var oModel = this.getView().getModel(modelName);
        if (!oModel) {
          console.error('Model not found: ' + modelName);
          return;
        }

        // Get the data from the model
        var aData = oModel.getProperty('/' + arrayName);
        if (!aData || !Array.isArray(aData)) {
          console.error('Array not found or is not an array: ' + arrayName);
          return;
        }

        // Check if the index is valid
        if (index < 0 || index >= aData.length) {
          console.error('Invalid index: ' + index);
          return;
        }

        // Remove the item at the specified index
        MessageBox.show('Are you sure you want to delete record?', {
          title: 'Confirm',
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function (oAction) {
            if (oAction == 'YES') {
              aData.splice(index, 1);
              aData = aData.map((item, i) => ({ ...item, RowNumber: i + 1 }));
              oModel.setProperty('/' + arrayName, aData);
            }
          }
        });
      },

      clearUserModel: function () {
        const oModel = this.getEntryFormModel();
        oModel.setProperty('/username', '');
        oModel.setProperty('/password', '');
      },

      returnDateFormat: function () {
        return 'dd-MM-YYYY';
      },

      returnNormalDateFormat: function (sDate) {
        if (sDate) {
          let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: 'dd-MM-yyyy' });
          var date = oDateFormat.parse(sDate);
          return oDateFormat.format(date);
        }
        return null;
      },

      getUserModel: function () {
        const loginInfo = this.getLoginInfo();
        const oModel = new sap.ui.model.json.JSONModel({
          username: loginInfo?.Username
        });
        this.getView().setModel(oModel, 'userModel');
      },

      setApiResponseObject: function (isSuccess, value) {
        this.pApiResponseObject.success = isSuccess;
        this.pApiResponseObject.object = value;
      },

      getApiResponseObject: function () {
        return this.pApiResponseObject;
      },


      getLogsDisplayColumns: function () {
        return this.pLogsDisplayColumnList;
      },

      setLogsDisplayColumns: function (value) {
        this.pLogsDisplayColumnList = value;
      },
      getLogsDataColumnList: function () {
        return this.pLogsColumnList;
      },

      setLogsDataColumnList: function (value) {
        this.pLogsColumnList = value;
      },
      /*
      setEntryFormResponseDataSourceModelName: function (value) {
          this.pEntryFormResponseDataSourceModelName = value;
      },
      */


      /* Set pRespPath Properties Value */
      getResponsePath: function () {
        return this.pRespPath;
      },
 
      setResponsePath: function (value) {
        this.pRespPath = value;
      },

    });
  }
);
