"use strict";
String.prototype.capitalizeFirstLetter = function () {
    return this[0].toUpperCase() + this.slice(1).toLowerCase();
};
Array.prototype.shuffle = function () {
    let currentIndex = this.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
    }
};
