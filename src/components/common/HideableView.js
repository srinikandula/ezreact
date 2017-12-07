import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Animated,Text  } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

 class HideableView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(this.props.visible ? 1 : 0)
    }
  }

componentWillMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
       SplashScreen.hide();
    }

  animate(show) {
    const duration = this.props.duration ? parseInt(this.props.duration) : 500;
    Animated.timing(
      this.state.opacity, {
        toValue: show ? 1 : 0,
        duration: !this.props.noAnimation ? duration : 0
      }
    ).start();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.visible !== nextProps.visible;
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.visible !== nextProps.visible) {
      this.animate(nextProps.visible);
    }
  }

  render() {
    if (this.props.removeWhenHidden && !this.props.visible) {
      return <Text>Hi Sharat</Text>;
    }

    return (
      <Animated.View style={[this.props.style, {opacity: this.state.opacity}]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

HideableView.propTypes = {
  visible: PropTypes.bool.isRequired,
  duration: PropTypes.number,
  removeWhenHidden: PropTypes.bool,
  noAnimation: PropTypes.bool
}

export {HideableView};