$.get("count-timer", function (data, status) {
    var tot_timer = parseInt(data);

    for (var i = 0; i < tot_timer; i++) {
        console.log(i);
        var timer = new Timer({id: 'timer-' + i});
        timer.setAttribute('id', 'timer-' + i);
        $("#main-cont").append(timer);
    }
})

