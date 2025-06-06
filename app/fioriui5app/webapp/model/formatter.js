sap.ui.define([

], function () {
    "use strict";
    return {
        getDateFromatIn_ddMMyyyy: function (oDate) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "dd-MM-yyyy"
            });
            var date = new Date(oDate);
            var cDate = oDateFormat.format(date);
            //console.log(cDate);
            return cDate;
        },
        getDateFromatIn_MMddyyyy: function (oDate) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "MM-dd-yyyy"
            });
            var date = new Date(oDate);
            var cDate = oDateFormat.format(date);
            //console.log(cDate);
            return cDate;
        },
        getDateFromatIn_yyyyMMdd: function (oDate) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd"
            });
            var date = new Date(oDate);
            var cDate = oDateFormat.format(date);
            //console.log(cDate);
            return cDate;
        },
        getDateFromatIn_dMMMyyyy: function (oDate) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "d MMM yyyy"
            });
            var date = new Date(oDate);
            var cDate = oDateFormat.format(date);
            //console.log(cDate);
            return cDate;
        },
        getDateFromatIn_ddMMyyyy_HHmm: function (oDate) {
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "dd-MM-yyyy, hh:mm a",// Format for date and time
                UTC: true
            });
            var date = new Date(oDate);  // Create a Date object
            var cDate = oDateFormat.format(date);  // Format the date and time
            return cDate;
        },
        _formatTime: function (sTime) {
            var oTimeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "hh:mm:ss a" });
            var oDate = oTimeFormat.parse(sTime);
            // Reformat the Date object to "hh:mm a" format to be used in the TimePicker
            var oTimeFormatter = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "hh:mm a" });
            return oTimeFormatter.format(oDate); // Return the formatted time (e.g., "9:00 AM" or "9:30 PM")
        },
        convertToISOFormat: function (sDateString) {
            // Create a formatter for the input pattern (dd-MM-yyyy, hh:mm a)
            var oInputFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "dd-MM-yyyy, hh:mm a"

            });

            // Parse the input date string into a JavaScript Date object
            var oDate = oInputFormat.parse(sDateString);

            // Create a formatter for the ISO 8601 format (YYYY-MM-DDThh:mm:ss.sTZD)
            var oISOFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                pattern: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" // ISO format with milliseconds and timezone
            });

            // Return the date formatted as ISO string
            return oISOFormat.format(oDate);
        },

        // Helper function to convert time string ("09:00:00") to Date object
        _convertTimeToDateObject: function (sTime) {
            let oToday = new Date(); // Get today's date
            let aTimeParts = sTime.split(":"); // Split "HH:MM:SS"

            if (aTimeParts.length === 3) {
                oToday.setHours(aTimeParts[0], aTimeParts[1], aTimeParts[2], 0); // Set hours, minutes, seconds
                return oToday;
            }

            return null; // Return null if invalid format
        },

        // Helper function to format Date object to "HH:MM:SS" string
        _getfFormatTime: function (oDate) {
            return oDate.toTimeString().split(" ")[0]; // Get time part in "HH:MM:SS" format
        },

        // convertToTargetFormat: function (inputDate, targetFormat) {
        //     let date;
        //     // Try to parse the input date
        //     try {
        //         // Normalize input by replacing common delimiters with '-'
        //         const normalizedInput = inputDate.replace(/[/.\s]/g, '-');
        //         const parts = normalizedInput.split('-');

        //         if (parts.length !== 3) {
        //             throw new Error("Invalid date format");
        //         }

        //         // Assuming input is in DD-MM-YYYY or similar formats
        //         let day, month, year;

        //         // Check if the first part is a 4-digit year (YYYY-MM-DD format)
        //         if (parts[0].length === 4) {
        //             year = parseInt(parts[0], 10);
        //             month = parseInt(parts[1], 10) - 1; // Month is 0-based in JavaScript Date
        //             day = parseInt(parts[2], 10);
        //         } else {
        //             // Otherwise assume it's in DD-MM-YYYY format
        //             day = parseInt(parts[0], 10);
        //             month = parseInt(parts[1], 10) - 1; // Month is 0-based in JavaScript Date
        //             year = parseInt(parts[2], 10);
        //         }

        //         // Create the date object
        //         date = new Date(year, month, day);

        //         // If the date is invalid, throw an error
        //         if (isNaN(date.getTime())) {
        //             throw new Error("Invalid date format");
        //         }
        //     } catch (error) {
        //         return "Invalid date format";
        //     }

        //     // Extract the date components
        //     let dayStr = String(date.getDate()).padStart(2, '0'); // Day with 2 digits
        //     let monthStr = String(date.getMonth() + 1).padStart(2, '0'); // Month with 2 digits (getMonth() is 0-based)
        //     let yearStr = date.getFullYear(); // Full year (4 digits)

        //     // Return date based on target format
        //     if (targetFormat === 'dd/MM/yyyy') {
        //         return `${dayStr}/${monthStr}/${yearStr}`;
        //     } else if (targetFormat === 'yyyy/MM/dd') {
        //         return `${yearStr}/${monthStr}/${dayStr}`;
        //     } else {
        //         return "Invalid target format";
        //     }
        // },

        convertToTargetFormat: function (inputDate, targetFormat) {
            let date;

            // Try to parse the input date
            try {
                // Replace common delimiters with '-'
                const normalizedInput = inputDate.replace(/[/.\s]/g, '-');

                // Create a Date object (this will handle various formats automatically)
                date = new Date(normalizedInput);

                // If the date is invalid, throw an error
                if (isNaN(date)) {
                    throw new Error('Invalid date format');
                }
            } catch (error) {
                return 'Invalid date format';
            }

            // Extract the date components
            let day = String(date.getDate()).padStart(2, '0'); // Day with 2 digits
            let month = String(date.getMonth() + 1).padStart(2, '0'); // Month with 2 digits (getMonth() is 0-based)
            let year = date.getFullYear(); // Full year (4 digits)

            // Return date based on target format
            if (targetFormat === 'dd/MM/yyyy') {
                return `${day}/${month}/${year}`;
            } else if (targetFormat === 'yyyy/MM/dd') {
                return `${year}/${month}/${day}`;
            } else {
                return 'Invalid target format';
            }
        },

        // Function to detect the format
        detectDateFormat: function (dateString) {
            // Possible date formats to check against
            const possibleFormats = [
                "yyyy-MM-dd", "MM/dd/yyyy", "dd-MM-yyyy",
                "yyyy/MM/dd", "dd/MM/yyyy", "yyyyMMdd",
                "ddMMyyyy", "MM-dd-yyyy", "MM/d/yy", "M/d/yy",
                "d/MM/yy", "d/M/yy"
            ];
            for (var i = 0; i < possibleFormats.length; i++) {
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: possibleFormats[i] });
                var parsedDate = oDateFormat.parse(dateString);

                if (parsedDate) {
                    // After parsing, format it back to a string using the same pattern
                    var formattedDateString = oDateFormat.format(parsedDate);

                    // Compare the formatted string with the input to ensure a strict match
                    if (formattedDateString === dateString) {
                        return possibleFormats[i];  // Return the matching format
                    }
                }
            }
            return null; // No matching format found
        },

        convertDateFormatToYYYYMMDD:function (dateStr) {
            // Input format: "dd-MM-yyyy"
            const parts = dateStr.split("-");
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
          
            // Output format: "yyyy-MM-dd"
            return `${year}-${month}-${day}`;
          },

          convertDateFormatToDDMMYYYY:function (dateStr) {
            // Input format: "yyyy-MM-dd"
            const parts = dateStr.split("-");
            const day = parts[2];
            const month = parts[1];
            const year = parts[0];
          
            // Output format: "dd-MM-yyyy"
            return `${day}-${month}-${year}`;
          }
    }
});