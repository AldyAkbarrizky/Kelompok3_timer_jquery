class Timer extends HTMLElement {
    constructor(props) {
        super(props)

        console.log(props);

        this.attachShadow({ mode: "open" })

        this.shadowRoot.innerHTML = `
            <slot></slot>
            <div class="timer-container text-center w-33-cent" part="timer-container">
                <div class="stopwatch w-50-cent m-auto" part="stopwatch">
                    <span id="timer" part="timer">00:00:00:00</span>
                </div>
                <div id="button-container" class="my-30">
                    <button id="start-btn" class="btn btn-transparent text-white mx-5" part="button">Start</button>
                    <button id="resume-btn" class="btn btn-transparent text-white mx-5" hidden part="button">Resume</button>
                    <button id="pause-btn" class="btn btn-transparent text-white mx-5" hidden part="button">Pause</button>
                    <button id="stop-btn" class="btn btn-transparent text-white mx-5" part="button">Stop</button>
                    <button id="lap-btn" class="btn btn-transparent text-white mx-5" disabled part="button">Lap</button>
                </div>
                <div part="my-30">
                    <span id="record" part="record-text">Time <br></span>
                </div>
            </div>
        `

        this.playButton = this.shadowRoot.getElementById("start-btn");
        this.resumeButton = this.shadowRoot.getElementById("resume-btn");
        this.pauseButton = this.shadowRoot.getElementById("pause-btn");
        this.resetButton = this.shadowRoot.getElementById("stop-btn");
        this.lapButton = this.shadowRoot.getElementById("lap-btn");
        this.timerText = this.shadowRoot.getElementById("timer");
        this.recordText = this.shadowRoot.getElementById("record");

        this.playButton.onclick = () => this.start();
        this.resumeButton.onclick = () => this.resume();
        this.pauseButton.onclick = () => this.pause();
        this.resetButton.onclick = () => this.reset();
        this.lapButton.onclick = () => this.lap();

        this.timerID = props.id;
        this.startTime;
        this.elapsedTime = 0;
        this.timerInterval;
        this.counter = 1;
        this.prevLap;
        this.state = "stopped";

        console.log(localStorage.getItem("saveData-" + props.id));

        window.addEventListener("beforeunload", (event) => this.save(event));
        this.load();
    }

    save(event) {
        event.preventDefault();

        localStorage.setItem("saveData-" + this.timerID, JSON.stringify({
            state: this.state,
            savedTime: this.elapsedTime,
            record: this.recordText.innerHTML,
            timeClosed: Date.now(),
            counter: this.counter,
            prevLap: this.prevLap
        }));

        var formData = {
            id: 3,
            name: "Naufal Habib Hakim"
        }

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: window.location + "add-timer",
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function(user) {
                alert("Post Success!");
                console.log(user)
            },
            error: function(e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
        });

        return;
    }

    load() {
        // var tot_timer = parseInt(localStorage.getItem("tot_timer"));
        // if(tot_timer === null) {
        //     tot_timer = 0;
        //     localStorage.setItem("tot_timer", tot_timer);
        // }
        var user = "Aldy";
        $.get("timer", {user:user}, function(data, status) {
            alert("User Database: " + data)
        });

        // var formData = {
        //     id: 3,
        //     name: "Naufal Habib Hakim"
        // }

        // $.ajax({
        //     type: "POST",
        //     contentType: "application/json",
        //     url: window.location + "add-timer",
        //     data: JSON.stringify(formData),
        //     dataType: 'json',
        //     success: function(user) {
        //         alert("Post Success!");
        //         console.log(user)
        //     },
        //     error: function(e) {
		// 		alert("Error!")
		// 		console.log("ERROR: ", e);
		// 	}
        // });

        if(this.timerID) {
            const loadData = JSON.parse(localStorage.getItem("saveData-" + this.timerID));
            if(!loadData) return;

            this.elapsedTime = loadData.savedTime;
            
            switch(loadData.state) {
                case "started":
                    this.elapsedTime += (Date.now() - loadData.timeClosed);
                    this.timerText.innerHTML = this.timeToString(this.elapsedTime);
                    this.recordText.innerHTML = loadData.record;
                    this.counter=loadData.counter;
                    this.prevLap=loadData.prevLap;
                    this.state= loadData.state;
                    this.start();
                    break
                case "paused":
                    this.timerText.innerHTML = this.timeToString(this.elapsedTime);
                    this.recordText.innerHTML = loadData.record;
                    this.counter=loadData.counter;
                    this.prevLap=loadData.prevLap;
                    this.state= loadData.state;
                    this.pause();
                    break
                case "stopped":
                    this.timerText.innerHTML = this.timeToString(this.elapsedTime);
                    this.recordText.innerHTML = "Time <br/>";
                    break
            }
        }
    }

    timeToString(time) {
        let diffInHrs = time / 3600000;
        let hh = Math.floor(diffInHrs);
    
        let diffInMin = (diffInHrs - hh) * 60;
        let mm = Math.floor(diffInMin);
    
        let diffInSec = (diffInMin - mm) * 60;
        let ss = Math.floor(diffInSec);
    
        let diffInMs = (diffInSec - ss) * 100;
        let ms = Math.floor(diffInMs);
    
        let formattedHH = hh.toString().padStart(2, "0");
        let formattedMM = mm.toString().padStart(2, "0");
        let formattedSS = ss.toString().padStart(2, "0");
        let formattedMS = ms.toString().padStart(2, "0");
    
        return `${formattedHH}:${formattedMM}:${formattedSS}:${formattedMS}`;
    }

    printResult(hour, minutes, seconds) {  
        let txt = "";
        if (hour != "00") {
            var hourTime = parseInt(hour);
            if (hourTime >= 24) {
                var day = parseInt(hourTime / 24);
                hourTime = hourTime - (day * 24);
                txt = day + " hari " + hourTime + " jam " + minutes + " menit " + seconds + " detik ";            
            }
            else {
                txt = hour + " jam " + minutes + " menit " + seconds + " detik ";
            }        
        }
        else if (minutes != "00")  {
            txt = minutes + " menit " + seconds + " detik ";
        }
        else if (seconds != "00")  {
            txt = seconds + " detik ";
        } else {
            txt = "0 detik"
        }
        return txt
    }

    start() {
        if(this.state == "stopped") {
            this.counter = 1;
            this.recordText.innerHTML = "Time <br/>";
        }
        this.startTime = Date.now() - this.elapsedTime
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.timerText.innerHTML = this.timeToString(this.elapsedTime);
        }, 10);

        this.state = "started";
        this.pauseButton.hidden = false;
        this.playButton.hidden = true;
        this.resumeButton.hidden = true;
        this.lapButton.disabled = false;
        this.resetButton.disabled = false;
    }

    resume() {
        this.startTime = Date.now() - this.elapsedTime
        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.timerText.innerHTML = this.timeToString(this.elapsedTime);
        }, 10);

        this.state = "started";
        this.pauseButton.hidden = false;
        this.playButton.hidden = true;
        this.resumeButton.hidden = true;
        this.lapButton.disabled = false;
        this.resetButton.disabled = false;
    }

    pause() {
        clearInterval(this.timerInterval);

        this.state = "paused";
        this.playButton.hidden = true;
        this.pauseButton.hidden = true;
        this.resumeButton.hidden = false;
        this.lapButton.disabled = true;
    }

    reset() {
        const str = this.timerText.innerHTML;
        const timeArr = str.split(":");
        const final_time = "Final time: " + this.printResult(timeArr[0], timeArr[1], timeArr[2]) + "<br>";
        this.lap();
        this.recordText.innerHTML += final_time
        clearInterval(this.timerInterval);
        this.timerText.innerHTML = "00:00:00:00";
        this.elapsedTime = 0;

        this.state = "stopped";
        this.pauseButton.style.display = "none";
        this.resumeButton.style.display = "none";
        this.playButton.style.display = "inline-block";
        this.lapButton.disabled = true;
        this.resetButton.disabled = true;
        localStorage.removeItem("savedata-" + this.timerID);
    }

    lap() {
        
        const currTime = this.startTime - this.elapsedTime;
        let lapTime = "";
        if(this.counter == 1) {
            lapTime = this.elapsedTime;
        } else {
            lapTime = this.prevLap - currTime;
        }
        const lap_time = " Lap " + this.counter + ". " + this.timerText.innerHTML + " (+" + this.timeToString(lapTime) + ")<br>";
        this.recordText.innerHTML += lap_time;
        this.prevLap = currTime;
        this.counter += 1;
    }
}

$( "#add-btn" ).click(function() {
    var tot_timer = parseInt(localStorage.getItem("tot_timer"));
    if(!tot_timer) tot_timer = 0;
    console.log(tot_timer);
    var timer = new Timer({id: 'timer-' + tot_timer});
    timer.setAttribute('id', 'timer-' + tot_timer);
    document.getElementById('main-cont').appendChild(timer);
    localStorage.setItem("tot_timer", tot_timer + 1);
});

$( "#clear-btn" ).click(function() {
    var tot_timer = parseInt(localStorage.getItem("tot_timer"));
    console.log(tot_timer);
    for (var i = 0; i < tot_timer; i++) {
        console.log("Nomor " + i);
        document.getElementById('timer-' + i).remove();
        localStorage.clear();
    }
});

window.customElements.define("the-timer", Timer)