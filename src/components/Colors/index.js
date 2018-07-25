import React, { Component } from 'react';
import { Checkbox, Row, Col, Input } from 'antd';
import styles from './index.less';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss';

class Colors extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    const {
      colorGroup,
      checkedValue,
      labelFoucs,
      labelChange,
      colorChange,
      groupChange,
      showChange,
    } = this.props;

    return (
      <Checkbox.Group style={{ width: '100%' }} value={checkedValue} onChange={groupChange}>
        <Row>
          {colorGroup &&
            colorGroup.length > 0 &&
            colorGroup.map(
              (item, index) =>
                item.show ? (
                  <Col span={8} key={index}>
                    <Checkbox value={index}>
                      <SketchPicker
                        color={item.value}
                        onChange={e => {
                          colorChange(e, index);
                        }}
                      />
                      <input
                        type="text"
                        value={item.label}
                        className={styles.colorInput}
                        onChange={e => {
                          labelChange(e, index);
                        }}
                        onFocus={e => {
                          labelFoucs(e, index);
                        }}
                      />
                    </Checkbox>
                  </Col>
                ) : (
                  <Col span={6} key={index} className={styles.block}>
                    <Checkbox value={index}>
                      <div
                        className={styles.colorBlock}
                        onClick={showChange.bind(this, index)}
                        style={{ backgroundColor: item.value }}
                      />
                      <input
                        type="text"
                        value={item.label}
                        className={styles.colorInput}
                        onChange={e => {
                          labelChange(e, index);
                        }}
                        onFocus={e => {
                          labelFoucs(e, index);
                        }}
                      />
                    </Checkbox>
                  </Col>
                )
            )}
        </Row>
      </Checkbox.Group>
    );
  }
}

export default Colors;
