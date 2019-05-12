import ChannelPvo from "./channel-pvo";
import StreamAttack from "./stream-attack";

export default class Calculation {
    private _pvo: Array<ChannelPvo> = [];
    private _svkn: Array<StreamAttack> = [];

    // Результаты
    public numberOfDestroyedAircrafts: number = 0; // уничтоженных СВКН
    public numberOfAircrafts: number = 0; // всего ракет у противника
    public resultForSvkn: Array<string> = [];
    public indexOfCombatEffectiveness: number;

    set pvo(values: any) {
        values.forEach((elem: any) => {
            let channelPvo = new ChannelPvo(elem);
            this._pvo.push(channelPvo);
        });
    }

    get pvo(): any {
        return this._pvo;
    }

    set svkn(values: any) {
        values.forEach((elem: any) => {
            let streamAttack = new StreamAttack(elem);
            this._svkn.push(streamAttack);
        });
    }

    get svkn(): any {
        return this._svkn;
    }

    public getResult() {
        this.efficiencySortingPvo();
        this.startQueuingSystem();

        return {
            numberOfAircrafts: this.numberOfAircrafts,
            numberOfDestroyedAircrafts: this.numberOfDestroyedAircrafts,
            indexOfCombatEffectiveness: this.indexOfCombatEffectiveness,
            svknInfo: [...this.svkn],
            resultForSvkn: this.resultForSvkn
        };
    }

    private startQueuingSystem() {
        //переменные текущего потока
        let numberOfCurrentStream = 0; //номер текущего потока
        let currentPointer = 0; //указатель на СВКН в текущем потоке
        let inputTime = 0; //время входа
        let currentApproachTime = 0; //время подлета к цели
        let currentCriticalTime = 0; //время поражения цели
        let currentDodgeIndex = 0; //индекс уклонения текущего потока

        //переменные текущего канала
        let numberOfCurrentChannel = -1; //номер текущего канала
        let currentNumberMissiles = 0; //кол-во ракет на один залп в текущем канале
        let currentAmmunition = 0; // боезапас в текущем канале
        let currentReleaseTime = 0; // время освобождения в текущем канале
        let timeOfBeginningShoot = 0; // время начала выстрела
        let currentMinimumTime = 0; // минимальное время обслуживания текущего канала
        let currentPrecisionIndex = 0; // индекс точности текущего канала
        let currentProbability = 0; // вероятность сбития текущего СВКН текущим каналом
        let random = 0; // число, определяющее, сбили ли СВКН
        let flagOfRepeat = false;


        this.svkn.forEach((elem: StreamAttack) => {
            this.numberOfAircrafts += elem.numberOfAircrafts;
        });

        // массив времен входа на текущей итерации
        let currentInputTimes: Array<number> = [];

        for (let i = 0; i < this.numberOfAircrafts; i++) {
            //находим, из какого потока будет очередной СВКН
            //сначала выпишем все возможные времена входа из всех потоков в массив

            currentInputTimes = [];

            this.svkn.forEach((svkn: StreamAttack) => {
                if (svkn.pointer < svkn.timelineOfAirAttack.length) {
                    currentPointer = svkn.pointer;
                    currentInputTimes.push(svkn.timelineOfAirAttack[currentPointer]);
                } else {
                    currentInputTimes.push(0);
                }
            });

            //находим номер минимального ненулевого элемента в массиве
            numberOfCurrentStream = currentInputTimes.reduce((res: number, elem: number, j: number): number => {
                if ((elem < res) && (elem > 0)) {
                    res = j;
                    inputTime = currentInputTimes[j];
                }

                return res;
            }, Number.MAX_VALUE);

            // нашли обрабатываемый СВКН в известном потоке - знаем номер потока, время входа СВКН
            currentApproachTime = this.svkn[numberOfCurrentStream].approachTime; // время подлета
            currentCriticalTime = inputTime + currentApproachTime;

            // назначаем канал
            //сначала ищем, есть ли свободный канал, способный стрелять, на момент входа
            for (let index = 0; index < this.pvo.length; index++) {
                currentNumberMissiles = this.pvo[index].numberMissiles; // сколькими ракетами стреляем сразу
                currentAmmunition = this.pvo[index].ammunition; // боезапас
                currentReleaseTime = this.pvo[index].releaseTime; // время освобожденя канала

                if (currentReleaseTime < inputTime && currentAmmunition >= currentNumberMissiles) {
                    numberOfCurrentChannel = index;
                    timeOfBeginningShoot = inputTime;
                    break;
                }
            }

            do {
                // целевой канал, способный стрелять, но не в момент входа свкн в зону поражения,
                // а уже в момент подлета
                if ((numberOfCurrentChannel == -1) || (flagOfRepeat = true)) {
                    timeOfBeginningShoot = Number.MAX_VALUE;
                    this.pvo.forEach((pvo: ChannelPvo, index: number) => {
                        currentNumberMissiles = pvo.numberMissiles; // сколькими ракетами стреляем сразу
                        currentAmmunition = pvo.ammunition; // боезапас
                        currentReleaseTime = pvo.releaseTime; // время освобожденя канала

                        if (currentAmmunition >= currentNumberMissiles && timeOfBeginningShoot > currentReleaseTime) {
                            numberOfCurrentChannel = index;
                            timeOfBeginningShoot = currentReleaseTime
                        }
                    });
                }

                //если канал до сих пор не назначен, значит боеприпасов у ПВО нет даже на один выстрел, записываем пропуск
                if (numberOfCurrentChannel == -1) {

                    this.svkn[numberOfCurrentStream].incMissedAircraft();
                    this.resultForSvkn.push(`СВКН ${(i + 1)} :пропущен из-за нехватки боезапаса`);

                    flagOfRepeat = false;
                } else { //канал назначен
                    //проверяем, успеем ли мы выстрелить

                    currentMinimumTime = this.pvo[numberOfCurrentChannel].minTimeService;
                    if (timeOfBeginningShoot > currentCriticalTime - currentMinimumTime) { //если условие правдиво, стрелять нет смысла

                        this.svkn[numberOfCurrentStream].incMissedAircraft();
                        this.resultForSvkn.push(`СВКН ${(i + 1)} :пропущен из-за нехватки боезапаса`);

                        flagOfRepeat = false;
                    } else {  //стреляем по СВКН
                        currentDodgeIndex = this.svkn[numberOfCurrentStream].dodgeIndex;
                        currentPrecisionIndex = this.pvo[numberOfCurrentChannel].shot(); //пересчет боезапаса, времени освобождения
                        currentProbability = currentPrecisionIndex / currentDodgeIndex;

                        if (currentProbability > 0.95) {
                            currentProbability = 0.95;
                        }
                        random = Math.random();

                        if (random < currentProbability) { //попадание

                            this.svkn[numberOfCurrentStream].incDestroyedAircraft();
                            this.numberOfDestroyedAircrafts++;
                            this.resultForSvkn.push(`СВКН ${(i + 1)} :сбит`);
                            flagOfRepeat = false;
                        } else { //промах

                            this.resultForSvkn.push(`СВКН ${(i + 1)} :промах, попытка повторного выстрела`);
                            flagOfRepeat = true;
                        }
                    }
                }
            } while (flagOfRepeat);

            //увеличение  указателя в рассматриваемом потоке
            this.svkn[numberOfCurrentStream].incPointer();
            //канал для следующего СВКН не назначен
            numberOfCurrentChannel = -1;
        }

        //подсчет показателя боевой эффективности
        this.indexOfCombatEffectiveness = this.numberOfDestroyedAircrafts / this.numberOfAircrafts;
    }

    private efficiencySortingPvo() {
        // максимальный индекс точности
        let maxIndex: number = this.pvo.reduce((res: number, elem: ChannelPvo): number => {
            if (res < +elem.accuracyIndex) {
                res = +elem.accuracyIndex;
                return res;
            }

            return res;
        }, 0);

        // максимальное среднее время обслуживания
        let maxTime: number = this.pvo.reduce((res: number, elem: ChannelPvo): number => {
            if (res < +elem.averageTime) {
                res = +elem.averageTime;
                return res;
            }

            return res;
        }, 0);

        this.pvo.forEach((_: any, index: number) => {
            this.pvo[index].efficiency = {maxIndex, maxTime};
        });

        this.pvo.sort((a: ChannelPvo, b: ChannelPvo) => b.efficiency - a.efficiency);
    }
}
