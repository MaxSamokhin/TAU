export default class ChannelPvo {
    private _accuracyIndex: number; // Индекс точности (чем больше, тем точнее, тем больше показатель эффективности)
    private _ammunition: number; // располагаемые на текущий момент боеприпасы
    private _allAmmunition: number; // Боеприпасы все
    private _maxTimeService: number; // Максимальное время обслуживание
    private _minTimeService: number; // Минимальное время обслуживание
    private _numberMissiles: number; // Количество ракет, направленных на одну цель
    private _type: string; // Тип целевого канала
    private _id: string;

    // Дополнительные расчитываемые данные
    private _averageTime: number; // среднее время (входит в показатель эффективности)
    private _efficiency: number; // нормированная эффективность:  пропускная способность, отказ СМО, среднее время ожидания в очереди, среднее количество заявок в очереди и т.д
    private _releaseTime: number = 0; // время освобождения канала, изначально канал свободен (0)

    constructor(value: any) {
        this.id = value.id;
        this.accuracyIndex = +value.accuracyIndex;
        this.ammunition = +value.ammunition;
        this.allAmmunition = +value.ammunition;
        this.maxTimeService = +value.maxTimeService;
        this.minTimeService = +value.minTimeService;
        this.numberMissiles = value.numberMissiles;
        this.type = value.type;

        this.averageTime = (+this.maxTimeService + (+this.minTimeService)) / 2;
    }

    public shot() {
        if (this.ammunition <= 1) {
            this.ammunition = 0;
        } else {
            this.ammunition -= this.numberMissiles;
        }

        this.releaseTime += +this.minTimeService + (Math.random() * (+this.maxTimeService - (+this.minTimeService))); //пересчет времени освобождения
        return this.accuracyIndex;
    }

    get efficiency(): any {
        return +this._efficiency;
    }

    set efficiency(value: any) {
        this._efficiency = 0.6 * (this.accuracyIndex / +value.maxIndex) - 0.4 * (this.averageTime / +value.maxTime);
    }

    get type(): string {
        return this._type;
    }

    get averageTime(): any {
        return +this._averageTime;
    }

    set averageTime(value: any) {
        this._averageTime = +value
    }

    set type(value: string) {
        this._type = value;
    }

    get numberMissiles(): any {
        return +this._numberMissiles;
    }

    set numberMissiles(value: any) {
        if (value === 'one') {
            this._numberMissiles = 1;
            return;
        }

        if (value === 'two') {
            this._numberMissiles = 2;
            return;
        }

        this._numberMissiles = parseInt(value);
    }

    get maxTimeService(): number {
        return +this._maxTimeService;
    }

    set maxTimeService(value: number) {
        this._maxTimeService = +value;
    }

    get minTimeService(): number {
        return +this._minTimeService;
    }

    set minTimeService(value: number) {
        this._minTimeService = +value;
    }

    get ammunition(): number {
        return +this._ammunition;
    }

    set ammunition(value: number) {
        this._ammunition = +value;
    }

    set accuracyIndex(value: number) {
        this._accuracyIndex = +value;
    }

    get accuracyIndex(): number {
        return +this._accuracyIndex;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get releaseTime(): number {
        return +this._releaseTime;
    }

    set releaseTime(value: number) {
        this._releaseTime = +value;
    }

    get allAmmunition(): number {
        return +this._allAmmunition;
    }

    set allAmmunition(value: number) {
        this._allAmmunition = +value;
    }
}
