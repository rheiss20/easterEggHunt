/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';

export class PopUpWindow extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      dimensions: {
        width: 0,
        height: 0
      }
    };
  }

  componentDidMount () {
    document.getElementById('giveUpButton').style.display = 'none';
    this.setState({
      dimensions: {
        width: this.handleRef.getBoundingClientRect().width,
        height: this.handleRef.getBoundingClientRect().height
      }
    });
  }

  setHandleRef = ref => {
    this.handleRef = ref;
  };

  initialiseDrag = event => {
    const { clientX, clientY } = event;
    const { left, top, width, height } = this.handleRef.getBoundingClientRect();
    this.dragStartLeft = left;
    this.dragStartTop = top;
    this.dragStartX = clientX;
    this.dragStartY = clientY;
    this.initialLeft = (this.props.windowWidth * 0.5) - (width * 0.375);
    this.initialTop = (this.props.windowHeight * 0.5) - (height * 0.375);
    window.addEventListener('mousemove', this.startDragging, false);
    window.addEventListener('mouseup', this.stopDragging, false);
  };

  startDragging = ({ clientX, clientY }) => {
    this.handleRef.style.transform = `translate(${this.dragStartLeft + clientX - this.dragStartX - this.initialLeft}px, ${this.dragStartTop + clientY - this.dragStartY - this.initialTop}px)`;
  };

  stopDragging = () => {
    window.removeEventListener('mousemove', this.startDragging, false);
    window.removeEventListener('mouseup', this.stopDragging, false);
  };

  render () {
    const left = (this.props.windowWidth * 0.5) - (this.state.dimensions.width * 0.5);
    const top = (this.props.windowHeight * 0.5) - (this.state.dimensions.height * 0.5);

    return <div
      id='popUpWindow'
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 999,
        backgroundColor: 'white',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: 'thick',
        borderRadius: '10px'
      }}
      onMouseDown={this.initialiseDrag}
      ref={this.setHandleRef}
    >
      <h2
        id='popUpWindowHeader'
        style={{
          margin: '0px',
          padding: '10px',
          backgroundColor: 'grey',
          color: 'white',
          fontSize: 24
        }}
      >WARNING</h2>
      <p
        id='popUpWindowParagraph'
        style={{
          margin: '10px 10px 20px 10px',
          fontSize: 16
        }}>
        Unauthorized access of forbidden files has been detected. Please stand by as we attempt to terminate your connection… <br/><br/>
        Do not attempt to close this prompt by clicking an X. <br/><br/>
        Do not move this box by clicking and dragging it.</p>
      <div style={{
        height: '2px',
        color: 'darkgrey',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'grey'
      }}
      ></div>
      <div style={{
        backgroundColor: '#f1f1f1',
        borderStyle: 'inset',
        margin: '20px 10px 10px 10px'
      }}>
        <div
          id="popUpWindowProgressBar"
          style={{
            height: '24px',
            width: '0%',
            backgroundColor: 'red'
          }}>
        </div>
      </div>

      <p
        id="popUpWindowLoadingBarSubtext"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '10px',
          fontSize: 16
        }}>You have <span id="popUpWindowCounter" style={{ margin: '0px 5px' }}>60</span> seconds remaining before you are disconnected</p>
    </div>;
  }
};

PopUpWindow.propTypes = {
  windowWidth: PropTypes.string,
  windowHeight: PropTypes.string
};
