
const jsc = require('jsverify');
const assert = require('assert');
const {
	env,
	bless
} = require('@grunmouse/jsverify-env');

const {Vector2} = require('@grunmouse/math-vector');
const {SquareMatrix2} = require('@grunmouse/math-matrix');


const {
	isIn,
	rectangleArea,
	intersectRectangle
} = require('../rectangle-area.js');

describe('rectangle-area', ()=>{
	jsc.property('isIn', 'incarray 3 (i_i 50)', 'incarray 3 (i_i 50)', env, (X, Y)=>{
		const A = new Vector2(X[0], Y[0]);
		const B = new Vector2(X[2], Y[2]);
		const R = new Vector2(X[1], Y[1]);
		
		return isIn(R, [A, B]);
	});

	jsc.property('!isIn', 'incarray 3 (i_i 50)', 'incarray 3 (i_i 50)', env, (X, Y)=>{
		const A = new Vector2(X[0], Y[0]);
		const B = new Vector2(X[1], Y[2]);
		const R = new Vector2(X[2], Y[1]);
		
		return !isIn(R, [A, B]);
	});
	
	jsc.property('rectangleArea', 'uarray (integer 3 10) (array 2 (integer 50))', env, (S)=>{
		S = S.map(arr=>(new Vector2(...arr)));
		let conv = rectangleArea(S);
		
		for(let P of S){
			assert.ok(isIn(P, conv), JSON.stringify({conv:conv.map(a=>([...a])), P:[...P]}));
		}
		return true;
	});
	
});