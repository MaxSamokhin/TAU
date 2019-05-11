import React from 'react';
import {connect} from 'react-redux';
import './tau-main.page.scss';
import PvoComponent from './../../components/pvo/pvo.component';
import SvknComponent from '../../components/svkn/svkn.component';
import { Card} from 'antd';
import { Button, notification  } from 'antd';
import Calculation from "../../helpers/calculation";

class TauMainPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (<div className={'tau'}>
            <Button type="primary" size={'large'} onClick={this.handleStartCalculations}>Разыграть сценарий</Button>

            <section className="tau__block">
                <Card className={'tau__svkn'}
                      title="Список потоков СВКН"
                      hoverable={true}
                      style={{ width: 350, margin: '10px'}}>
                    {
                        this.props.svkn && this.props.svkn.map((elem: any, index: number) => {
                            return <SvknComponent key={index} idSvkn={elem.id}/>
                        })
                    }
                </Card>

                <Card className={'tau__pvo'}
                      title="Список целевых каналов системы ПВО"
                      hoverable={true}
                      style={{ width: 350, margin: '10px'}}>
                    {
                        this.props.pvo && this.props.pvo.map((elem: any, index: number) => {
                            return <PvoComponent key={index} idPvo={elem.id}/>
                        })
                    }
                </Card>
            </section>
        </div>);
    }

    handleStartCalculations = () => {
        const svkn = [...this.props.svkn];
        const pvo = [...this.props.pvo];

        svkn.shift();
        pvo.shift();

        if (svkn.length <= 0 ||  pvo.length <= 0 ) {
            notification.open({
                message: 'Внимание!',
                description: 'Для имитационного моделирования необходими ввести как потоки СВКН, так и список целевых каналов',
            });
        }

        const calculation = new Calculation();
        calculation.pvo = pvo;
        calculation.svkn = svkn;

        console.log(calculation.getResult());
    }
}

function mapStateToProps(state: any) {
    return {
        svkn: state.svknReducer.svkn,
        pvo: state.pvoReducer.pvo
    };
}

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TauMainPage);
