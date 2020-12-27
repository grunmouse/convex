
const jsc = require('jsverify');
const assert = require('assert');
const {
	env,
	bless
} = require('@grunmouse/jsverify-env');

const {Vector2} = require('@grunmouse/math-vector');
const {SquareMatrix2} = require('@grunmouse/math-matrix');


const {
	convex,
	isInConvex,
	intersectConvex,
	isIntersectConvex
} = require('../convex.js');

function makeAffine(d, a11, a12, a21){
	/* 
		d = a11*a22 - a12*a21;
		
		a11*a22 = d + a12*a21;
	*/
	
	const a22 = (d + a12*a21)/a11;
	
	return new SquareMatrix2([
		a11, a12,
		a21, a22
	]);
}

/*
y = C.y/C.x * x;
x = C.x
y = 0;
*/

const affine = bless({
	generator:()=>(
		makeAffine(
			env.o_i(0, 100).generator(), 
			env.o_i(0, 10 ).generator(), 
			env.i_i(-5, 5 ).generator(), 
			env.i_i(-5, 5 ).generator()
		)
	)
});

const abc = [new Vector2(0,0), new Vector2(1,0), new Vector2(1,1)];

const innerPoint = bless(()=>{
	const x = env.o_o().generator();
	const k = env.o_o().generator();
	const y = k*x;
	
	return new Vector2(x, y);
});

const outerPoint = bless(()=>{
	const x = env.i_i(-5, 5 ).generator();
	let   y = env.i_i(-5, 5 ).generator();
	
	if(x>=0 && x<=1 && y>=0){
		y=y+x;
	}
	
	return new Vector2(x, y);
});

const borderPoint = bless(()=>{
	const x = env.o_o().generator();
	return env.elements([
		new Vector2(x, 0),
		new Vector2(x, x),
		new Vector2(1, x)
	]).generator();
});

const axisPoint = env.elements(abc);

describe('convex', ()=>{
	describe('isInConvex', ()=>{
		jsc.property('is in triangular convex', innerPoint, env, (P)=>{
			const triangle = abc;

			return isInConvex(P, triangle);
		});
			
		jsc.property('is in affine triangular convex', innerPoint, affine, env, (P, M)=>{
			P = M.mul(P);
			let triangle = abc.map(v=>(M.mul(v)));

			return isInConvex(P, triangle);
		});	
		
		jsc.property('not is in affine triangular convex', outerPoint, affine, env, (P, M)=>{
			P = M.mul(P);
			let triangle = abc.map(v=>(M.mul(v)));

			return !isInConvex(P, triangle);
		});
		
		it('case 1', ()=>{
			const conv = [
				[31,8],[41,20],[39,44],[3,26],[3,12],[21,3]
			].map(a=>(new Vector2(...a)));
			
			const P = new Vector2(33,41);
			
			assert.ok(isInConvex(P, conv));
		});
			
		/* jsc.property('is border of affine triangular convex', borderPoint, affine, env, (P, M)=>{
			P = M.mul(P);
			let triangle = abc.map(v=>(M.mul(v)));

			return !isInConvex(P, triangle);
		}); */
	});
	
	describe('convex', ()=>{
		it('case 1', ()=>{
			const str = {"conv":[[20,10],[12,24],[7,38],[25,50],[24,50],[49,40],[40,7],[32,2]],"P":[45,35]};
			let S = [str.P].concat(str.conv);
			
			S = S.map(arr=>(new Vector2(...arr)));
			
			const P = new Vector2(...str.P);
			
			let conv = convex(S);
			
			assert.ok(isInConvex(P, conv));
		});		
		
		it('case 2', ()=>{
			const str = {"conv":[[31,8],[41,20],[39,44],[3,26],[3,12],[21,3]],"P":[33,41]};
			let S = [str.P].concat(str.conv);
			
			S = S.map(arr=>(new Vector2(...arr)));
			
			const P = new Vector2(...str.P);
			
			let conv = convex(S);
			
			assert.ok(isInConvex(P, conv));
		});		
		
		it('case 3', ()=>{
			const str = {"conv":[[14,8],[48,13],[3,9],[29,40],[6,49],[3,6]],"P":[17,29]};
			let S = [str.P].concat(str.conv);
			
			S = S.map(arr=>(new Vector2(...arr)));
			
			const P = new Vector2(...str.P);
			
			let conv = convex(S);
			
			assert.ok(isInConvex(P, conv));
		});
		
		jsc.property('convex', 'uarray (integer 3 10) (array 2 (integer 50))', affine, env, (S, M)=>{
			S = S.map(arr=>(new Vector2(...arr)));
			let conv = convex(S);
			
			let S1 = S.filter((C)=>(!conv.includes(C)));
			
			for(let P of S1){
				assert.ok(isInConvex(P, conv), JSON.stringify({conv:conv.map(a=>([...a])), P:[...P]}));
			}
			return true;
		});
	});
});