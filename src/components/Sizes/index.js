import React, { Component } from 'react';
import { Table, Input, Button, Popconfirm, Form, Upload, Modal } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  handleClickOutside = e => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = e => {
    const { record, handleSave } = this.props;
    handleSave({ ...record }, this.cureentColumn, this.focusIndex, e.target.value);
  };

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {form => {
              this.form = form;
              let len = record.sizes.length;
              let newArray = Array(len).fill(len);
              return newArray.map((item, i) => {
                return (
                  <div key={record[dataIndex] + i} className={styles.inputWrap}>
                    <Input
                      ref={node => (this.input = node)}
                      value={record[dataIndex][i]}
                      onChange={e => this.save(e)}
                      onFocus={() => {
                        this.focusIndex = i;
                        this.cureentColumn = dataIndex;
                        this.currentRow = record;
                      }}
                    />
                  </div>
                );
              });
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      previewVisible: false,
      previewImage: '',
    };
    this.columns = [
      {
        title: '颜色',
        dataIndex: 'color',
      },
      {
        title: '尺寸',
        dataIndex: 'sizes',
        render: (text, row, index) => {
          return {
            children: (
              <table className={styles.tdTable}>
                <tbody>
                  {row.sizes.map((item, index) => (
                    <tr key={index} className={styles.sizes}>
                      <td>{item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ),
            props: {
              className: styles.sizeParent,
            },
          };
        },
      },
      {
        title: '售价(元)',
        dataIndex: 'price',
        editable: true,
        width: '20%',
        className: styles.inputs,
      },
      {
        title: '库存',
        dataIndex: 'storage',
        editable: true,
        width: '20%',
        className: styles.inputs,
      },
      {
        title: '图片',
        dataIndex: 'imgs',
        width: '20%',
        render: (text, row, index) => {
          const props = {
            action: '/api/upload',
            listType: 'picture',
            onChange: e => {
              this.upload(e, row, index);
            },
            onPreview: this.handlePreview,
          };
          return {
            children: (
              <table className={styles.tdTable}>
                <tbody>
                  <tr className={styles.uploadBox}>
                    <td>
                      <Upload {...props}>
                        {row.imgs == '' ? (
                          <Button className={styles.upload}>上传图片</Button>
                        ) : null}
                      </Upload>
                      <Modal
                        visible={this.state.previewVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                      >
                        <img
                          alt="example"
                          style={{ width: '100%' }}
                          src={this.state.previewImage}
                        />
                      </Modal>
                    </td>
                  </tr>
                </tbody>
              </table>
            ),
            props: {
              className: styles.sizeParent,
            },
          };
        },
      },
    ];
  }
  //预览大图
  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  //取消预览
  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  };
  //上传商品颜色的图片
  upload = (e, row, index) => {
    const newData = [...this.props.dataSource];
    // console.log(e, row, index)
    console.log(newData[index], 22);
    //上传完毕后赋值img,
    if (e.file.status == 'done') {
      row.imgs = e.file.response.data[0];
      this.setState({
        show: false,
      });
    } else if (e.file.status == 'removed') {
      //删除
      row.imgs = '';
      this.setState({
        show: true,
      });
    }
    newData.splice(index, 1, {
      ...row,
    });
    this.props.handleSave(newData);
  };

  handleSave = (row, column, index, val) => {
    const newData = [...this.props.dataSource];
    row[column][index] = val;
    const rowIndex = newData.findIndex(item => row.key === item.key);
    // console.log('当前行',row,)
    // console.log('当前操作元素',row[column])
    // console.log('当前index',index)
    // console.log('如何修改数据？',rowIndex)

    newData.splice(rowIndex, 1, {
      ...row,
    });
    this.props.handleSave(newData);
  };

  render() {
    const { dataSource } = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <Table
        components={components}
        rowClassName={styles.rows}
        className={styles.table}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    );
  }
}

export default EditableTable;
