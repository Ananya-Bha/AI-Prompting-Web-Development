document.getElementById('quadraticForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);
    const method = document.getElementById('method').value;
    
    const result = solveQuadratic(a, b, c, method);
    
    document.getElementById('result').textContent = result;
});

function solveQuadratic(a, b, c, method) {
    const discriminant = (b * b) - (4 * a * c);
    
    if (discriminant < 0) {
        const realPart = (-b / (2 * a)).toFixed(2);
        const imaginaryPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);
        return `x₁ = ${realPart} + ${imaginaryPart}i and x₂ = ${realPart} - ${imaginaryPart}i`;
    } else if (discriminant === 0) {
        const x = (-b / (2 * a)).toFixed(2);
        return `x = ${x}`;
    } else {
        const sqrtDiscriminant = Math.sqrt(discriminant);
        let x1, x2;
        
        x1 = ((-b + sqrtDiscriminant) / (2 * a)).toFixed(2);
        x2 = ((-b - sqrtDiscriminant) / (2 * a)).toFixed(2);
        
        return `x₁ = ${x1} and x₂ = ${x2}`;
    }
}