import React, { Component } from 'react';
import { Picker, Platform } from 'react-native';

class MyPicker extends Component {

  componentWillReceiveProps(nextProps) {
    if (Platform.OS === 'android') {
      let selectedIndex = -1;
      nextProps.children.forEach((c, i) => {
        if (c.props.value === nextProps.selectedValue) {
          selectedIndex = i;
        }
      });
      this.refs.picker._reactInternalInstance._renderedComponent._instance.setState({ initialSelectedIndex: selectedIndex, selectedIndex });
    }
  }

  onValueChange(value, index) {
    if (value !== this.props.selectedValue) {
      this.props.onValueChange(value, index);
    }
  }

  render() {
    return (
      <Picker ref='picker' {...this.props} onValueChange={this.onValueChange.bind(this)}>
        {this.props.children}
      </Picker>
    );
  }
}

MyPicker.Item = Picker.Item;

export { MyPicker };