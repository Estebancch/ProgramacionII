const readlineSync = require('readline-sync');

// Función para validar número
function validarNumero(input) {
  if (isNaN(input)) {
    throw new Error('Error: Debe ingresar un valor numérico.');
  }
  return parseFloat(input);
}

// Función para validar "S" o "N"
function validarSN(input) {
  if (input.toUpperCase() !== 'S' && input.toUpperCase() !== 'N') {
    throw new Error('Error: Debe ingresar "S" o "N".');
  }
  return input.toUpperCase();
}

// Función para validar estrato
function validarEstrato(input) {
  const estrato = parseInt(input);
  if (isNaN(estrato) || estrato < 1 || estrato > 3) {
    throw new Error('Error: El estrato debe ser un número entre 1 y 3.');
  }
  return estrato;
}

// Calcular el subsidio para estudios
function calcularSubsidioEstudio(tipoHijo, salario, numHijos) {
  if (numHijos === 0) {
    return 0;
  }
  const mensaje = `Ingrese el subsidio para hijos de tipo ${tipoHijo} en pesos: `;
  const subsidio = validarNumero(readlineSync.question(mensaje));
  return salario > subsidio ? subsidio : salario;
}

// Calcular el costo total de la nómina
function calcularCostoNomina(empleado) {
  const { salario, estrato, sector, extranjero, genero, numHijos } = empleado;

  let costoTotal = salario;

  if (estrato === 1) {
    costoTotal += salario * 0.15;
  } else if (estrato === 2) {
    costoTotal += salario * 0.10;
  } else if (estrato === 3) {
    costoTotal += salario * 0.05;
  }

  if (sector === 'rural') {
    costoTotal += 35000;
  }

  const subsidioPrimaria = calcularSubsidioEstudio('primaria', salario, numHijos.primaria);
  const subsidioSecundaria = calcularSubsidioEstudio('secundaria', salario, numHijos.secundaria);
  const subsidioUniversidad = calcularSubsidioEstudio('universidad', salario, numHijos.universidad);

  costoTotal += numHijos.primaria * subsidioPrimaria;
  costoTotal += numHijos.secundaria * subsidioSecundaria;
  costoTotal += numHijos.universidad * subsidioUniversidad;

  let costoSubsidioSecundaria = numHijos.secundaria * subsidioSecundaria;

  if (extranjero === 'S') {
    costoTotal += 2 * validarNumero(readlineSync.question('Ingrese el costo de un vuelo internacional en pesos: '));
  }

  return { costoTotal, costoSubsidioSecundaria };
}

// Función principal
function main() {
  const numEmpleados = parseInt(readlineSync.question('Ingrese la cantidad de empleados: '));
  let costoTotalNomina = 0;
  let costoNominaHombres = 0;
  let costoNominaMujeres = 0;
  let empleadoMasCostoso;
  let maxCosto = 0;
  let costoSubsidioSecundaria = 0;
  let costoPasajesExtranjeros = 0;

  for (let i = 0; i < numEmpleados; i++) {
    console.log(`\nEmpleado ${i + 1}`);
    const salario = validarNumero(readlineSync.question('Ingrese el salario del empleado en pesos: '));
    const estrato = validarEstrato(readlineSync.question('Ingrese el estrato del empleado (1 a 3): '));
    const sector = readlineSync.question('Ingrese el sector del empleado (rural/urbano): ');
    const extranjero = validarSN(readlineSync.question('¿Es extranjero? (S/N): '));
    const genero = readlineSync.question('Ingrese el género del empleado (masculino/femenino): ');

    const numHijos = {
      primaria: parseInt(readlineSync.question('Ingrese la cantidad de hijos en primaria: ')),
      secundaria: parseInt(readlineSync.question('Ingrese la cantidad de hijos en secundaria: ')),
      universidad: parseInt(readlineSync.question('Ingrese la cantidad de hijos en universidad: ')),
    };

    const empleado = { salario, estrato, sector, extranjero, genero, numHijos };

    const { costoTotal, costoSubsidioSecundaria: subSecundaria } = calcularCostoNomina(empleado);
    costoTotalNomina += costoTotal;
    costoSubsidioSecundaria += subSecundaria;

    if (genero.toLowerCase() === 'masculino') {
      costoNominaHombres += costoTotal;
    } else {
      costoNominaMujeres += costoTotal;
    }

    if (costoTotal > maxCosto) {
      maxCosto = costoTotal;
      empleadoMasCostoso = `Empleado ${i + 1}`;
    }

    if (extranjero === 'S') {
      costoPasajesExtranjeros += 2 * validarNumero(readlineSync.question('Ingrese el costo de un vuelo internacional en pesos: '));
    }
  }

  console.log('\nResultados:');
  console.log(`1. Costo total de la nómina: $${costoTotalNomina}`);
  console.log(`2. Costo de la nómina de los hombres: $${costoNominaHombres}`);
  console.log(`3. Costo de la nómina de las mujeres: $${costoNominaMujeres}`);
  console.log(`4. Empleado más costoso: ${empleadoMasCostoso}`);
  console.log(`5. Costo de subsidios para hijos en secundaria: $${costoSubsidioSecundaria}`);
  console.log(`6. Costo de pasajes para empleados extranjeros: $${costoPasajesExtranjeros}`);
}

main();
