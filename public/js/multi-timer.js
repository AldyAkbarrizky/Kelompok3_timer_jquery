var tot_timer = parseInt(localStorage.getItem("tot_timer"));
if(!tot_timer) {
    tot_timer = 0;
    localStorage.setItem("tot_timer", tot_timer);
}
var timer_cont = document.getElementById("main-cont");

for (var i = 1; i <= tot_timer; i++) {
    console.log(i);
    var timer = new Timer({id: 'timer-' + i});
    timer.setAttribute('id', 'timer-' + i);
    timer_cont.appendChild(timer);
}