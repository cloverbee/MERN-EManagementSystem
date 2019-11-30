import React from 'react';
import 'antd/dist/antd.css';
import '../index.css';
import { Upload, Icon, message } from 'antd';
import {connect} from 'react-redux';
import * as actions from '../actions';

import {Form, Input, Tooltip, Cascader, Select, Row, Col, Button, } from 'antd';

const { Option } = Select;

const rankList = [
  {value: 'General',label: 'General',},
  {value: 'Colonel',label: 'Colonel',},
  {value: 'Major',label: 'Major',},
  {value: 'Captain',label: 'Captain',},
  {value: 'Lieutenant',label: 'Lieutenant',},
  {value: 'Warrant Officer',label: 'Warrant Officer',},
  {value: 'Sergeant',label: 'Sergeant',},
  {value: 'Corporal',label: 'Corporal',},
  {value: 'Specialist',label: 'Specialist',},
  {value: 'Private',label: 'Private',},
  //General, Colonel, Major, Captain, Lieutenant, Warrant Officer, Sergeant, Corporal, Specialist, Private)
];



function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  
function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}
  
class Edit extends React.Component{
    componentDidMount(){
        //this.props.detailSoldier(id);/////////////
        //console.log(this.props.detail);
        this.props.getSuperiorList(this.props.detail.data._id);
        //console.log("this.props.detail", this.props.detail);
    }

    state = {
        loading: false,
        imageUrl: this.props.detail.data.avatar,
      };
    
      handleFormSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            //console.log("imgURL", this.state.imageUrl);
            values.avatar = this.state.imageUrl;
            this.props.editSoldier(this.props.detail.data._id, values, this.props.history);
          }
        });
      };
    
      handlePicChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
      };
    
      render() {
        const uploadButton = (
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'} />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
        const { imageUrl } = this.state;

        const { getFieldDecorator } = this.props.form;
        let { superiorData } = [];
        if(this.props.superior){
            superiorData = this.props.superior.data.map(obj => { 
                var rObj = {};
                rObj.value = obj._id;
                rObj.label = obj.name;
                rObj.isLeaf = true;
                return rObj;})
        }
        
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        };
        const tailFormItemLayout = {
          wrapperCol: {
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 16,
              offset: 8,
            },
          },
        };
        const prefixSelector = getFieldDecorator('prefix', {
          initialValue: '1',
        })(
          <Select style={{ width: 70 }}>
            <Option value="86">+86</Option>
            <Option value="1">+1</Option>
          </Select>,
        );        
    
        return (
            <div style={{backgroundColor:'white'}}>
      
            <h2>Edit Soldier</h2>
            <Row >
                <Col span={1} offset={1}>
                    <Upload 
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={this.handlePicChange}
                    >   
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton /*imageUrl || */}
                    </Upload>
                </Col>
                <Col span={20} offset ={1}>
                <Form {...formItemLayout} onSubmit={this.handleFormSubmit} style= {{marginLeft:100 }}>
                    <Form.Item
                        label={
                            <span>
                            Name&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                            </span>
                        }
                    >
                    {getFieldDecorator('name', {
                        initialValue: this.props.detail.data.name,
                        rules: [{ required: false, message: 'Please input your name!', whitespace: true }],
                    })(<Input />)}
                    </Form.Item>

                    <Form.Item label="Rank">
                    {getFieldDecorator('rank', {
                        initialValue: [this.props.detail.data.rank],
                        rules: [
                        { type: 'array', required: false, message: 'Please select your rank!' },
                        ],
                    })(<Cascader options={rankList} />)}
                    </Form.Item>

                    <Form.Item label="Sex">
                    {getFieldDecorator('sex', {
                        initialValue: this.props.detail.data.sex,
                        rules: [
                        {
                            required: false,
                            message: 'Please input your gender!',
                        },
                        ],
                    })(<Input />)}
                    </Form.Item>

                    <Form.Item label="StartDate">
                    {getFieldDecorator('startdate', {
                        initialValue: this.props.detail.data.startdate,
                        rules: [
                        {
                            required: true,
                            message: 'Please input your startdate!',
                        },
                        ],
                    })(<Input />)}
                    </Form.Item>

                    <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                        initialValue: this.props.detail.data.email,
                        rules: [
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: false,
                            message: 'Please input your E-mail!',
                        },
                        ],
                    })(<Input />)}
                    </Form.Item>
                    
                    
                    <Form.Item label="Office Phone">
                    {getFieldDecorator('phone', {
                        initialValue: this.props.detail.data.phone,
                        rules: [{ required: false, message: 'Please input your phone number!' }],
                    })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                    </Form.Item>
                    
                    <Form.Item label="Superior">
                    {getFieldDecorator('superior', {
                        initialValue: [this.props.detail.data.superior,' '],
                        rules: [
                        { type: 'array', required: false, message: 'Please select your suerior!' },
                        ],
                    })(<Cascader options={superiorData}
                      loadData={this.loadData}
                      onChange={this.onManagerChange}
                      changeOnSelect/>)}
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit edit
                    </Button>
                    </Form.Item>
                </Form>
                </Col>
            </Row>
            </div>
        );
      }
}

const mapStateToProps = state => {
    return {
        detail: state.detail,
        superior: state.superior,
    }
}

const mapDispathToProps = (dispatch) => {
    return {
        editSoldier: (id, user, history) => {
            dispatch(actions.editSoldier(id, user, history))
        },
        
        getSuperiorList: (id) => {
            dispatch(actions.getSuperiorList(id));
        }
    }
}
export default connect(mapStateToProps, mapDispathToProps)(Form.create({ name: 'register' })(Edit));

