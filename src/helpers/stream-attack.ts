export default class StreamAttack {

    private _id: string;
    private _airImpactIntensity: number; // Интенсивность воздушного удара +
    private _approachTime: number; // Время подлета ?
    private _dodgeIndex: number; // Индекс уклонения (чем больше, тем труднее сбить) ?
    private _impactCharacteristic: number; // Значение характеристики удара +
    private _isDuration: boolean; // true - продолжительность удара, false - число СВКН в ударе +
    private _type: string;

    // Дополнительные данные
    public timelineOfAirAttack: Array<number> = []; // поток времен нападений
    public numberOfAircrafts: number = 0; //количество СВКН, участвующих в ударе
    public durationOfAirAttack: number; // продолжительность воздушной атаки
    public numberOfDestroyedAircraft: number; //количество СВКН, уничтоженных по результатам моделирования
    public numberOfMissedAircraft: number; //количество СВКН, пропущенных системой ПВО по результатам моделирования
    public pointer: number; //указатель на СВКН в данном потоке

    constructor(value: any) {
        this.id = value.id;
        this.airImpactIntensity = +value.airImpactIntensity;
        this.approachTime = +value.approachTime;
        this.dodgeIndex = +value.dodgeIndex;
        this.impactCharacteristic = +value.impactCharacteristic;
        this.isDuration = value.select;
        this.type = value.type;

        if (this.isDuration) {
            this.generationStreamByDuration();
        } else {
            this.generationStreamByNumber();
        }

        this.pointer = 0;
        this.numberOfDestroyedAircraft = 0;
        this.numberOfMissedAircraft = 0;
    }

    // использовать метод, если _isDuration === true
    public generationStreamByDuration() {
        let currentTime = 0; //текущее время
        let tau = 0; //время между соседними СВКН в ударе
        this.durationOfAirAttack = this.impactCharacteristic;

        while (currentTime < this.impactCharacteristic) {
            tau = (-1 / this.airImpactIntensity) * Math.log(Math.random());
            currentTime += tau;

            if (currentTime <= this.impactCharacteristic) {
                this.timelineOfAirAttack.push(currentTime);
                this.numberOfAircrafts++;
            }
        }
    }

    // использовать метод, если _isDuration === false
    public generationStreamByNumber() { // создание модели потока СВКН по указанному числу СВКН в ударе
        let currentTime = 0; // текущее время
        let tau = 0; // время между соседними СВКН в ударе
        let currentNumber = 0; // текущее число СВКН, вошедших в зону ответственности ПВО на данный момент времени
        this.numberOfAircrafts = this.impactCharacteristic;

        while (currentNumber < this.impactCharacteristic) {
            tau = (-1 / this.airImpactIntensity) * Math.log(Math.random());
            currentTime += tau;
            currentNumber++;
            this.timelineOfAirAttack.push(currentTime);
        }

        this.durationOfAirAttack = currentTime;
    }

    public getDurationOfAirAttack(): { min: number, sec: number } {
        return {
            min: Math.floor(this.durationOfAirAttack), //минуты
            sec: Math.round((this.durationOfAirAttack - Math.floor(this.durationOfAirAttack)) * 60) //секунды
        };
    }

    public incMissedAircraft() {
        this.numberOfMissedAircraft++;
    }

    public clear() {
        if (this.isDuration === true) {
            this.numberOfAircrafts = 0;
        } else {
            this.durationOfAirAttack = 0;
        }

        this.timelineOfAirAttack = [];
    }

    public incPointer() {
        this.pointer++;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get isDuration(): any {
        return this._isDuration;
    }

    set isDuration(value: any) {
        if (value === 'duration') {
            this._isDuration = true;
            return
        }

        this._isDuration = false;
    }

    get impactCharacteristic(): number {
        return +this._impactCharacteristic;
    }

    set impactCharacteristic(value: number) {
        this._impactCharacteristic = +value;
    }

    get dodgeIndex(): number {
        return +this._dodgeIndex;
    }

    set dodgeIndex(value: number) {
        this._dodgeIndex = +value;
    }

    get approachTime(): number {
        return +this._approachTime;
    }

    set approachTime(value: number) {
        this._approachTime = +value;
    }

    get airImpactIntensity(): number {
        return +this._airImpactIntensity;
    }

    set airImpactIntensity(value: number) {
        this._airImpactIntensity = +value;
    }

    public incDestroyedAircraft() {
        this.numberOfDestroyedAircraft++;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }
}
