import React from 'react';
import { MovesInput, PlayButton, PauseButton, ForwardButton, ReverseButton,
  AddMinutesButton, NavigationButton, ElapsedTimeValue, ElapsedTimeRange,
  SpeedValue, SpeedRange } from 'harmoware-vis';
import { ObjectInput } from './object-input.js';

const InputNumber = ({caption,value,step,min,max,onChange}) => {
  return(
    <>{caption}<input type="number" value={value} step={step} min={min} max={max}
      onChange={onChange} required className="harmovis_input_number"/></>
  );
};

export default class Controller extends React.Component {
  updatePos(idx,e){
    const { position, updateState } = this.props;
    position[idx] = Number(e.target.value);
    updateState({position})
  }
  updateOri(idx,e){
    const { getOrientation, updateState } = this.props;
    getOrientation[idx] = Number(e.target.value);
    updateState({getOrientation})
  }
  setViewport() {
    const { objFileData, actions, position:[longitude, latitude] } = this.props;
    if(objFileData) actions.setViewport({longitude, latitude});
  }

  render() {
    const { actions, inputFileName, animatePause, animateReverse, viewport, leading, objFileData,
      settime, timeBegin, timeLength, secperhour, objFileName, position, getOrientation, updateState } = this.props;
    const { movesFileName } = inputFileName;

    return (
        <div className="harmovis_controller">
            <ul className="flex_list">
            <li className="flex_row">
                <div className="harmovis_input_button_column" title='3D object data selection'>
                <label htmlFor="ObjectInput">
                3D object data selection<ObjectInput actions={actions} id="ObjectInput" updateState={updateState}/>
                </label>
                <div>{objFileName}</div>
                </div>
            </li>
            <li className="flex_column">
              <ol><li className="flex_row">
              <InputNumber caption="longitude:" value={position[0]} step="0.0001" min="-180" max="180"
              onChange={this.updatePos.bind(this,0)}/>
              </li><li className="flex_row">
              <InputNumber caption="latitude:" value={position[1]} step="0.0001" min="-90" max="90"
              onChange={this.updatePos.bind(this,1)}/>
              </li><li className="flex_row">
              <InputNumber caption="altitude:" value={position[2]} step="0.1"
              onChange={this.updatePos.bind(this,2)}/>
              </li><li className="flex_row">
              <InputNumber caption="pitch:" value={getOrientation[0]} step="1" min="-180" max="180"
              onChange={this.updateOri.bind(this,0)}/>
              </li><li className="flex_row">
              <InputNumber caption="yaw:" value={getOrientation[1]} step="1" min="-180" max="180"
              onChange={this.updateOri.bind(this,1)}/>
              </li><li className="flex_row">
              <InputNumber caption="roll:" value={getOrientation[2]} step="1" min="-180" max="180"
              onChange={this.updateOri.bind(this,2)}/>
              </li></ol>
            </li>
            <li className="flex_row">
              <button onClick={this.setViewport.bind(this)} disabled={objFileData?false:true}
              className="harmovis_button" title='Move to object position'>Move to object position</button>
            </li>
            <li className="flex_row">
                <div className="harmovis_input_button_column" title='PointCloud data selection'>
                <label htmlFor="MovesInput">
                PointCloud data selection<MovesInput actions={actions} id="MovesInput"/>
                </label>
                <div>{movesFileName}</div>
                </div>
            </li>
            <li className="flex_row">
              {animatePause ?
                <PlayButton actions={actions} />:<PauseButton actions={actions} />
              }&nbsp;
              {animateReverse ?
                <ForwardButton actions={actions} />:<ReverseButton actions={actions} />
              }
            </li>
            <li className="flex_row">
              <AddMinutesButton addMinutes={-10} actions={actions} />&nbsp;
              <AddMinutesButton addMinutes={-5} actions={actions} />
            </li>
            <li className="flex_row">
              <AddMinutesButton addMinutes={5} actions={actions} />&nbsp;
              <AddMinutesButton addMinutes={10} actions={actions} />
            </li>
            <li className="flex_row">
              <NavigationButton buttonType="zoom-in" actions={actions} viewport={viewport} />&nbsp;
              <NavigationButton buttonType="zoom-out" actions={actions} viewport={viewport} />&nbsp;
              <NavigationButton buttonType="compass" actions={actions} viewport={viewport} />
            </li>
            <li className="flex_column">
              <label htmlFor="ElapsedTimeRange">elapsedTime
              <ElapsedTimeValue settime={settime} timeBegin={timeBegin} timeLength={timeLength} actions={actions}
              min={leading*-1} />
              sec</label>
              <ElapsedTimeRange settime={settime} timeLength={timeLength} timeBegin={timeBegin} actions={actions}
              min={leading*-1} id="ElapsedTimeRange" />
            </li>
            <li className="flex_column">
              <label htmlFor="SpeedRange">speed
              <SpeedValue secperhour={secperhour} actions={actions} />sec/hour</label>
              <SpeedRange secperhour={secperhour} actions={actions} id="SpeedRange" />
            </li>
            </ul>
        </div>
    );
  }
}
