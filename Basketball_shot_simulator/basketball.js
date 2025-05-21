const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElem = document.getElementById('score');
const powerFill = document.getElementById('powerFill');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let score = 0;