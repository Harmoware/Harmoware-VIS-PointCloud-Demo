import React from 'react';
import { PointCloudLayer, SimpleMeshLayer } from 'deck.gl';
import {
  Container, connectToHarmowareVis, HarmoVisLayers, LoadingIcon, FpsDisplay
} from 'harmoware-vis';
import Controller from '../components';

const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN; //Acquire Mapbox accesstoken

class App extends Container {
  constructor(props) {
    super(props);
    this.state = {
      popup: [0, 0, ''],
      objFileName: '',
      objFileData: null,
      position:[136.906428,35.181453,0],
      getColor:[255,255,255,255],
      getOrientation:[0,0,90],
      opacity: 0.1,
    };
  }

  componentDidMount(){
    super.componentDidMount();
    const { actions } = this.props;
    actions.setInitialViewChange(false);
    actions.setSecPerHour(3600);
    actions.setLeading(3);
    actions.setTrailing(3);
    actions.setViewport({longitude:136.906428,latitude:35.181453,zoom:18.5,maxZoom:25,pitch:60,maxPitch:90});
    actions.setDefaultViewport({defaultZoom:18.6,defaultPitch:60});
  }

  updateState(updateData){
    this.setState(updateData);
  }

  onHover(el) {
    if (el && el.object) {
      let disptext = '';
      const objctlist = Object.entries(el.object);
      for (let i = 0, lengthi = objctlist.length; i < lengthi; i=(i+1)|0) {
        const strvalue = objctlist[i][1].toString();
        disptext = disptext + (disptext.length > 0 ? '\n' : '');
        disptext = disptext + (`${objctlist[i][0]}: ${strvalue}`);
      }
      this.setState({ popup: [el.x, el.y, disptext] });
    } else {
      this.setState({ popup: [0, 0, ''] });
    }
  }

  getPointCloudLayer(PointCloudData){
    return PointCloudData.map((pointCloudElements, idx)=>{
      const {pointCloud} = pointCloudElements;
      const data = pointCloud.filter(x=>x.position);
      const onHover = this.onHover.bind(this);
      return new PointCloudLayer({
        id: 'PointCloudLayer-' + String(idx),
        data,
        getColor: x => x.color || [0,255,0,128+x.position[3]*1.28],
        sizeUnits: 'meters',
        pointSize: 0.1,
        onHover
      });
    });
  }

  render() {
    const { actions, viewport, movedData, loading } = this.props;
    const PointCloudData = movedData.filter(x=>x.pointCloud);

    return (
      <div>
        <Controller {...this.props} {...this.state} updateState={this.updateState.bind(this)} />
        <div className="harmovis_area">
          <HarmoVisLayers
            viewport={viewport} actions={actions} visible={false}
            layers={[
                new SimpleMeshLayer({
                  id:'SimpleMeshLayer',
                  data:[{position:this.state.position}],
                  mesh:this.state.objFileData,
                  getColor:this.state.getColor,
                  getOrientation:this.state.getOrientation,
                  opacity:this.state.opacity,
                }),
                PointCloudData.length > 0 ? this.getPointCloudLayer(PointCloudData):null,
            ]}
          />
        </div>
        <div className="harmovis_footer">
          longitude:{viewport.longitude}&nbsp;
          latitude:{viewport.latitude}&nbsp;
          zoom:{viewport.zoom}&nbsp;
          bearing:{viewport.bearing}&nbsp;
          pitch:{viewport.pitch}
        </div>
        <svg width={viewport.width} height={viewport.height} className="harmovis_overlay">
          <g fill="white" fontSize="12">
            {this.state.popup[2].length > 0 ?
              this.state.popup[2].split('\n').map((value, index) =>
                <text
                  x={this.state.popup[0] + 10} y={this.state.popup[1] + (index * 12)}
                  key={index.toString()}
                >{value}</text>) : null
            }
          </g>
        </svg>
        <LoadingIcon loading={loading} />
        <FpsDisplay />
      </div>
    );
  }
}
export default connectToHarmowareVis(App);
