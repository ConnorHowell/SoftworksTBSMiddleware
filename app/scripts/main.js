NProgress.start();
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function clockSort(data) {
    var Monday=0,Tuesday=0,Wednesday=0,Thursday=0,Friday=0;
    for (var i = 0; i < data.length; i++) {
        if (data[i][5].value == '100' & data[i][11].value == '100') {
            var date = moment(data[i][1].value).utc().format('dddd');
            var day = moment(data[i][1].value).utc().weekday();
            var currentDay = moment().utc().weekday();
            if (date == 'Monday' && day <= currentDay) {
                Monday++;
            }
            if (date == 'Tuesday' && day <= currentDay) {
                Tuesday++;
            }
            if (date == 'Wednesday' && day <= currentDay) {
                Wednesday++;
            }
            if (date == 'Thursday' && day <= currentDay) {
                Thursday++;
            }
            if (date == 'Friday' && day <= currentDay) {
                Friday++;
            }
        }
    }
    var array = {
        'Monday': Monday,
        'Tuesday': Tuesday,
        'Wednesday': Wednesday,
        'Thursday': Thursday,
        'Friday': Friday,
    };
    return array;
}

function failedClockSort(data) {
    var Monday=0,Tuesday=0,Wednesday=0,Thursday=0,Friday=0;
    for (var i = 0; i < data.length; i++) {
        if (data[i][5].value == '200' & data[i][11].value == '100') {
            var date = moment(data[i][1].value).utc().format('dddd');
            var day = moment(data[i][1].value).utc().weekday();
            var currentDay = moment().utc().weekday();
            if (date == 'Monday' && day <= currentDay) {
                Monday++;
            }
            if (date == 'Tuesday' && day <= currentDay) {
                Tuesday++;
            }
            if (date == 'Wednesday' && day <= currentDay) {
                Wednesday++;
            }
            if (date == 'Thursday' && day <= currentDay) {
                Thursday++;
            }
            if (date == 'Friday' && day <= currentDay) {
                Friday++;
            }
        }
    }
    var array = {
        'Monday': Monday,
        'Tuesday': Tuesday,
        'Wednesday': Wednesday,
        'Thursday': Thursday,
        'Friday': Friday,
    };
    return array;
}

function typeSort(data) {
    var Clocking=0,Enrollment=0,Admin=0,FailedAuth=0;
    for (var i = 0; i < data.length; i++) {
        if (data[i][5].value == '100') {
            if (data[i][11].value == '100') {
                Clocking++;
            }
            if (data[i][11].value == '400') {
                Enrollment++;
            }
            if (data[i][11].value == '300') {
                Admin++;
            }
        } else if (data[i][5].value == '200') {
            FailedAuth++;
        }
    }
    var array = {
        'Clocking': Clocking,
        'Enrollment': Enrollment,
        'Admin': Admin,
        'FailedAuth': FailedAuth
    };
    return array;
}

function getClockValues () {
    $.ajax({
        url: '/getClockData',
        type: 'POST',
        contentType: 'application/json'
    }).done(function(data) {
        ret = data;
    });
}

$(document).ready(function() {
    $('.modal-trigger').leanModal();
    $.ajax({
        url: '/isValidToken',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'sessionID':getCookie('sessionID')})}
    ).done(function(data) {
        if(data.code !== 1)
        {
            window.location.replace("/login");
        }
    });
    window.dispatchEvent(new Event('resize'));
});

(function () {
    $('.button-collapse').sideNav();
    $('.currentTime').text(moment().format('DDMMYYYYHHmm'));
    $('.loading img').fadeIn(600).removeClass('hide');
    var bootTimeout = window.setTimeout(function setBootTimeout() {
        $('.page').removeClass('hide');
        $('.loading').fadeOut(1000);
        window.clearTimeout(bootTimeout);
    }, 2000)
    , toastTimeout = window.setTimeout(function setToastTimeout() {
        Materialize.toast('Welcome back Admin', 4000);
        window.clearTimeout(toastTimeout);
    }, 3000)
    , secondToastTimeout = window.setTimeout(function setSecondToastTimeout() {
        window.clearTimeout(secondToastTimeout);
    }, 5000);
})();

function showHelp(field) {
    $('.'+field+'_help').removeClass('hidden');
    $('.'+field+'_help').addClass('fadeIn animated');
}

function hideHelp(field) {
    setTimeout(function()
    {
        $('.'+field+'_help').addClass('hidden');
    }, 100);
}

function getLogs() {
    $.ajax({
        url: '/getLogs',
        type: 'POST',
        contentType: 'application/json'
    }).done(function(data) {
        $('.logContents').text(data);
    });
}

function viewContents(filename) {
    $('#fileContents').openModal();
    $('.view_filename').text(filename);
    $('.view_filecontents').text("");
    $.ajax({
        url: '/getContents',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'filename':filename})}
    ).done(function(data) {
        $('.csvContents').empty();
        Papa.parse(data, {
            complete: function(results) {
                var tableRows;
                results.data.forEach(function (row) {
                    tableRows +=
                    '<tr><td>'+
                    row[0]+
                    '</td>'+
                    '<td>'+
                    row[3]+
                    '</td>'+
                    '<td>'+
                    row[4]+
                    '</td>'+
                    '<td>'+
                    row[5]+
                    '</td></tr>';
                });
                $('.csvContents').html(tableRows);
            }
        });
    });
}

function logoutDialog() {
    $('#logoutDialog').openModal();
}

function licenseInfo() {
    $('#licenseDialog').openModal();
}

function performLogout() {
    deleteAllCookies();
    location.reload();
}

function restartService() {
    NProgress.start();
    $.ajax({
        url: '/control',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'eventid':4})}
    );
    NProgress.done();
}

function refreshStatus() {
    NProgress.start();
    $('.statusBar').removeClass('hidden');
    $('.statusBar').addClass('fadeIn animated');
    $.ajax({
        url: '/control',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'eventid':1})}
    );
    setTimeout(function()
    {
        $('.pollTime').addClass('fadeIn animated');
        $('.statusBar').addClass('hidden');
        $('.pollTime').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
    }, 1500);
    NProgress.done();
}

function saveConfigForm() {
    var $inputs = $('#configForm :input');
    var values = {};
    $inputs.each(function() {
        values[this.id] = $(this).val();
    });
    $.ajax({
        url: '/saveConfig',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(values)}
    );
};

function acknowledge() {
    NProgress.start();
    $('.message').addClass('hidden');
    $.ajax({
        url: '/control',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'eventid':3})}
    );
    NProgress.done();
}

function revert() {
    var $inputs = $('#configForm :input');
    var values = {};
    $inputs.each(function() {
        values[this.id] = $(this).val();
    });
    $.ajax({
        url: '/saveConfig',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(values)}
    );
    $.ajax({
        url: '/control',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'eventid':3})}
    );
}

function refreshValue() {
    NProgress.start();
    $('.incrementStatus').removeClass('hidden');
    $('.incrementStatus').addClass('fadeIn animated');
    $.ajax({
        url: '/control',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'eventid':2})}
    );
    setTimeout(function()
    {
        $('.incFile').addClass('fadeIn animated');
        $('.incrementStatus').addClass('hidden');
        $('.incFile').text('Please refresh.');
    }, 1500);
    NProgress.done();
}

$.ajax({
    url: '/getClockData',
    type: 'POST',
    contentType: 'application/json'
}).done(function(data) {
    types = typeSort(data);
    var ctx = document.getElementById("eventChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Clocking',
                'Enrollment',
                'Admin',
                'Failed Authentication'
            ],
            datasets: [{
                backgroundColor: [
                    "#43a047",
                    "#1e88e5",
                    "#cfd8dc",
                    "#e53935"
                ],
                data: [
                    types.Clocking,
                    types.Enrollment,
                    types.Admin,
                    types.FailedAuth
                ]
            }]
        }
    });
});

$.ajax({
    url: '/getClockData',
    type: 'POST',
    contentType: 'application/json'
}).done(function(data) {
    clockings = clockSort(data);
    failed = failedClockSort(data);
    var ctx = document.getElementById('clockChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday'
            ],
            datasets: [{
                label: 'Clockings',
                data: [
                    clockings.Monday,
                    clockings.Tuesday,
                    clockings.Wednesday,
                    clockings.Thursday,
                    clockings.Friday
                ],
                backgroundColor: "rgba(165,214,167,0.4)"
            },{
                label: 'Failed Clockings',
                data: [
                    failed.Monday,
                    failed.Tuesday,
                    failed.Wednesday,
                    failed.Thursday,
                    failed.Friday
                ],
                backgroundColor: "rgba(229, 57, 53, 0.4)"
            }]
        }
    });
});
NProgress.done();
