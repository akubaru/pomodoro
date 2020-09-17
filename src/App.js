import React from "react";
import TimerController from "./controller/TimerController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./App.css";

localStorage.setItem('example_project', 'pomodoro clock');
class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cycle: "Session",
            workTime: 25,
            breakTime: 5,
            sound: "on",
            timer: 1500,
            timerRun: 'stop',
            intervalId: '',
            alarmColor: {color: 'white'}
        }
        this.soundHandler = this.soundHandler.bind(this);
        this.breakIncrement = this.breakIncrement.bind(this);
        this.workIncrement = this.workIncrement.bind(this);
        this.decrementTimer = this.decrementTimer.bind(this);
        this.reset = this.reset.bind(this);
        this.lengthControl = this.lengthControl.bind(this);
        this.timerControl = this.timerControl.bind(this);
        this.startCount = this.startCount.bind(this);
        this.phaseControl = this.phaseControl.bind(this);
        this.warning = this.warning.bind(this);
        this.buzzer = this.buzzer.bind(this);
        this.switchTimer = this.switchTimer.bind(this);
        this.clockify = this.clockify.bind(this);
    }
    soundHandler(sound) {
        this.setState({
            sound: sound
        })
    }
    breakIncrement(e) {
        this.lengthControl('breakTime', e.currentTarget.value,this.state.breakTime, 'Session');
    }
    workIncrement(e) {
        this.lengthControl('workTime', e.currentTarget.value, this.state.workTime, 'Break');
    }
    decrementTimer() {
        this.setState({
            timer: this.state.timer - 1
        })
    }
    reset() {
        this.setState({
            breakTime: 5,
            workTime: 25,
            timerRun: 'stop',
            cycle: 'Session',
            timer: 1500,
            intervalId: '',
            alarmColor: {color: 'white'}
        });
        this.state.intervalId && clearInterval(this.state.intervalId);
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
    }
    lengthControl(stateToChange, sign, currentLength, cycle) {
        if (this.state.timerRun == 'running') return ;
        if (this.state.cycle == cycle) {
            if (sign == "-" && currentLength != 1) {
                this.setState({[stateToChange]: currentLength - 1});
            } else if (sign == "+" && currentLength != 60) {
                this.setState({[stateToChange]: currentLength + 1});
            }
        } else {
            if (sign == "-" && currentLength != 1) {
                this.setState({
                    [stateToChange]: currentLength - 1,
                    timer: currentLength * 60 - 60});
            } else if (sign == "+" && currentLength != 60) {
                this.setState({
                    [stateToChange]: currentLength + 1,
                    timer: currentLength * 60 + 60});
            }
        }
    }
    timerControl() {
        let control = this.state.timerRun == 'stop' ? (
            this.startCount(),
            this.setState({timerRun: 'running'})
        ) : (
            this.setState({timerRun: 'stop'}),
            this.state.intervalId && clearInterval(this.state.intervalId)
        );
    }
    startCount() {
        this.setState({
            intervalId: setInterval(() => {
                this.decrementTimer();
                this.phaseControl();
            }, 1000)
        })
    }
    phaseControl() {
        let timer = this.state.timer;
        this.warning(timer);
        this.buzzer(timer);
        if (timer < 0) {
            this.state.cycle == 'Session' ? (
                this.state.intervalId && clearInterval(this.state.intervalId),
                this.startCount(),
                this.switchTimer(this.state.breakTime * 60, 'Break')
            ) : (
                this.state.intervalId && clearInterval(this.state.intervalId),
                this.startCount(),
                this.switchTimer(this.state.workTime * 60, 'Session')
            );
        }
    }
    warning(_timer) {
        let warn = _timer < 61 ? this.setState({alarmColor: {color: '#a22222'}}) : this.setState({alarmColor: {color: 'white'}});
    }
    buzzer(_timer) {
        if(_timer === 0) this.audioBeep.play();
    }
    switchTimer(num, str) {
        this.setState({
            timer: num,
            cycle: str,
            alarmColor: {color: 'white'}
        });
    }
    clockify() {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds;
    }
    render() {
        return (
            <div>
                <div className="main-title">
                    <h1>Pomodoro Clock</h1>
                </div>
                <TimerController 
                    titleId="break-label"
                    addId="break-increment"
                    title="Break Time"
                    lenght={this.state.breakTime}
                    minId="break-decrement"
                    lengthId="break-length"
                    onClick={this.breakIncrement} />
                <TimerController
                    titleId="session-label"
                    addId="session-increment"
                    title="Work Time"
                    lenght={this.state.workTime}
                    minId="session-decrement"
                    lengthId="session-length"
                    onClick={this.workIncrement} />
                <div className="timer" style={this.state.alarmColor}>
                    <div className="timer-wrapper">
                        <div id="timer-label">
                            {this.state.cycle}
                        </div>
                        <div id="time-left">
                            {this.clockify()}
                        </div>
                    </div>
                </div>
                <div className="timer-control">
                    <button id="start_stop" onClick={this.timerControl}>
                        <FontAwesomeIcon icon={this.state.timerRun == "running" ? ["fas", "pause-circle"] : ["fas", "play-circle"]} />
                    </button>
                    <button id="reset" onClick={this.reset}>
                        <FontAwesomeIcon icon={["fas", "redo"]} />
                    </button>
                </div>
                <div className="footer">
                    Made by _<a className="button" target="_blank" href="https://github.com/akubaru">Akbar </a><FontAwesomeIcon icon={['fab', 'github']} size="lg"/>
                </div>
                <audio id="beep"
                    preload="auto"
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                    ref={(audio) => {
                        this.audioBeep = audio;
                    }}></audio>
            </div>
        )
    }
}
export default App;