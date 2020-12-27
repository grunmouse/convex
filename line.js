const {isIn} = require('./rectangle-area.js');

/**
 * Находит точку пересечения прямых AB и CD
 */
function intersectLine(A, B, C, D){
	const V = B.sub(A), W = D.sub(C); //Направляющие вектора прямых
	/*
	R_00 = A; R_01 = B; r_0 = V;
	R_10 = C; R_11 = D; r_1 = W;
	
	R = \frac{r_0 (R_11 \times R_10) - r_1 (R_01  \times R_00)}{r_1 \times r_0}
	
	\times - псевдоскалярное произведение
	Опущен - знак умножения на число
	
	R = \frac{V (D \times C) - W (B  \times A)}{W \times V}
	*/
	
	let N = W.cross(V); //Знаменатель выражения
	
	//Проверка нуля
	let ctrl = N.div(W.dot(V));
	if(ctrl < Number.EPSILON){
		return undefined;
	}
	
	const R = V.mul(D.cross(C)).sub(W.mul(B.cross(A))).div(N);
	
	return R;
}

/**
 * Находит точку пересечения отрезков AB и CD
 */
function intersectLinePart(A, B, C, D){
	const R = intersectLine(A, B, C, D);
	if(R && isIn(R, A, B) && isIn(R, C, D)){
		return R;
	}
}

module.exports = {
	intersectLine,
	intersectLinePart
}