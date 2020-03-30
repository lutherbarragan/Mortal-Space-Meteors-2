const canvas = document.getElementsByTagName('canvas');
const ctx = canvas.getContext('2d');

let interval;
let frames = 0;
const imgs = {
	background: ''
};

canvas.width = window.visualViewport.width;
canvas.height = window.visualViewport.height;
