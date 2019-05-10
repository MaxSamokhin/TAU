import React from 'react';
import {connect} from 'react-redux';
import './pvo.component.scss';
import {Button, Form, Input, Modal, Radio} from 'antd';
import {addPvo} from "./pvo.action";
import {FormComponentProps} from "antd/lib/form";
import {generateId} from "../../helpers/generateId";

interface IProps extends FormComponentProps {
    idPvo: any;
    addPvo: any;
    pvo?: any
}

class PvoComponent extends React.Component<IProps, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            visiblePvoModal: false,
            helpType: "",
            ammunitionHelp: "",
            accuracyIndexHelp: "",
            minTimeServiceHelp: "",
            maxTimeServiceHelp: ""
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        const idPvo = this.props.idPvo ? this.props.idPvo : null;
        const pvo = this.props.pvo;

        const currentPvo = idPvo ? pvo.find((elem: any) => elem.id === idPvo) : pvo[0];
        
        return (<div className="pvo">
            {
                !idPvo ?
                    <Button style={{width: '300px'}} onClick={this.showPvoModal}>
                        Добавить новый целевой канал
                    </Button> :
                    <Button type="link" onClick={this.showPvoModal}>{currentPvo.type}</Button>
            }

            <Modal title="Целевой канал (ЦК)"
                   visible={this.state.visiblePvoModal}
                   onCancel={this.handleCancelPvoModal}
                   footer={[
                       !!idPvo ?<Button key="delete" type="danger" onClick={this.handleDeletePvoModal}>Удалить</Button> : null,
                       <Button key="save" htmlType="submit" type="primary" onClick={this.handleSavePvoModal}>
                           Сохранить
                       </Button>,
                   ]}>

                <Form labelCol={{span: 10}}
                      wrapperCol={{span: 12}}
                      onSubmit={this.handleSubmit}>

                    <Form.Item label="Тип целевого канала"
                               help={this.state.helpType}
                               validateStatus={!!this.state.helpType ? 'error' : 'success'}>
                        {getFieldDecorator('type', {
                            rules: [
                                {required: true},
                                {validator: this.validateType,}
                            ],
                            initialValue: currentPvo.type
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Боезапас (шт)"
                               help={this.state.ammunitionHelp}
                               validateStatus={!!this.state.ammunitionHelp ? 'error' : 'success'}>
                        {getFieldDecorator('ammunition', {
                            rules: [
                                {required: true},
                                {validator: this.validateAmmunition,}
                            ],
                            initialValue: currentPvo.ammunition
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Индекс точности"
                               help={this.state.accuracyIndexHelp}
                               validateStatus={!!this.state.accuracyIndexHelp ? 'error' : 'success'}>
                        {getFieldDecorator('accuracyIndex', {
                            rules: [
                                {required: true},
                                {validator: this.validateAccuracyIndex,}
                            ],
                            initialValue: currentPvo.accuracyIndex
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Количество ракет, направленных на одну цель"
                               help={this.state.numberMissilesHelp}
                               validateStatus={!!this.state.numberMissilesHelp ? 'error' : 'success'}>
                        {getFieldDecorator('numberMissiles', {
                            rules: [
                                {required: true},
                                {validator: this.validateNumberMissiles}
                            ],
                            initialValue: currentPvo.numberMissiles
                        })(
                            <Radio.Group>
                                <Radio.Button value="one">Одна</Radio.Button>
                                <Radio.Button value="two">Две</Radio.Button>
                            </Radio.Group>
                        )}
                    </Form.Item>

                    <Form.Item label="Время обслуживания ЦК минимальное, мин"
                               help={this.state.minTimeServiceHelp}
                               validateStatus={!!this.state.minTimeServiceHelp ? 'error' : 'success'}>
                        {getFieldDecorator('minTimeService', {
                            rules: [
                                {required: true},
                                {validator: this.validateMinTimeService}
                            ],
                            initialValue: currentPvo.minTimeService
                        })(
                            <Input/>
                        )}
                    </Form.Item>

                    <Form.Item label="Время обслуживания ЦК максимальное, мин"
                               help={this.state.maxTimeServiceHelp}
                               validateStatus={!!this.state.maxTimeServiceHelp ? 'error' : 'success'}>
                        {getFieldDecorator('maxTimeService', {
                            rules: [
                                {required: true},
                                {validator: this.validateMaxTimeService,}
                            ],
                            initialValue: currentPvo.maxTimeService
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>);
    }

    validateMaxTimeService = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({maxTimeServiceHelp: 'Пожалуйста, введите время обслуживания ЦК, максимальное'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({maxTimeServiceHelp: 'Максимальное время обслуживания ЦК должено быть числом'});
            return;
        }

        this.setState({maxTimeServiceHelp: ''});

        callback();
    };

    validateMinTimeService = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({minTimeServiceHelp: 'Пожалуйста, введите время обслуживания ЦК, минимальное'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({minTimeServiceHelp: 'Минимальное время обслуживания ЦК должено быть числом'});
            return;
        }

        this.setState({minTimeServiceHelp: ''});

        callback();
    };

    validateNumberMissiles = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({numberMissilesHelp: 'Пожалуйста, введите количество ракет, направленных на одну цель'});
            return;
        }

        this.setState({numberMissilesHelp: ''});

        callback();
    };

    validateAccuracyIndex = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({accuracyIndexHelp: 'Пожалуйста, введите индекс точности'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({accuracyIndexHelp: 'Индекс точности должен быть числом'});
            return;
        }

        this.setState({accuracyIndexHelp: ''});

        callback();
    };

    validateAmmunition = (rule: any, value: any, callback: any) => {
        if (!value) {
            this.setState({ammunitionHelp: 'Пожалуйста, введите боезапас'});
            return;
        }

        if (!this.isNumeric(value)) {
            this.setState({ammunitionHelp: 'Боезапас должен быть числом'});
            return;
        }

        this.setState({ammunitionHelp: ''});

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
                console.log('Received values of form: ', values);

                const {minTimeService, maxTimeService} = values;

                if (+maxTimeService <= +minTimeService) {
                    this.setState({maxTimeServiceHelp: 'Максимальное время обслуживания ЦК должно быть больше минимального'});
                    return;
                }

                this.setState({maxTimeServiceHelp: ''});

                const pvoAll = this.props.pvo;
                const idPvo = this.props.idPvo ? this.props.idPvo : null;

                if (idPvo) {
                    let index = pvoAll.findIndex((elem: any) => elem.id === idPvo);
                    pvoAll[index] = values;
                    pvoAll[index].id = idPvo;
                } else {
                    values.id = generateId();
                    pvoAll.push(values);
                }

                this.props.addPvo(pvoAll);

                this.props.form.resetFields();
                this.handleCancelPvoModal(null);
            }
        });
    };

    handleDeletePvoModal = () => {
        const idPvo = this.props.idPvo ? this.props.idPvo : null;
        const pvo = this.props.pvo;


        let index = pvo.findIndex((elem: any) => elem.id === idPvo);
        pvo.splice(index, 1);

        this.props.addPvo(pvo);

        this.props.form.resetFields();
        this.handleCancelPvoModal(null);
    };

    handleSavePvoModal = (e: any) => {
        this.handleSubmit({
            preventDefault: () => {
            }
        });
    };

    showPvoModal = () => {
        this.setState({
            visiblePvoModal: true,
        });
    };

    handleCancelPvoModal = (e: any) => {
        this.setState({
            visiblePvoModal: false,
        });
    };

    isNumeric(n: any) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}

function mapStateToProps(state: any) {
    return {
        pvo: state.pvoReducer.pvo
    };
}

const mapDispatchToProps = (dispatch: any) => ({
    addPvo: (pvo: any) => {
        dispatch(addPvo(pvo));
    },
});

const WrappedPVO = Form.create<IProps>({name: 'coordinated'})(PvoComponent);

export default  connect(mapStateToProps, mapDispatchToProps)(WrappedPVO);
