import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Count extends Component {
  render() {
    const { itensCartQT } = this.props;

    return (
      <span data-testid="shopping-cart-size">{ itensCartQT }</span>
    );
  }
}

Count.propTypes = {
  itensCartQT: PropTypes.number.isRequired,
};
