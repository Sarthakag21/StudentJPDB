var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "SCHOOL-DB";
var stuRelationName = "STUDENT-TABLE";
var connToken = "90931688|-31949325493604935|90961643";

$("#rollno").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj(){
    var rollno = $("#rollno").val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#stuname').val(record.name);
    $('#stuclass').val(record.class);
    $('#studob').val(record.dob);
    $('#stuadd').val(record.address);
    $('#stuenroll').val(record.enrolldate);
}

function resetForm(){
    $("#rollno").val("");
    $("#stuname").val("");
    $("#stuclass").val("");
    $("#studob").val("");
    $("#stuadd").val("");
    $("#stuenroll").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}   

function validateData(){
    var rollno, stuname, stuclass, studob, stuadd, stuenroll;
    rollno = $("#rollno").val();
    stuname = $("#stuname").val();
    stuclass = $("#stuclass").val();
    studob = $("#studob").val();
    stuadd = $("#stuadd").val();
    stuenroll = $("#stuenroll").val();

    if(rollno===''){
        alert("Student Roll No. missing");
        $("#rollno").focus();
        return "";
    }

    if(stuname===""){
        alert("Student Name missing");
        $("#stuname").focus();
        return "";
    }

    if(stuclass===""){
        alert("Student class missing");
        $("#stuclass").focus();
        return "";
    }

    if(studob===''){
        alert("Student DOB missing");
        $("#studob").focus();
        return "";
    }

    if(stuadd===''){
        alert("Student address missing");
        $("#stuadd").focus();
        return "";
    }

    if(stuenroll===''){
        alert("Student Enroll date missing");
        $("#stuenroll").focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        name: stuname,
        class: stuclass,
        dob: studob,
        address: stuadd,
        enrolldate: stuenroll
    };
    return JSON.stringify(jsonStrObj);
}

function getStu(){
    var rollnoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status===400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    }else if(resJsonObj.status===200){
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus()
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj===""){
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollno").focus();
}

function changeData(){
    $("#change").prop("disabled", true);
    var jsonChg = validateData();
    var updateRequest = createUPDSTERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}