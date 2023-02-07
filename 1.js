var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var schoolDB = "School-DB";
var studentRel = "Student-Table";
var connToken = "90932672|-31949276406808571|90954537";

$("#rollno").focus();
//setBaseUrl(jpdbBaseUrl);

function saveRecNo2LS(jsonObj)
{
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}



function getRollnoAsJsonObj()
{
    var rollno = $("#rollno").val();
    var jsonStr = { 
              rollno: rollno
    };
    
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj)
{
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    
    $("#rollno").val(record.rollno);
    $("#fullname").val(record.fullname);
    $("#classin").val(record.class);
    $("#address").val(record.address);
    $("#dob").val(record.dob);
    $("#enrolldate").val(record.doe);
    
}

function resetData()
{
    $("#rollno").val("");
    $("#fullname").val("");
    $("#classin").val("");
    $("#address").val("");
    $("#dob").val("");
    $("#enrolldate").val("");
    
    $("#rollno").prop("disabled",false);
    
    $("#save").prop("disabled",true);
    $("#update").prop("disabled",true);
    $("#reset").prop("disabled",true);
    
    $("#rollno").focus();
    
    
    
}

function saveData()
{
    var jsonStrObj = validateData();
    if(jsonStrObj === " ")
    {
        return "";
    }
    
    var putRequest = createPUTRequest(connToken,jsonStrObj,schoolDB, studentRel);
       alert(putRequest);
    jQuery.ajaxSetup({async : false});
    
    var resJosObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
     alert(JSON.stringify(resJosObj));
    jQuery.ajaxSetup({async : true});
    resetData();
    
    $("#rollno").focus();
    
    
}

function validateData()
{
    
    var rollno, fullname, classin, address, dob, enrolldate;
    
    rollno = $("#rollno").val();
    fullname =  $("#fullname").val();
    classin = $("#classin").val();
    address = $("#address").val();
    dob = $("#dob").val();
    enrolldate = $("#enrollmentdate").val();
    
    if(rollno === " ")
    {
        alert("Roll Number is missing");
        $("#rollno").focus();
        return " ";
    }
    
    if(fullname === " ")
    {
        alert("Full Name is missing");
        $("#fullname").focus();
        return " ";
    }
    
    if(classin === " ")
    {
        alert("Class is missing");
        $("#classin").focus();
        return " ";
    }
    
    if(address === " ")
    {
        alert("Address is missing");
        $("#address").focus();
        return " ";
    }
    
    if(dob === " ")
    {
        alert("Date of Birth is missing");
        $("#dob").focus();
        return " ";
    }
    
    if(enrolldate === " ")
    {
        alert("Date of Enrollnment is missing");
        $("#enrolldate").focus();
        return " ";
    }
    
    var jsonStrObj = {
        
        rollno: rollno,
        fullname: fullname,
        classin: classin,
        address: address,
        dob: dob,
        enrolldate: enrolldate
    };
        return JSON.stringify(jsonStrObj);
    }
    
    function updateData()
    {
        $("#update").prop("disabled",true);
        jsonUpdate = validateData();
        
        var updateRequest = createUPDATERecordRequest(connToken,jsonUpdate,schoolDB, studentRel,localStorage.getItem("recno"));
        
         jQuery.ajaxSetup({async: false});
         
         var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
         
         jQuery.ajaxSetup({async: true});
         
         console.log(resJsonObj);
         resetForm();
         $("#rollno").focus();
         
         
    }
    
    function getStud()
    {
        var studrollJsonObj= getRollnoAsJsonObj();
        var getRequest = createGet_BY_KEYRequest(connToken,schoolDB,studentRel,studrollJsonObj);
        jQuery.ajaxSetup({async : false});
        
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
        
        jQuery.ajaxSetup({async: true});
        
        if(resJsonObj.status === 400)
        {
            $("#save").prop("disabled",false);
            
            $("#reset").prop("disabled",false);

            $("#fullname").focus();
        }
        
        else if(resJsonObj.status === 200)
        {
            $("#rollno").prop("disabled",true);
             fillData(resJsonObj);
            
             $("#update").prop("disabled",false);
            
            $("#reset").prop("disabled",false);

            $("#fullname").focus();  
        }   
    }
    