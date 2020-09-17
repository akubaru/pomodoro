import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class TimerController extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="length-control">
               <div id={this.props.titleId}>
                    {this.props.title}
               </div>
               <button id={this.props.minId}
                    className="btn-level"
                    value="-"
                    onClick={this.props.onClick} >
                        <FontAwesomeIcon icon={["fas", "chevron-circle-down"]} />
               </button>
               <div id={this.props.lengthId}
                    className="btn-level" >
                   {this.props.lenght}
               </div>
               <button id={this.props.addId}
                    className="btn-level"
                    value="+" 
                    onClick={this.props.onClick}>
                        <FontAwesomeIcon icon={["fas", "chevron-circle-up"]} />
               </button>
            </div>
        )
    }
}