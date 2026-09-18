import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

export default class Portal extends React.Component {
  state = {
    defaultNode: null,
  };

  componentDidMount() {
    if (!this.props.node) {
      const defaultNode = document.createElement('div');
      document.body.appendChild(defaultNode);
      this.setState({ defaultNode });
    }
  }

  componentWillUnmount() {
    if (this.state.defaultNode) {
      document.body.removeChild(this.state.defaultNode);
    }
  }

  render() {
    const targetNode = this.props.node || this.state.defaultNode;

    if (!targetNode) {
      return null;
    }

    return createPortal(this.props.children, targetNode);
  }
}

Portal.propTypes = {
  node: PropTypes.any,
  children: PropTypes.node,
  isOpened: PropTypes.bool,
};
