interface String {
    capitalizeFirstLetter(): string;
}

String.prototype.capitalizeFirstLetter = function (): string {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
};

interface Array<T> {
    shuffle(): void;
}

Array.prototype.shuffle = function (): void {
    let currentIndex = this.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }
};
