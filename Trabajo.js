const readlineSync = require('readline-sync');
const cantidadProductos = +readlineSync.question(`Ingrese la cantidad de productos: `);

let costoTotalFlete = 0;
let mayorDimension = 0;
let productodemayordimension = 0;
let sumaCostos = 0;
let impuestos = 0;

for (let i=0; i<cantidadProductos;i++) {
    console.log(`Producto ${i + 1}:`);

    let Alturadelproducto = readlineSync.question(`Ingrese la altura del producto ${i+1}: `);
    let Anchodelproducto = readlineSync.question(`Ingrese el ancho del producto ${i+1}: `);
    let Profundidaddelproducto = readlineSync.question(`Ingrese la profundidad del producto ${i+1}: `);

    let dimension = Alturadelproducto * Anchodelproducto * Profundidaddelproducto;
    costoTotalFlete += dimension * 100;

    if (dimension > 10000) {
        impuestos += dimension * 0.2;
    } else if (dimension > 1000) {
        impuestos += dimension + 0.1;
    }


    if (dimension > mayorDimension) {
        mayorDimension = dimension;
        productodemayordimension = i + 1;
    }

    sumaCostos += dimension * 100;

}

let promedioCostos = sumaCostos / cantidadProductos;

console.log(`1. Costo total del flete: ${costoTotalFlete + impuestos}`);
console.log(`2. El producto de mayores dimensiones es el producto: ${productodemayordimension}`);
console.log(`3. Promedio del costo de productos en el flete: ${promedioCostos}`);
console.log(`4. La empresa debe pagar ${impuestos} de impuestos por el flete.`);