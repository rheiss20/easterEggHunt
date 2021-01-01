import React from 'react';

export class PopUpWindow extends React.Component {
  setHandleRef = ref => {
    this.handleRef = ref;
  };

  initialiseDrag = event => {
    const {target, clientX, clientY} = event;
    const { offsetTop, offsetLeft } = target;
    const { left, top } = this.handleRef.getBoundingClientRect();
    this.dragStartLeft = left - offsetLeft;
    this.dragStartTop = top;
    this.dragStartX = clientX;
    this.dragStartY = clientY;
    window.addEventListener('mousemove', this.startDragging, false);
    window.addEventListener('mouseup', this.stopDragging, false);
  };

  startDragging = ({ clientX, clientY }) => {
    this.handleRef.style.transform = `translate(${this.dragStartLeft + clientX - this.dragStartX}px, ${this.dragStartTop + clientY - this.dragStartY}px)`;
  };

  stopDragging = () => {
    window.removeEventListener('mousemove', this.startDragging, false);
    window.removeEventListener('mouseup', this.stopDragging, false);
  };

  render(){
    return <div
      style={{
        position: "absolute",
        top: 0,
        zIndex: 999,
        backgroundColor: 'white',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 'thick',
        borderRadius: '10px',
      }}
      onMouseDown={this.initialiseDrag}
      ref={this.setHandleRef}
    >
      <h2
      style={{
        margin: '0px',
        padding: '10px',
        backgroundColor: 'grey',
        color: 'white',
        fontSize: 24,
      }}
      >WARNING</h2>
      <p style={{
        margin: '10px 10px 20px 10px',
        fontSize: 16,
      }}>Unauthorized access of forbidden files has been detected. Please stand by as we attempt to terminate your connection… <br/><br/>
        Do not attempt to access files that were previously forbidden while this warning is active.<br/><br/>
        Do not move this box by clicking and dragging it.</p>
      <div style={{
        height: '2px',
        color: 'darkgrey',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'grey',
      }}
      ></div>
      <div style={{
        backgroundColor: '#f1f1f1',
        borderStyle: 'inset',
        margin: '20px 10px 10px 10px',
      }}>
        <div id="progressBar"
             style={{
               height: "24px",
               width: "0%",
               backgroundColor: 'red'
             }}>
        </div>
      </div>

      <p id="myP" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '10px',
        fontSize: 16,
      }}>You have <span id="counter" style={{margin: '0px 5px'}}>60</span> seconds remaining before you are disconnected</p>
    </div>
  }
}
