import React from 'react';
import {connect} from 'react-redux';
import './svkn.component.scss';
import {Button, Form, Input, Modal, Select} from 'antd';
import {addSvkn} from "./svkn.action";
import {FormComponentProps} from 'antd/lib/form/Form';
import {generateId} from "../../helpers/generateId";

const {Option} = Select;

interface IProps extends FormComponentProps {
    idSvkn: any;
    svkn?: any;
    addSvkn: any;
}

class SvknComponent extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            visibleSvknModal: false,
            helpType: "",
            dodgeIndexHelp: "",
            approachTimeHelp: "",
            airImpactIntensityHelp: "",
            impactCharacteristicHelp: "",
            selectCharacteristic: ""
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const idSvkn = this.props.idSvkn ? this.props.idSvkn : null;
        const svkn = this.props.svkn;

        const currentSvkn = idSvkn ? svkn.find((elem: any) => elem.id === idSvkn) : svkn[0];

        return (<div className="svkn">
            {
                !idSvkn ?
                    <Button style={{width: '300px'}} onClick={this.showSvknModal}>
                        Добавить новый поток СВКН
                    </Button> :
                    <Button type="link" onClick={this.showSvknModal}>{currentSvkn.type}</Button>
            }

            <Modal title="Поток СВКН"
                   visible={this.state.visibleSvknModal}
                   onCancel={this.handleCancelSvknModal}
                   footer={[
                       !!idSvkn ? <Button key="delete" type="danger" onClick={this.handleDeleteSvknModal}>
                           Удалить
                       </Button>: null,
                       <Button key="save" htmlType="submit" type="primary" onClick={this.handleSaveSvknModal}>
                           Сохранить
                       </Button>,
                   ]}>

                <Form labelCol={{span: 10}}
                      wrapperCol={{span: 12}}
                      onSubmit={this.handleSubmit}>

                    <Form.Item label="Тип СВКН"
                               help={this.state.helpType}
                               validateStatus={!!this.state.helpType ? 'error' : 'success'}>
                        {getFieldDecorator('type', {
                            rules: [
                                {
                                    required: true
                                },
                                {
                                    validator: this.validateType,
                                },
                            ],
                            initialValue: currentSvkn.type
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Индекс уклонения"
                               help={this.state.dodgeIndexHelp}
                               validateStatus={!!this.state.dodgeIndexHelp ? 'error' : 'success'}>
                        {getFieldDecorator('dodgeIndex', {
                            rules: [
                                {
                                    required: true
                                },
                                {
                                    validator: this.validateDodgeIndex,
                                }
                            ],
                            initialValue: currentSvkn.dodgeIndex
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Время подлета (мин)"
                               help={this.state.approachTimeHelp}
                               validateStatus={!!this.state.approachTimeHelp ? 'error' : 'success'}>
                        {getFieldDecorator('approachTime', {
                            rules: [
                                {
                                    required: true
                                },
                                {
                                    validator: this.validatorApproachTime,
                                }
                            ],
                            initialValue: currentSvkn.approachTime
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Интенсивность воздушного удара (ед/мин)"
                               help={this.state.airImpactIntensityHelp}
                               validateStatus={!!this.state.airImpactIntensityHelp ? 'error' : 'success'}>
                        {getFieldDecorator('airImpactIntensity', {
                            rules: [
                                {
                                    required: true
                                },
                                {
                                    validator: this.validatorImpactIntensity,
                                }
                            ],
                            initialValue: currentSvkn.airImpactIntensity
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item help={this.state.impactCharacteristicHelp}
                               validateStatus={!!this.state.impactCharacteristicHelp ? 'error' : 'success'}
                               className={'svkn__form-item-line'}>
                        {getFieldDecorator('select', {
                            rules: [
                                {required: true},
                                {validator: this.validatorImpactCharacteristicSelect,}
                            ],
                            initialValue: currentSvkn.select
                        })(
                            <Select placeholder="Характеристика удара">
                                <Option value="duration">Продолжительность удара (мин)</Option>
                                <Option value="count">Число СВКН в ударе (шт)</Option>
                            </Select>
                        )}
                        {getFieldDecorator('impactCharacteristic', {
                            rules: [
                                {
                                    required: true
                                },
                                {
                                    validator: this.validatorImpactCharacteristic,
                                }
                            ],
                            initialValue: currentSvkn.impactCharacteristic
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                </Form>

            </Modal>
        </div>);
    }

    handleDeleteSvknModal = () => {
        console.log('Удалить SVKN');
        const idSvkn = this.props.idSvkn ? this.props.idSvkn : null;
        const svknAll = this.props.svkn;

        let index = svknAll.findIndex((elem: any) => elem.id === idSvkn);
        svknAll.splice(index, 1);

        this.props.addSvkn(svknAll);

        this.props.form.resetFields();
        this.handleCancelSvknModal(null);
    };

    validatorImpactCharacteristicSelect = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({impactCharacteristicHelp: 'Пожалуйста, введите характеристику воздушного удара'});
            return;
        }

        this.setState({impactCharacteristicHelp: ''});

        callback();
    };

    validatorImpactCharacteristic = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({impactCharacteristicHelp: 'Пожалуйста, введите характеристику воздушного удара'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({impactCharacteristicHelp: 'Характеристика воздушного удара должна быть числом'});
            return;
        }

        this.setState({impactCharacteristicHelp: ''});

        callback();
    };

    validatorImpactIntensity = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({airImpactIntensityHelp: 'Пожалуйста, введите интенсивность воздушного удара'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({airImpactIntensityHelp: 'Интенсивность воздушного удара должна быть числом'});
            return;
        }

        this.setState({airImpactIntensityHelp: ''});

        callback();
    };

    validatorApproachTime = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({approachTimeHelp: 'Пожалуйста, введите время подлета'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({approachTimeHelp: 'Время подлета должно быть числом'});
            return;
        }

        this.setState({approachTimeHelp: ''});

        callback();
    };

    validateDodgeIndex = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({dodgeIndexHelp: 'Пожалуйста, введите индекс уклонения'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({dodgeIndexHelp: 'Индекс уклонения должен быть числом'});
            return;
        }

        this.setState({dodgeIndexHelp: ''});

        callback();
    };

    validateType = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({helpType: 'Пожалуйста, введите тип СВКН'});
            return;
        }

        this.setState({helpType: ''});

        callback();
    };

    handleSubmit = (e: any) => {
        e.preventDefault();

        console.log("handle submit");

        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const svknAll = this.props.svkn;
                const idSvkn = this.props.idSvkn ? this.props.idSvkn : null;

                if (idSvkn) {
                    let index = svknAll.findIndex((elem: any) => elem.id === idSvkn);
                    svknAll[index] = values;
                    svknAll[index].id = idSvkn;
                } else {
                    values.id = generateId();
                    svknAll.push(values);
                }

                this.props.addSvkn(svknAll);

                this.props.form.resetFields();
                this.handleCancelSvknModal(null);
            }
        });
    };

    handleSaveSvknModal = (e: any) => {
        this.handleSubmit({
            preventDefault: () => {
            }
        });
    };

    showSvknModal = () => {
        this.setState({
            visibleSvknModal: true,
        });
    };

    handleCancelSvknModal = (e: any) => {
        this.setState({
            visibleSvknModal: false,
        });
    };

    isNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

function mapStateToProps(state: any) {
    return {
        svkn: state.svknReducer.svkn
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    addSvkn: (svkn: any) => {
        dispatch(addSvkn(svkn));
    },
});

const WrappedSVKN = Form.create<IProps>({name: 'coordinated'})(SvknComponent);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedSVKN);
