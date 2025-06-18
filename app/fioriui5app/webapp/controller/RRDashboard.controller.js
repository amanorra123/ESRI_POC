sap.ui.define([
  "sap/ui/core/mvc/Controller",
  'sap/ui/model/json/JSONModel',
  'sap/m/MessageToast',
  '../core/generic/genericentryform',
  'fioriui5app/model/formatter',
  "sap/ui/core/BusyIndicator"

], (Controller, JSONModel, MessageToast, genericentryform, formatter, BusyIndicator) => {
  "use strict";

  return genericentryform.extend('fioriui5app.controller.RRDashboard', {
    onInit: function () {
      genericentryform.prototype.onInit.apply(this, arguments);

      this._oTableSelectDialog = null;
      this._currentInput = null;
      this.byId("RRDTable_EntryForm").setVisible(false);
      this.byId("btnExecute").setVisible(false);
    },

    onBeforeShow: async function (oEvent) {
      this.identifyFormMode(oEvent);
      this.initialize();
      //this.setEntryFormDataSourceURLForEditMode('');
      await this.showEntryForm();

      const oScrollContainer = this.getView().byId('scrollContainerRRD');
      const oDomRef = oScrollContainer.getDomRef();
      if (oDomRef) {
        // Apply min and max height dynamically
        oDomRef.style.minHeight = 'auto';
        oDomRef.style.maxHeight = '450px';
        oDomRef.style.overflow = 'auto'; // Ensure scrolling
      }
    },

    initialize: async function () {
      this.setPageId('rrd');
      this.setFormTitle('RR Dashboard');
      this.setBackwardRoute('');

      this.formMode = this.getFormMode();
      if (this.formMode === "3") {
        const oPathReq = jQuery.sap.getModulePath(
          'fioriui5app',
          '/model/BillingDataModel.json' //add Request Model
        );
        const oModelRequest = new sap.ui.model.json.JSONModel(oPathReq);
        this.getView().setModel(oModelRequest, this.getEntryFormDataSourceModelName());
      }
    },

    cflForCustomer: async function () {
      this.setCflTitle('Customer List');
      await this.createNewModelUsingAPI(
        'GET',
        '/sap/opu/odata4/sap/zesri_sb_cus_sb/srvd_a2x/sap/zesri_sd_cust_f4/0001/ZESRI_Customer_F4',
        '',
        this.getCflListViewDataSourceModelName()
      );
      this.setCflDisplayColumns(['Customer Code', 'Customer Name']);
      this.setCflDataColumns(['Customer', 'CustomerName']);
      this.setCflValueAndDisplay('/customername', 'CustomerName', '', '');
      this.setCflSearchProperty('Customer');
      this.setCflBaseUrlForPagination("/sap/opu/odata4/sap/zesri_sb_cus_sb/srvd_a2x/sap/zesri_sd_cust_f4/0001/");

      this.showCfl(
        'customer',
        this.getCflListViewDataSourceModelName(),
        'value',
        this.onClosecflForCustomer.bind(this)
      );
    },

    onClosecflForCustomer: function () {
      const x = this.getCflObject();
      const oCustomerData = this.getView().getModel(this.getEntryFormDataSourceModelName());
      oCustomerData.setProperty('/customername', x.CustomerName);
      oCustomerData.setProperty('/customercode', x.Customer);
    },

    cflForSalesOrder: async function () {
      this.setCflTitle('Sales Order List');
      const oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
      const oData = oModel.getData();
      let selectedCustomer = oData["customercode"];
      await this.createNewModelUsingAPI(
        'GET',
        `/sap/opu/odata4/sap/zsb_esri_f4/srvd_a2x/sap/zsd_esri_f4/0001/ZESRI_F4?$filter=Customer eq '${selectedCustomer}'`,
        '',
        this.getCflListViewDataSourceModelName()
      );
      this.setCflDisplayColumns(['Sales Order', 'Customer']);
      this.setCflDataColumns(['SalesOrder', 'Customer']);
      this.setCflValueAndDisplay('/salesorder', 'SalesOrder', '', '');
      this.setCflSearchProperty('SalesOrder');
      this.setCflBaseUrlForPagination("/S4_SO/sap/opu/odata4/sap/zsb_esri_f4/srvd_a2x/sap/zsd_esri_f4/0001/");

      this.showCfl(
        'SalesOrderr',
        this.getCflListViewDataSourceModelName(),
        'value',
        this.onClosecflForSalesOrder.bind(this)
      );
    },

    onClosecflForSalesOrder: function () {
      const x = this.getCflObject();
    },

    validate: function () {
      let isValid = true;
      let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
      let sCustomerName = oModel1.getProperty("/customername");
      let sSalesOrder = oModel1.getProperty("/salesorder");

      // if (sCustomerName === undefined || sCustomerName === null || sCustomerName === "") {
      //   MessageToast.show("Please select Customer");
      //   isValid = false;
      // } else if (sSalesOrder === undefined || sSalesOrder === null || sSalesOrder === "") {
      //   MessageToast.show("Please select Sales Order");
      //   isValid = false;
      // }
      return isValid;
    },

    onBtnFetchDataAction: async function (oEvent) {
      if (this.validate()) {
        this.byId("RRDTable_EntryForm").setVisible(true);

        let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
        let oData = oModel.getData();

        let filter = "";

        if ((oData["invoicefromdate"] !== undefined && oData["invoicefromdate"] !== null) && (oData["invoicetodate"] !== undefined && oData["invoicetodate"] !== null)) {
          let dtFormattedFrom = formatter.convertDateFormatToYYYYMMDD(oData["invoicefromdate"]);
          let dtFormattedTo = formatter.convertDateFormatToYYYYMMDD(oData["invoicetodate"]);
          if (filter.length === 0) {
            filter = `BillingDate ge ${dtFormattedFrom} and BillingDate le ${dtFormattedTo}`;
          } else {
            filter = filter + ' and ' + `BillingDate ge '${dtFormattedFrom}' and BillingDate le '${dtFormattedTo}'`;
          }
        } else if (oData["invoicefromdate"] !== undefined && oData["invoicefromdate"] !== null) {
          let dtFormattedFrom = formatter.convertDateFormatToYYYYMMDD(oData["invoicefromdate"]);
          if (filter.length === 0) {
            filter = `BillingDate eq '${dtFormattedFrom}'`;
          } else {
            filter = filter + ' and ' + `BillingDate eq '${dtFormattedFrom}'`;
          }
        } else if (oData["invoicetodate"] !== undefined && oData["invoicetodate"] !== null) {
          let dtFormattedTo = formatter.convertDateFormatToYYYYMMDD(oData["invoicetodate"]);
          if (filter.length === 0) {
            filter = `BillingDate eq  '${dtFormattedTo}'`;
          } else {
            filter = filter + ' and ' + `BillingDate eq '${dtFormattedTo}'`;
          }
        }
        if (oData["customercode"] !== undefined && oData["customercode"] !== null) {
          if (filter.length === 0) {
            filter = `Customer eq '${oData["customercode"]}'`;
          } else {
            filter = filter + ' and ' + `Customer eq '${oData["customercode"]}'`;
          }
        }
        if (oData["salesorder"] !== undefined && oData["salesorder"] !== null) {
          if (filter.length === 0) {
            filter = `SalesOrder eq  '${oData["salesorder"]}'`;
          } else {
            filter = filter + ' and ' + `SalesOrder eq '${oData["salesorder"]}'`;
          }
        }


        let url = '/sap/opu/odata4/sap/zesri_sb/srvd_a2x/sap/zesri_sd/0001/ZESRI_Data_Model';//?$filter=SalesOrder eq '024E001030'
        if (filter.length > 0) {
          url = url + '?$filter=' + filter + '&$orderby=RunDate asc'
        }else {
          url = url + '?$orderby=RunDate asc'
        }
        await this.createNewModelUsingAPI(
          'GET',
          url,
          '',
          'tblListModel'
        );

        let aTableData = this.getView().getModel('tblListModel').getData();
        if (aTableData.value !== undefined && aTableData.value.length > 0) {
          aTableData.value.forEach((item, index) => {
            item.RowNumber = index + 1; // Start row numbering from 1
            item.BillingDate = formatter.convertDateFormatToDDMMYYYY(item.BillingDate);
            item.RunDate = formatter.convertDateFormatToDDMMYYYY(item.RunDate);
            // if ((item.ProposedJV !== "" && item.ProposedJV !== null) && (item.UnbilledJV !== "" && item.UnbilledJV !== null)) {
            //   item.EnableRRAmount = false;
            //   item.EnablePeriod = false;
            // } else {
            //   item.EnableRRAmount = true;
            //   item.EnablePeriod = true;
            // }

            let ProposedRR = item.RRAmount;
            let Periods = item.Period;

            if (Periods > 0 && ProposedRR > 0) {
              let RRAmount = ProposedRR / Periods;
              item.AmountOfRR = RRAmount;
            } else {
              item.AmountOfRR = 0;
            }
          });
          this.byId("btnExecute").setVisible(true);
          oModel.setProperty('/value', aTableData['value']);
          oModel.refresh(true);
        }
      }
    },

    onBtnResetAction: function (oEvent) {
      let oModel1 = this.getView().getModel(this.getEntryFormDataSourceModelName());
      oModel1.setProperty("/invoicefromdate", null);
      oModel1.setProperty("/invoicetodate", null);
      oModel1.setProperty("/customercode", null);
      oModel1.setProperty("/customername", null);
      oModel1.setProperty("/salesorder", null);
      oModel1.setProperty("/value", []);


      this.byId("RRDTable_EntryForm").setVisible(false);
      this.byId("btnExecute").setVisible(false);
    },

    onChangePeriod: function (oEvent) {
      this.calculateRRAmount(oEvent, 'period');
    },

    onChangeProposedRR: function (oEvent) {
      this.calculateRRAmount(oEvent, 'proposedrr');
    },

    calculateRRAmount: function (oEvent, from) {

      var oInput = oEvent.getSource();                         // the Input field
      var oRow = oInput.getParent();                           // get the row (e.g., ColumnListItem)
      var oTable = this.byId("RRDTable_EntryForm");                     // your table ID
      var aItems = oTable.getItems();                          // all rows
      var iIndex = aItems.indexOf(oRow);                       // index of the row

      var sValue = oEvent.getParameter("value");
      let oModel = this.getView().getModel(this.getEntryFormDataSourceModelName());
      let oData = oModel.getData();
      let finalCal, Period, ProposedAmount;
      if (from === 'period') {
        Period = Number(sValue);
        ProposedAmount = Number(oData.value[iIndex].RRAmount);
      } else if (from === 'proposedrr') {
        ProposedAmount = Number(sValue);
        Period = Number(oData.value[iIndex].Period);
      }
      if (ProposedAmount > 0 && Period > 0) {
        finalCal = ProposedAmount / Period;
      } else {
        finalCal = 0;
      }

      oData.value[iIndex].AmountOfRR = finalCal;
      oModel.setData(oData);
      this.getView().setModel(oModel, this.getEntryFormDataSourceModelName());
    },

    onBtnExecutionAction: function (oEvent) {
      BusyIndicator.show(0);

      setTimeout(() => {
        BusyIndicator.hide();
      }, 15000);
    },

    handleInvoiceFromDateChange: function () {

    },

    handleInvoiceToDateChange: function () {

    },
  });

  //     return Controller.extend("fioriui5app.controller.RRDashboard", {
  //         onInit() {
  //             this._oTableSelectDialog = null;
  //             this._currentInput = null;
  //             this.byId("RRDTable_EntryForm").setVisible(false);
  //             this.byId("btnExecute").setVisible(false);

  //             this.onCallSoapService();
  //         },

  //         onCallSoapService: function () {
  //             var sSoapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sfin="http://sap.com/xi/SAPSCORE/SFIN">
  //    <soapenv:Header/>
  //    <soapenv:Body>
  //       <sfin:JournalEntryBulkLedgerCreateRequest>
  //          <MessageHeader>
  //             <!--Optional:-->
  //             <ID schemeID="?" schemeAgencyID="?">?</ID>
  //             <!--Optional:-->
  //             <UUID schemeID="?" schemeAgencyID="?">?</UUID>
  //             <!--Optional:-->
  //             <ReferenceID schemeID="?" schemeAgencyID="?">?</ReferenceID>
  //             <!--Optional:-->
  //             <ReferenceUUID schemeID="?" schemeAgencyID="?">?</ReferenceUUID>
  //             <CreationDateTime>2025-06-06T12:00:00.1234567Z</CreationDateTime>
  //             <!--Optional:-->
  //             <TestDataIndicator>?</TestDataIndicator>
  //             <!--Optional:-->
  //             <ReconciliationIndicator>?</ReconciliationIndicator>
  //             <!--Optional:-->
  //             <SenderBusinessSystemID>?</SenderBusinessSystemID>
  //             <!--Optional:-->
  //             <RecipientBusinessSystemID>?</RecipientBusinessSystemID>
  //             <!--Optional:-->
  //             <SenderParty>
  //                <!--Optional:-->
  //                <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                <!--Zero or more repetitions:-->
  //                <StandardID schemeAgencyID="?">?</StandardID>
  //                <!--Optional:-->
  //                <ContactPerson>
  //                   <!--Optional:-->
  //                   <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                   <!--0 to 4 repetitions:-->
  //                   <OrganisationFormattedName>?</OrganisationFormattedName>
  //                   <!--0 to 4 repetitions:-->
  //                   <PersonFormattedName>?</PersonFormattedName>
  //                   <!--Zero or more repetitions:-->
  //                   <PhoneNumber>
  //                      <!--Optional:-->
  //                      <AreaID>?</AreaID>
  //                      <!--Optional:-->
  //                      <SubscriberID>?</SubscriberID>
  //                      <!--Optional:-->
  //                      <ExtensionID>?</ExtensionID>
  //                      <!--Optional:-->
  //                      <CountryCode>?</CountryCode>
  //                      <!--Optional:-->
  //                      <CountryDiallingCode>?</CountryDiallingCode>
  //                      <!--Optional:-->
  //                      <CountryName languageCode="?">?</CountryName>
  //                   </PhoneNumber>
  //                   <!--Zero or more repetitions:-->
  //                   <FaxNumber>
  //                      <!--Optional:-->
  //                      <AreaID>?</AreaID>
  //                      <!--Optional:-->
  //                      <SubscriberID>?</SubscriberID>
  //                      <!--Optional:-->
  //                      <ExtensionID>?</ExtensionID>
  //                      <!--Optional:-->
  //                      <CountryCode>?</CountryCode>
  //                      <!--Optional:-->
  //                      <CountryDiallingCode>?</CountryDiallingCode>
  //                      <!--Optional:-->
  //                      <CountryName languageCode="?">?</CountryName>
  //                   </FaxNumber>
  //                   <!--Zero or more repetitions:-->
  //                   <EmailURI schemeID="?">?</EmailURI>
  //                </ContactPerson>
  //             </SenderParty>
  //             <!--Zero or more repetitions:-->
  //             <RecipientParty>
  //                <!--Optional:-->
  //                <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                <!--Zero or more repetitions:-->
  //                <StandardID schemeAgencyID="?">?</StandardID>
  //                <!--Optional:-->
  //                <ContactPerson>
  //                   <!--Optional:-->
  //                   <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                   <!--0 to 4 repetitions:-->
  //                   <OrganisationFormattedName>?</OrganisationFormattedName>
  //                   <!--0 to 4 repetitions:-->
  //                   <PersonFormattedName>?</PersonFormattedName>
  //                   <!--Zero or more repetitions:-->
  //                   <PhoneNumber>
  //                      <!--Optional:-->
  //                      <AreaID>?</AreaID>
  //                      <!--Optional:-->
  //                      <SubscriberID>?</SubscriberID>
  //                      <!--Optional:-->
  //                      <ExtensionID>?</ExtensionID>
  //                      <!--Optional:-->
  //                      <CountryCode>?</CountryCode>
  //                      <!--Optional:-->
  //                      <CountryDiallingCode>?</CountryDiallingCode>
  //                      <!--Optional:-->
  //                      <CountryName languageCode="?">?</CountryName>
  //                   </PhoneNumber>
  //                   <!--Zero or more repetitions:-->
  //                   <FaxNumber>
  //                      <!--Optional:-->
  //                      <AreaID>?</AreaID>
  //                      <!--Optional:-->
  //                      <SubscriberID>?</SubscriberID>
  //                      <!--Optional:-->
  //                      <ExtensionID>?</ExtensionID>
  //                      <!--Optional:-->
  //                      <CountryCode>?</CountryCode>
  //                      <!--Optional:-->
  //                      <CountryDiallingCode>?</CountryDiallingCode>
  //                      <!--Optional:-->
  //                      <CountryName languageCode="?">?</CountryName>
  //                   </FaxNumber>
  //                   <!--Zero or more repetitions:-->
  //                   <EmailURI schemeID="?">?</EmailURI>
  //                </ContactPerson>
  //             </RecipientParty>
  //             <!--Zero or more repetitions:-->
  //             <BusinessScope>
  //                <TypeCode listID="?" listVersionID="?" listAgencyID="?">?</TypeCode>
  //                <!--Optional:-->
  //                <InstanceID schemeID="?" schemeAgencyID="?">?</InstanceID>
  //                <!--Optional:-->
  //                <ID schemeID="?" schemeAgencyID="?">?</ID>
  //             </BusinessScope>
  //          </MessageHeader>
  //          <!--1 or more repetitions:-->
  //          <JournalEntryCreateRequest>
  //             <MessageHeader>
  //                <!--Optional:-->
  //                <ID schemeID="?" schemeAgencyID="?">?</ID>
  //                <!--Optional:-->
  //                <UUID schemeID="?" schemeAgencyID="?">?</UUID>
  //                <!--Optional:-->
  //                <ReferenceID schemeID="?" schemeAgencyID="?">?</ReferenceID>
  //                <!--Optional:-->
  //                <ReferenceUUID schemeID="?" schemeAgencyID="?">?</ReferenceUUID>
  //                <CreationDateTime>?</CreationDateTime>
  //                <!--Optional:-->
  //                <TestDataIndicator>?</TestDataIndicator>
  //                <!--Optional:-->
  //                <ReconciliationIndicator>?</ReconciliationIndicator>
  //                <!--Optional:-->
  //                <SenderBusinessSystemID>?</SenderBusinessSystemID>
  //                <!--Optional:-->
  //                <RecipientBusinessSystemID>?</RecipientBusinessSystemID>
  //                <!--Optional:-->
  //                <SenderParty>
  //                   <!--Optional:-->
  //                   <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                   <!--Zero or more repetitions:-->
  //                   <StandardID schemeAgencyID="?">?</StandardID>
  //                   <!--Optional:-->
  //                   <ContactPerson>
  //                      <!--Optional:-->
  //                      <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                      <!--0 to 4 repetitions:-->
  //                      <OrganisationFormattedName>?</OrganisationFormattedName>
  //                      <!--0 to 4 repetitions:-->
  //                      <PersonFormattedName>?</PersonFormattedName>
  //                      <!--Zero or more repetitions:-->
  //                      <PhoneNumber>
  //                         <!--Optional:-->
  //                         <AreaID>?</AreaID>
  //                         <!--Optional:-->
  //                         <SubscriberID>?</SubscriberID>
  //                         <!--Optional:-->
  //                         <ExtensionID>?</ExtensionID>
  //                         <!--Optional:-->
  //                         <CountryCode>?</CountryCode>
  //                         <!--Optional:-->
  //                         <CountryDiallingCode>?</CountryDiallingCode>
  //                         <!--Optional:-->
  //                         <CountryName languageCode="?">?</CountryName>
  //                      </PhoneNumber>
  //                      <!--Zero or more repetitions:-->
  //                      <FaxNumber>
  //                         <!--Optional:-->
  //                         <AreaID>?</AreaID>
  //                         <!--Optional:-->
  //                         <SubscriberID>?</SubscriberID>
  //                         <!--Optional:-->
  //                         <ExtensionID>?</ExtensionID>
  //                         <!--Optional:-->
  //                         <CountryCode>?</CountryCode>
  //                         <!--Optional:-->
  //                         <CountryDiallingCode>?</CountryDiallingCode>
  //                         <!--Optional:-->
  //                         <CountryName languageCode="?">?</CountryName>
  //                      </FaxNumber>
  //                      <!--Zero or more repetitions:-->
  //                      <EmailURI schemeID="?">?</EmailURI>
  //                   </ContactPerson>
  //                </SenderParty>
  //                <!--Zero or more repetitions:-->
  //                <RecipientParty>
  //                   <!--Optional:-->
  //                   <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                   <!--Zero or more repetitions:-->
  //                   <StandardID schemeAgencyID="?">?</StandardID>
  //                   <!--Optional:-->
  //                   <ContactPerson>
  //                      <!--Optional:-->
  //                      <InternalID schemeID="?" schemeAgencyID="?">?</InternalID>
  //                      <!--0 to 4 repetitions:-->
  //                      <OrganisationFormattedName>?</OrganisationFormattedName>
  //                      <!--0 to 4 repetitions:-->
  //                      <PersonFormattedName>?</PersonFormattedName>
  //                      <!--Zero or more repetitions:-->
  //                      <PhoneNumber>
  //                         <!--Optional:-->
  //                         <AreaID>?</AreaID>
  //                         <!--Optional:-->
  //                         <SubscriberID>?</SubscriberID>
  //                         <!--Optional:-->
  //                         <ExtensionID>?</ExtensionID>
  //                         <!--Optional:-->
  //                         <CountryCode>?</CountryCode>
  //                         <!--Optional:-->
  //                         <CountryDiallingCode>?</CountryDiallingCode>
  //                         <!--Optional:-->
  //                         <CountryName languageCode="?">?</CountryName>
  //                      </PhoneNumber>
  //                      <!--Zero or more repetitions:-->
  //                      <FaxNumber>
  //                         <!--Optional:-->
  //                         <AreaID>?</AreaID>
  //                         <!--Optional:-->
  //                         <SubscriberID>?</SubscriberID>
  //                         <!--Optional:-->
  //                         <ExtensionID>?</ExtensionID>
  //                         <!--Optional:-->
  //                         <CountryCode>?</CountryCode>
  //                         <!--Optional:-->
  //                         <CountryDiallingCode>?</CountryDiallingCode>
  //                         <!--Optional:-->
  //                         <CountryName languageCode="?">?</CountryName>
  //                      </FaxNumber>
  //                      <!--Zero or more repetitions:-->
  //                      <EmailURI schemeID="?">?</EmailURI>
  //                   </ContactPerson>
  //                </RecipientParty>
  //                <!--Zero or more repetitions:-->
  //                <BusinessScope>
  //                   <TypeCode listID="?" listVersionID="?" listAgencyID="?">?</TypeCode>
  //                   <!--Optional:-->
  //                   <InstanceID schemeID="?" schemeAgencyID="?">?</InstanceID>
  //                   <!--Optional:-->
  //                   <ID schemeID="?" schemeAgencyID="?">?</ID>
  //                </BusinessScope>
  //             </MessageHeader>
  //             <JournalEntry>
  //                <OriginalReferenceDocumentType>BKPFF</OriginalReferenceDocumentType>
  //                <!--Optional:-->
  //                <OriginalReferenceDocument>?</OriginalReferenceDocument>
  //                <!--Optional:-->
  //                <OriginalReferenceDocumentLogicalSystem>?</OriginalReferenceDocumentLogicalSystem>
  //                <BusinessTransactionType>RFBU</BusinessTransactionType>
  //                <AccountingDocumentType>SA</AccountingDocumentType>
  //                <!--Optional:-->
  //                <AccountingDocument></AccountingDocument>
  //                <LedgerGroup>0L</LedgerGroup>
  //                <!--Optional:-->
  //                <DocumentReferenceID>?</DocumentReferenceID>
  //                <!--Optional:-->
  //                <DocumentHeaderText>?</DocumentHeaderText>
  //                <!--Optional:-->
  //                <ReversalReferenceDocument>?</ReversalReferenceDocument>
  //                <CreatedByUser>YINWES</CreatedByUser>
  //                <CompanyCode>1000</CompanyCode>
  //                <DocumentDate>2025-06-03</DocumentDate>
  //                <PostingDate>2025-06-03</PostingDate>
  //                <!--Optional:-->
  //                <PostingFiscalPeriod>?</PostingFiscalPeriod>
  //                <!--Zero or more repetitions:-->
  //                <Item>
  //                   <GLAccount listID="?">41000000</GLAccount>
  //                   <AmountInTransactionCurrency currencyCode="INR">100</AmountInTransactionCurrency>
  //                   <!--Optional:-->
  //                   <AmountInCompanyCodeCurrency currencyCode="?">?</AmountInCompanyCodeCurrency>
  //                   <!--Optional:-->
  //                   <AmountInGroupCurrency currencyCode="?">?</AmountInGroupCurrency>
  //                   <!--Optional:-->
  //                   <AmountInFreeDefinedCurrency1 currencyCode="?">?</AmountInFreeDefinedCurrency1>
  //                   <!--Optional:-->
  //                   <DebitCreditCode>?</DebitCreditCode>
  //                   <!--Optional:-->
  //                   <DocumentItemText>?</DocumentItemText>
  //                   <!--Optional:-->
  //                   <AssignmentReference>?</AssignmentReference>
  //                   <!--Optional:-->
  //                   <FinancialTransactionType>?</FinancialTransactionType>
  //                   <!--Optional:-->
  //                   <TradingPartner>?</TradingPartner>
  //                   <!--Optional:-->
  //                   <ValueDate>?</ValueDate>
  //                   <!--Optional:-->
  //                   <HouseBank>?</HouseBank>
  //                   <!--Optional:-->
  //                   <HouseBankAccount>?</HouseBankAccount>
  //                   <!--Optional:-->
  //                   <Material>?</Material>
  //                   <!--Optional:-->
  //                   <AccountAssignment>
  //                      <!--Optional:-->
  //                      <AccountAssignmentType>?</AccountAssignmentType>
  //                      <!--Optional:-->
  //                      <ProfitCenter>?</ProfitCenter>
  //                      <!--Optional:-->
  //                      <PartnerProfitCenter>?</PartnerProfitCenter>
  //                      <!--Optional:-->
  //                      <Segment>?</Segment>
  //                      <!--Optional:-->
  //                      <PartnerSegment>?</PartnerSegment>
  //                      <!--Optional:-->
  //                      <CostCenter>?</CostCenter>
  //                      <!--Optional:-->
  //                      <WBSElement>?</WBSElement>
  //                      <!--Optional:-->
  //                      <SalesOrder>?</SalesOrder>
  //                      <!--Optional:-->
  //                      <SalesOrderItem>?</SalesOrderItem>
  //                      <!--Optional:-->
  //                      <FunctionalArea>?</FunctionalArea>
  //                      <!--Optional:-->
  //                      <ServiceDocType>?</ServiceDocType>
  //                      <!--Optional:-->
  //                      <ServiceDocID>?</ServiceDocID>
  //                      <!--Optional:-->
  //                      <ServiceDocItemID>?</ServiceDocItemID>
  //                   </AccountAssignment>
  //                   <!--Optional:-->
  //                   <ProfitabilitySupplement>
  //                      <!--Optional:-->
  //                      <Customer>?</Customer>
  //                      <!--Optional:-->
  //                      <CustomerGroup listID="?" listVersionID="?" listAgencyID="?">?</CustomerGroup>
  //                      <!--Optional:-->
  //                      <CustomerIndustry listID="?" listVersionID="?" listAgencyID="?">?</CustomerIndustry>
  //                      <!--Optional:-->
  //                      <CustomerCountry>?</CustomerCountry>
  //                      <!--Optional:-->
  //                      <SalesDistrict>?</SalesDistrict>
  //                      <!--Optional:-->
  //                      <SoldMaterial>?</SoldMaterial>
  //                      <!--Optional:-->
  //                      <SoldMaterialGroup>?</SoldMaterialGroup>
  //                      <!--Optional:-->
  //                      <SalesOrganization>?</SalesOrganization>
  //                      <!--Optional:-->
  //                      <DistributionChannel listID="?" listVersionID="?" listAgencyID="?">?</DistributionChannel>
  //                      <!--Optional:-->
  //                      <Division listID="?" listVersionID="?" listAgencyID="?">?</Division>
  //                      <!--Optional:-->
  //                      <BillToParty>?</BillToParty>
  //                      <!--Optional:-->
  //                      <ShipToParty>?</ShipToParty>
  //                      <!--Optional:-->
  //                      <WBSElement>?</WBSElement>
  //                      <!--Optional:-->
  //                      <FunctionalArea>?</FunctionalArea>
  //                      <!--Optional:-->
  //                      <ServiceDocType>?</ServiceDocType>
  //                      <!--Optional:-->
  //                      <ServiceDocID>?</ServiceDocID>
  //                      <!--Optional:-->
  //                      <ServiceDocItemID>?</ServiceDocItemID>
  //                   </ProfitabilitySupplement>
  //                   <!--Optional:-->
  //                   <AdditionalAttributes>
  //                      <!--Optional:-->
  //                      <PersonnelNumber>?</PersonnelNumber>
  //                   </AdditionalAttributes>
  //                </Item>
  //             </JournalEntry>
  //          </JournalEntryCreateRequest>
  //       </sfin:JournalEntryBulkLedgerCreateRequest>
  //    </soapenv:Body>
  // </soapenv:Envelope>`;

  //             // var xhr = new XMLHttpRequest();
  //             // xhr.open("POST", "https://my409722-api.s4hana.cloud.sap/sap/bc/srt/scs_ext/sap/journalentrybulkledgercreation", true); // Replace with actual endpoint URL
  //             // xhr.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
  //             // xhr.setRequestHeader("SOAPAction", "http://sap.com/xi/SAPSCORE/SFIN/JournalEntryBulkLedgerCreationRequest_In/JournalEntryBulkLedgerCreationRequest_InRequest");

  //             // // Optional: Basic Auth
  //             // xhr.setRequestHeader("Authorization", "Basic " + btoa("ESRI_IBU:MFhnayBqTtuyBLwErJc>ydE8kqwLbPCDHUwxZmvr"));

  //             // xhr.onreadystatechange = function () {
  //             //     if (xhr.readyState === 4) {
  //             //         if (xhr.status === 200) {
  //             //             var response = xhr.responseText;
  //             //             console.log("SOAP Response:", response);
  //             //             // Parse and process XML if needed
  //             //         } else {
  //             //             console.error("SOAP Error:", xhr.status, xhr.responseText);
  //             //         }
  //             //     }
  //             // };

  //             // xhr.send(sSoapEnvelope);

  //             // fetch("/sap/bc/srt/scs_ext/sap/journalentrybulkledgercreation", {
  //             //     method: "POST",
  //             //     headers: {
  //             //       "Content-Type": "text/xml",
  //             //       "SOAPAction": "http://sap.com/xi/SAPSCORE/SFIN/JournalEntryBulkLedgerCreationRequest_In/JournalEntryBulkLedgerCreationRequest_InRequest"
  //             //     },
  //             //     body: sSoapEnvelope
  //             //   })
  //             //   .then(res => res.text())
  //             //   .then(xml => console.log("SOAP Response", xml))
  //             //   .catch(err => console.error("SOAP Error", err));

  //             fetch("/sap/bc/srt/scs_ext/sap/journalentrybulkledgercreation", {
  //                 method: "POST",
  //                 headers: {
  //                   "Content-Type": "text/xml;charset=UTF-8",
  //                   "SOAPAction": "http://sap.com/xi/SAPSCORE/SFIN/JournalEntryBulkLedgerCreationRequest_In/JournalEntryBulkLedgerCreationRequest_InRequest",
  //                   "Authorization": "Basic " + btoa("ESRI_IBU:MFhnayBqTtuyBLwErJc>ydE8kqwLbPCDHUwxZmvr")
  //                 },
  //                 body: sSoapEnvelope
  //               })
  //               .then(response => response.text())
  //               .then(data => {
  //                 var oParser = new DOMParser();
  //                 var oXmlDoc = oParser.parseFromString(data, "text/xml");
  //                 console.log("SOAP Response:", oXmlDoc);
  //                 // Extract fields based on response schema
  //               })
  //               .catch(error => {
  //                 console.error("SOAP Call Failed", error);
  //                 MessageBox.error("SOAP Call Failed: " + error.message);
  //               });
  //         },

  //         handleInvoiceFromDateChange: function () {

  //         },

  //         handleInvoiceToDateChange: function () {

  //         },

  //         cflForCustomers: function () {

  //         },

  //         cflForSalesOrder: function () {

  //         },

  //         onValueHelpRequest: function (oEvent) {
  //             const oSource = oEvent.getSource();
  //             const sId = oSource.getId(); // e.g., "__xmlview0--customerInput"
  //             const sFieldKey = sId.split("--")[2]; // "customerInput"
  //             this._currentInput = oSource;
  //             this._currentFieldKey = sFieldKey;

  //             if (!this._oTableSelectDialog) {
  //                 this._oTableSelectDialog = sap.ui.xmlfragment("fioriui5app.view.ValueHelpDialog", this);
  //                 this.getView().addDependent(this._oTableSelectDialog);
  //             }

  //             // Optionally change dialog title and model
  //             let oData = [];
  //             let aColumns = [];
  //             if (sFieldKey === "customer") {
  //                 // let oModelCustomer = this.getView().getModel('CustomersDataModel');
  //                 // oData = oModelCustomer.getData();
  //                 oData = [
  //                     { id: "9980000132", name: "Stonemen Team1" },
  //                     { id: "9980000130", name: "Stonemen Team1" },
  //                     { id: "AR1100", name: "STONEMEN CRAFT AGRA" }
  //                 ];
  //                 aColumns = [
  //                     { label: "Customer ID", path: "id" },
  //                     { label: "Customer Name", path: "name" }
  //                 ];
  //                 this._oTableSelectDialog.setTitle("Select Customer");
  //             } else if (sFieldKey === "SalesOrderr") {
  //                 // let oModelCustomer = this.getView().getModel('SalesOrdersDataModel');
  //                 // oData = oModelCustomer.getData();
  //                 oData = [
  //                     { id: "024E000854", name: "STONE PRODUCT" },
  //                     { id: "024E000855", name: "RM-1" },
  //                     { id: "024E000856", name: "RAW MATERIAL-1" }
  //                 ];
  //                 aColumns = [
  //                     { label: "Sales Order No", path: "id" },
  //                     { label: "Description", path: "name" }
  //                 ];
  //                 this._oTableSelectDialog.setTitle("Select Sales Order");
  //             }


  //             // Set model
  //             const oModel = new sap.ui.model.json.JSONModel({ value: oData });
  //             this._oTableSelectDialog.setModel(oModel, "vhdModel");

  //             // Bind items
  //             this._oTableSelectDialog.bindAggregation("items", "vhdModel>/value", new sap.m.ColumnListItem({
  //                 cells: [
  //                     new sap.m.Text({ text: "{vhdModel>id}" }),
  //                     new sap.m.Text({ text: "{vhdModel>name}" })
  //                 ]
  //             }));

  //             this._oTableSelectDialog.open();
  //         },


  //         onVHConfirm: function (oEvent) {
  //             const oSelectedItem = oEvent.getParameter("selectedItem");
  //             if (oSelectedItem && this._currentInput) {
  //                 const sValue = oSelectedItem.getCells()[0].getText(); // id
  //                 this._currentInput.setValue(sValue);

  //                 const oContext = oSelectedItem.getBindingContext("vhdModel");
  //                 const oSelectedObject = oContext.getObject();
  //                 this._currentInput.setValue(oSelectedObject.id);

  //                 if (this._currentFieldKey === "customer") {
  //                     let oModel = this.getView().getModel('BillingDataModel');
  //                     oModel.setProperty("/customername", oSelectedObject.name);
  //                     oModel.setProperty("/customercode", oSelectedObject.id);
  //                 } else {
  //                     let oModel = this.getView().getModel('BillingDataModel');
  //                     oModel.setProperty("/salesorder", oSelectedObject.id);
  //                 }
  //             }
  //             this._currentInput = null;
  //         },

  //         onVHCancel: function () {
  //             this._currentInput = null;
  //         },

  //         validate: function () {
  //             let isValid = true;
  //             let oModel1 = this.getView().getModel('BillingDataModel');
  //             let sCustomerName = oModel1.getProperty("/customername");
  //             let sSalesOrder = oModel1.getProperty("/salesorder");

  //             if (sCustomerName === undefined || sCustomerName === null || sCustomerName === "") {
  //                 MessageToast.show("Please select Customer");
  //                 isValid = false;
  //             } else if (sSalesOrder === undefined || sSalesOrder === null || sSalesOrder === "") {
  //                 MessageToast.show("Please select Sales Order");
  //                 isValid = false;
  //             }
  //             return isValid;
  //         },

  //         onBtnFetchDataAction: function (oEvent) {
  //             if (this.validate()) {
  //                 this.byId("RRDTable_EntryForm").setVisible(true);
  //                 this.byId("btnExecute").setVisible(true);
  //             }
  //         },

  //         onBtnResetAction: function (oEvent) {
  //             let oModel1 = this.getView().getModel('BillingDataModel');
  //             oModel1.setProperty("/invoicefromdate", null);
  //             oModel1.setProperty("/invoicetodate", null);
  //             oModel1.setProperty("/customercode", null);
  //             oModel1.setProperty("/customername", null);
  //             oModel1.setProperty("/salesorder", null);

  //         },

  //         onBtnExecutionAction: function (oEvent) {

  //         }
  //     });

});