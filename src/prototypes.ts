declare global {
    interface String {
        capitalizeFirstLetter(): string;
    }

    interface Array<T> {
        shuffle(): void;
    }
}

String.prototype.capitalizeFirstLetter = function (): string {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
};

Array.prototype.shuffle = function (): void {
    let currentIndex = this.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }
};
