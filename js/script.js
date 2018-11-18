const baseUrl = "/c/services/";

var opt_id = '';
var serviceId = 8;
var serviceUrl = "https://www.faridtest.com/content/930522908";
var chainId = 37;

var state = phone;
function submitPhone() {
    var phoneNumber = $("#phone").val();
    var phoneNumberType = checkPhoneNumber(phoneNumber);
    switch (phoneNumberType) {
        case 'MCI':
            $("#phone").hide();
            $("#submitPhoneButton").hide();
            $("#loading").fadeIn(1e3);
            console.log('Phone number sent to server!');
            subscribe(chainId, serviceId, phoneNumber, "35", subscribeDone);
            break;
        case 'NOT-MCI':
            window.location.href = serviceUrl;
            break
    }
}

function submitCode() {
    var phoneNumber = $("#phone").val();
    var code = $("#code").val();
    if(checkCode(code)) {
        $("#loading").fadeIn(1e3);
        console.log('Code sent to server!');
        otpConfirm(chainId, serviceId, phoneNumber, "35", code, confirmDone)
    }
}

function subscribeDone(data) {
    console.log(data.status == '200');
    if(data.status == '200') {
        console.log('Subscribe successful!');
        $(".phone-input").hide();
        $(".send-again").hide();
        $("#submit-code-step").fadeIn(1e3);
        setCounter();
    } else {
        alert("ارسال کد با مشکل مواجه شد");
        $("#phone").val('');
        $("#submit-phone-step").fadeIn(1e3);
    }
    $("#loading").hide();
    console.log('Hide loading');
}

// 
function confirmDone(data) {
    if(data.status.toString() === '200') {
        console.log('Confirm successful!');
        window.location.href = "success?chId=" + chainId;
    } else {
        alert("ارسال کد با مشکل مواجه شد");
        $("#code").val('');
        $("#submit-code-step").fadeIn(1e3);
        console.log('Confirm failure!');
    }
    $("#loading").hide();
    console.log('Hide loading');
}

// check hamrahe aval phone number
function checkPhoneNumber(phoneNumber) {
    var mciPrefix = ['0910', '0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919', '0990', '0991'];

    if(isNaN(phoneNumber) || phoneNumber == '')
        alert("تلفن همراه باید به شکل عدد وارد شود");
    else {
        if(phoneNumber.length === 11) {
            if(phoneNumber.substr(0, 2) === "09") {
                phoneNumberPrefix = phoneNumber.substr(0, 4);
                if (mciPrefix.indexOf(phoneNumberPrefix) != -1) {
                    return 'MCI';
                } else {
                    return 'NOT-MCI';
                }
            } else
                alert("تلفن همراه باید با 09 شروع شود")
        } else
            alert("تلفن همراه باید ۱۱ رقمی باشد")
    }
    return false
}

// check activation code
function checkCode(code) {
    if(isNaN(code) || code === '' || code.length !== 4)
        alert("کد وارد شده باید یک عدد ۴ رقمی باشد!");
    else {
        return true;

    }
    return false
}

// function setCounter() {
//     $("#counter").html(60);
//     var counter = setInterval(
//         function() {
//             var count = parseInt($("#counter").html())-1;
//             $("#counter").html(count);
//             if(count === 0) {
//                 clearInterval(counter);
//                 $("#counter").html("<b>اگر هنوز کد را دریافت نکردید روی دکمه ارسال دوباره کلیک کنید</b>");
//                 $("#send-again").fadeIn(1e3);
//             }
//         }, 1e3)
// }

// $("#phone").keyup(
//     function () {
//         if($(this).val().length === 11)
//             $(this).addClass("active");
//         else
//             $(this).removeClass("active");
//     }
// );

// $("#code").keyup(
//     function () {
//         if($(this).val().length === 4)
//             $(this).addClass("active");
//         else
//             $(this).removeClass("active");
//     }
// );

function subscribe(chainId, serviceId, phoneNumber, landingId, callback) {
    console.log('chainId: ', chainId, 'ServiceId: ', serviceId, 'phoneNumber: ', phoneNumber);
    var result;
    $.post(baseUrl + "server.php",
        {
            method: "subscribe",
            chain_id: chainId,
            service_id: serviceId,
            phone_number: phoneNumber,
            landing_id: landingId
        }
    ).done(
        function (data) {
            result = JSON.parse(data);
            opt_id = result['data'].OptId;
            console.log('Result: ', result['data'].OptId);
            callback(result)
        }
    );
    $("#code").show();
    $("#submitCodeButton").show();
}

function otpConfirm(chainId, serviceId, phoneNumber, landingId, code, callback) {
    var result;
    console.log('--------------------OTP CONFIRM--------------------');
    console.log('chainId: ', chainId, 'ServiceId: ', serviceId, 'phoneNumber: ', phoneNumber, 'code: ', code);
    $.post(baseUrl + "server.php",
        {
            method: "confirm",
            chain_id: chainId,
            service_id: serviceId,
            phone_number: phoneNumber,
            landing_id: landingId,
            code: code,
            opt_id: opt_id
        }
    ).done(
        function (data) {
            result = JSON.parse(data);
            callback(result);
        }
    );
    $("#code").hide();
    $("#submitCodeButton").hide();
    $("#thank-you").show();
}

function getService(serviceId, callback) {
    $.post(baseUrl + "server.php",
        {
            method: "get",
            chain_id: chainId,
            service_id: serviceId,
            phone_number: '',
            landing_id: ''
        }
    ).done(
        function (data) {
            result = JSON.parse(data);
            callback(result);
        }
    );
}

$(window).on("load", function() {
    setTimeout(function(){
        $('img').addClass('display-block');
        $('.loading-big').addClass('display-none');

        $('#img-box').addClass('img-box');
        $('#img-box-door').addClass('img-box-door');
        $('#img-10').addClass('img-10');
        $('#img-gig').addClass('img-gig');
        $('#img-internet').addClass('img-internet');
        $('#img-happy-1').addClass('img-happy-1');
        $('#img-happy-2').addClass('img-happy-2');
    },800)
});