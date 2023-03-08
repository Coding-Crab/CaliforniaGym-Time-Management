var clock;
var timer;
var datetime;

const framedVideo = document.querySelector('iframe');

var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

var seq = window.localStorage.getItem("seq");
var alarm_item = window.localStorage.getItem("alarm");
if (seq === null) {
    window.localStorage.setItem("seq", 1);
    seq = window.localStorage.getItem("seq");
}
if (alarm_item === null) {
    window.localStorage.setItem("alarm", JSON.stringify({}));
    alarm_item = window.localStorage.getItem("alarm");
}
function unmuted() {
    $(framedVideo).prop('src', 'https://www.youtube.com/embed/HQtFR3mhzOY?autoplay=1&mute=false&enablejsapi=1');
}

seq = parseInt(seq);
alarm_item = $.parseJSON(alarm_item);
window.current_datetime = function() {
    clock = setInterval(function() {
        datetime = new Date();
        var mdm = datetime.toLocaleTimeString().split(' ')[1];
        var hour = datetime.getHours();
        var min = datetime.getMinutes();
        var sec = datetime.getSeconds();
        var month = datetime.getMonth();
        var day = datetime.getDate();
        var year = datetime.getFullYear();
        hr = String(hour).padStart(2, "0");
        min = String(min).padStart(2, "0");
        sec = String(sec).padStart(2, "0");
        day = String(day).padStart(2, "0");
        Object.keys(alarm_item).map(function(k) {
            var _ai = alarm_item[k];
            if (String(hour + ":" + min + ":" + sec) == String(_ai.time + ":00") || String(hour % 12 + ":" + min + ":" + sec) == String(_ai.time + ":00") || String('0' + hour % 12 + ":" + min + ":" + sec) == String(_ai.time + ":00")) {
                let cnts = 1;
                function playonended() {
                    $("audio")[0].play();
                    $(framedVideo).prop('src', 'https://www.youtube.com/embed/HQtFR3mhzOY?autoplay=1&mute=true&enablejsapi=1');
                    if (cnts == _ai.repeat) {
                        $("audio")[0].pause();
                        $(framedVideo).prop('src', 'https://www.youtube.com/embed/HQtFR3mhzOY?autoplay=1&mute=false&enablejsapi=1');
                    }
                    cnts++;
                }
                $("audio")[0].src = _ai.audio;
                $('.alarm-text[data-id="' + _ai.id + '"]').addClass("blinks");
                $(framedVideo).prop('src', 'https://www.youtube.com/embed/HQtFR3mhzOY?autoplay=1&mute=true&enablejsapi=1');
                $("audio")[0].loop = false;
                $("audio")[0].play();
                $("audio")[0].addEventListener("ended", playonended);
                $("audio")[0].addEventListener("ended", unmuted);

            }
        });
        var hr = Math.abs(hour) > 12 ? Math.abs(hour) - 12 : hour;
        var meridiem = hour >= 12 ? "PM" : "AM";
        hr = String(hr).padStart(2, "0");
        var cur_time = hr + ":" + min + ":" + sec + " " + meridiem;
        var cur_date = months[month] + " " + day + ", " + year;
        $("#current_time").text(cur_time);
        $("#current_date").text(cur_date);
    }, 300);
};

window.uniModal = function($title = "", $content = {}, $data = []) {
    var uni = $("#uniModal");
    uni.find(".modal-title").html($title);
    uni.find(".modal-body").html("");
    uni.find(".modal-body").append($content);
    uni.modal("show");
    // Alarm Form Submit
    $content.find("form#alarm-form").submit(function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if ($(this)[0].checkValidity() === false) {
            $(this)[0].reportValidity();
            return false;
        }
        var _hr = $(this).find('[name="hour"]').val();
        var _min = $(this).find('[name="minutes"]').val();
        var _mer = $(this).find('[name="meridein"]').val();
        // for audio
        var _aud = $(this).find('[name="audio"]').find("option:checked").val();
        var _rep = $(this).find('[name="repeat"]').find("option:checked").val();
        _hr = String(_hr).padStart(2, "0");
        _min = String(_min).padStart(2, "0");
        var alarm = _hr + ":" + _min + " " + _mer;
        if (_mer == "PM" && _hr != 12) _hr = Math.abs(_hr) + 12;
        if (_mer == "AM" && _hr == 12) _hr = 0;
        _hr = String(_hr).padStart(2, "0");
        _min = String(_min).padStart(2, "0");
        __time = _hr + ":" + _min;
        if ($(this).find('[name="id"]').val() > 0) {
            var _id = $(this).find('[name="hour"]').val();
        } else {
            seq++;
            localStorage.setItem("seq", seq);
            var _id = seq;
        }
        alarm_item[_id] = { id: _id, time: __time, alarm: alarm, audio: _aud, repeat: _rep };
        localStorage.setItem("alarm", JSON.stringify(alarm_item));
        alert("Alarm Successfully Saved");
        new_alarm_list(_id);
        $(".modal").modal("hide");
    });
   
};


window.new_alarm_list = function(k) {
    var _alarm = alarm_item[k];
    var li = $($("noscript#alarm-item-script").html());
    li.attr("data-id", _alarm.id);
    li.find(".alarm-text").attr("data-id", _alarm.id);
    li.find(".alarm-text").text(_alarm.alarm);
    li.find(".delete-alarm").attr("data-id", _alarm.id);
    $("#alarm-list").append(li);
    li.find(".delete-alarm").click(function() {
        var _conf = confirm("Are you sure to delete " + _alarm.alarm + " alarm?");
        if (_conf === true) {
            delete alarm_item[_alarm.id];
            localStorage.setItem("alarm", JSON.stringify(alarm_item));
            alert("Alarm has been deleted successfully.");
            remove_alarm_list(_alarm.id);
        }
    });
};
window.remove_alarm_list = function(id) {
    $('#alarm-list .alarm-item[data-id="' + id + '"]').remove();
};


$(function() {
    current_datetime();
    $("#start_app").click(function() {
        $("#page-container").removeClass("d-none");
        $("#default-container").addClass("d-none");
    });
  
   
    // Alarm triggers
    Object.keys(alarm_item).map((k) => {
        new_alarm_list(k);
    });

    $("#set_alarm").click(function() {
        uniModal("Set New Alarm", $($("noscript#alarm-form-script").html()));
    });
    // Alarm triggers: End
});