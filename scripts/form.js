$(document).ready(function() {
    const jpdbBaseURL = "http://api.login2explore.com:5577";
    const jpdbIRL = "/api/irl";
    const jpdbIML = "/api/iml";
    const dbName = "SCHOOL-DB";
    const relName = "STUDENT-TABLE";
    const connToken = "90932074|-31949218726706111|90961950";

    $("#rollNo").focus();

    function resetForm() {
        $("#studentForm")[0].reset();
        $(".feedback").text(""); // Clear feedback messages
        $("#fullName, #class, #birthDate, #address, #enrollmentDate").prop("disabled", true);
        $("#saveBtn, #updateBtn").prop("disabled", true);
        $("#rollNo").prop("disabled", false).focus();
    }

    function validateAndGetFormData() {
        var rollNoVar = $("#rollNo").val();
        if (rollNoVar === "") {
            $("#rollNoMsg").text("Roll No is Required");
            $("#rollNo").focus();
            return "";
        }
        var fullNameVar = $("#fullName").val();
        var classVar = $("#class").val();
        var birthDateVar = $("#birthDate").val();
        var addressVar = $("#address").val();
        var enrollmentDateVar = $("#enrollmentDate").val();

        if (fullNameVar === "") {
            $("#fullNameMsg").text("Full Name is Required");
            $("#fullName").focus();
            return "";
        }
        if (classVar === "") {
            $("#classMsg").text("Class is Required");
            $("#class").focus();
            return "";
        }
        if (birthDateVar === "") {
            $("#birthDateMsg").text("Birth Date is Required");
            $("#birthDate").focus();
            return "";
        }
        if (addressVar === "") {
            $("#addressMsg").text("Address is Required");
            $("#address").focus();
            return "";
        }
        if (enrollmentDateVar === "") {
            $("#enrollmentDateMsg").text("Enrollment Date is Required");
            $("#enrollmentDate").focus();
            return "";
        }

        var jsonStrObj = {
            rollNo: rollNoVar,
            fullName: fullNameVar,
            class: classVar,
            birthDate: birthDateVar,
            address: addressVar,
            enrollmentDate: enrollmentDateVar,
        };
        return JSON.stringify(jsonStrObj);
    }

    function getStudent(rollNo) {
        var jsonStr = {
            rollNo: rollNo
        };
        var getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, JSON.stringify(jsonStr));
        jQuery.ajaxSetup({async: false});
        var resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({async: true});
        return resultObj.status === 200 ? JSON.parse(resultObj.data).record : null;
    }

    function saveStudent() {
        var jsonStr = validateAndGetFormData();
        if (jsonStr === "") {
            return;
        }
        var putReqStr = createPUTRequest(connToken, jsonStr, dbName, relName);
        jQuery.ajaxSetup({async: false});
        var resultObj = executeCommandAtGivenBaseUrl(putReqStr, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        if (resultObj.status === 200) {
            alert("Student record saved successfully!");
        } else {
            alert("Error: Unable to save student record.");
        }
        resetForm();
    }

    function updateStudent() {
        var jsonStr = validateAndGetFormData();
        if (jsonStr === "") {
            return;
        }
        var updateReqStr = createUPDATERecordRequest(connToken, jsonStr, dbName, relName);
        jQuery.ajaxSetup({async: false});
        var resultObj = executeCommandAtGivenBaseUrl(updateReqStr, jpdbBaseURL, jpdbIML);
        jQuery.ajaxSetup({async: true});
        if (resultObj.status === 200) {
            alert("Student record updated successfully!");
        } else {
            alert("Error: Unable to update student record.");
        }
        resetForm();
    }

    $("#rollNo").on("blur", function() {
        var rollNo = $(this).val();
        var student = getStudent(rollNo);

        if (student) {
            $("#fullName").val(student.fullName);
            $("#class").val(student.class);
            $("#birthDate").val(student.birthDate);
            $("#address").val(student.address);
            $("#enrollmentDate").val(student.enrollmentDate);

            $("#saveBtn").prop("disabled", true);
            $("#updateBtn").prop("disabled", false);
            $("#fullName, #class, #birthDate, #address, #enrollmentDate").prop("disabled", false);
            $("#rollNo").prop("disabled", true);
        } else {
            $("#saveBtn").prop("disabled", false);
            $("#updateBtn").prop("disabled", true);
            $("#fullName, #class, #birthDate, #address, #enrollmentDate").prop("disabled", false);
            $("#fullName").focus();
        }
    });

    $("#saveBtn").click(function() {
        saveStudent();
    });

    $("#updateBtn").click(function() {
        updateStudent();
    });

    $("#resetBtn").click(function() {
        resetForm();
    });

    resetForm();
});
